import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function ensureWorkspace(baseDir: string) {
  fs.mkdirSync(baseDir, { recursive: true });
}

function writeIfMissing(filePath: string, content: string) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, `${content}\n`, 'utf8');
  }
}

export function ensureWorkFiles(workDir: string) {
  ensureWorkspace(workDir);

  writeIfMissing(
    path.join(workDir, 'queue.md'),
    [
      '# Maintainer Queue',
      '',
      '- TODO: Prioritized items for implementation',
    ].join('\n')
  );

  writeIfMissing(
    path.join(workDir, 'agent-briefs.md'),
    [
      '# Agent Briefs',
      '',
      'Use this file to write task briefs derived from triage.',
    ].join('\n')
  );

  writeIfMissing(
    path.join(workDir, 'agent-prompts.md'),
    [
      '# Agent Prompts',
      '',
      'Use this file to draft executable prompts for each brief.',
    ].join('\n')
  );

  writeIfMissing(
    path.join(workDir, 'opportunities.md'),
    [
      '# Opportunity Backlog',
      '',
      '- TODO: Docs, onboarding, hygiene, UX improvements',
    ].join('\n')
  );
}

export function listWorkFiles(workDir: string): Array<{ path: string; updatedAt: string }> {
  if (!fs.existsSync(workDir)) return [];
  const entries = fs.readdirSync(workDir);
  return entries.map((entry) => {
    const fullPath = path.join(workDir, entry);
    const stats = fs.statSync(fullPath);
    return {
      path: path.relative(process.cwd(), fullPath),
      updatedAt: stats.mtime.toISOString(),
    };
  });
}

const STATE_FILES = [
  'context.md',
  'decisions.md',
  'contributors.md',
  'patterns.md',
  'standing-rules.md',
];

function loadRepoStateTemplate(): Record<string, string> {
  const fallback: Record<string, string> = {
    'context.md': '# Project Context\n\n## Vision\n\n## Current Priorities\n\n## Success Metrics\n\n## Areas\n\n## Contribution Guidelines\n\n## Tone\n\n## Out of Scope\n',
    'decisions.md': '# Decision Log\n\n## YYYY-MM\n\n### [ISSUE:XX] Title\n**Date:** YYYY-MM-DD\n**Decision:**\n**Reasoning:**\n',
    'contributors.md': '# Contributor Notes\n\n## Active Contributors\n\n## Former Contributors\n',
    'patterns.md': '# Observed Patterns\n\n## Recurring Issues\n\n## Contributor Patterns\n\n## Codebase Patterns\n',
    'standing-rules.md': '# Standing Rules\n\n## Stale Policy\n\n## Auto-Labels\n\n## External PR Handling\n',
  };

  try {
    const here = path.dirname(fileURLToPath(import.meta.url));
    const templatePath = path.resolve(here, '..', '..', 'references', 'repo-state-template.md');
    const content = fs.readFileSync(templatePath, 'utf8');
    const result: Record<string, string> = {};
    for (const fileName of STATE_FILES) {
      const section = extractCodeBlockAfterHeading(content, `## ${fileName}`);
      if (section) {
        result[fileName] = section;
      }
    }
    return { ...fallback, ...result };
  } catch {
    return fallback;
  }
}

function extractCodeBlockAfterHeading(content: string, heading: string): string | null {
  const index = content.indexOf(heading);
  if (index === -1) return null;
  const after = content.slice(index + heading.length);
  const fenceStart = after.indexOf('```');
  if (fenceStart === -1) return null;
  const fenceEnd = after.indexOf('```', fenceStart + 3);
  if (fenceEnd === -1) return null;
  const block = after.slice(fenceStart + 3, fenceEnd);
  const lines = block.split('\n');
  if (lines.length && lines[0].trim().length <= 10) {
    lines.shift();
  }
  const text = lines.join('\n').trimEnd();
  return text ? `${text}\n` : null;
}

export function ensureMaintainerState(maintainerDir: string) {
  ensureWorkspace(maintainerDir);
  const template = loadRepoStateTemplate();
  for (const fileName of STATE_FILES) {
    const filePath = path.join(maintainerDir, fileName);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, `${template[fileName] ?? ''}\n`, 'utf8');
    }
  }
}
