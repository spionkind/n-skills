<div align="center">

<img src="./assets/logo.svg" alt="n-skills" width="400"/>

<br/>
<br/>

**Curated by [Numman Ali](https://x.com/nummanali)**

[![Twitter Follow](https://img.shields.io/twitter/follow/nummanali?style=social)](https://x.com/nummanali)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![agentskills.io](https://img.shields.io/badge/format-agentskills.io-purple.svg)](https://agentskills.io)
[![AGENTS.md](https://img.shields.io/badge/discovery-AGENTS.md-green.svg)](https://www.infoq.com/news/2025/08/agents-md/)

**One marketplace. Every agent. No bullshit.**

[Install](#-quick-start) · [Skills](#-available-skills) · [Submit a Skill](#-want-to-be-featured) · [Philosophy](#-philosophy)

</div>

---

## 💡 Philosophy

> **"Complexity is a drag."**

Every coding agent invented their own instruction format. It's chaos:

```
Claude Code    →  CLAUDE.md, .claude/skills/
GitHub Copilot →  AGENTS.md, copilot-instructions.md, CLAUDE.md, GEMINI.md
Codex          →  SKILL.md, ~/.codex/skills/
Cursor         →  .cursorrules (deprecated), .cursor/rules/*.mdc
Windsurf       →  Cascade Rules, Memories
Cline          →  .clinerules
Factory/Droid  →  .factory/droids/*.md
Amp Code       →  Workspaces via web
Aider          →  AGENTS.md, .aider.conf.json
```

**Maintaining five hand-written cheat sheets is silly.**

### The n-skills Way

We don't fight the fragmentation. We transcend it:

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   SKILL.md          →  The universal skill format      │
│   AGENTS.md         →  The universal discovery file    │
│   openskills        →  The universal installer         │
│                                                         │
│   Write once. Run everywhere.                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

[AGENTS.md](https://www.infoq.com/news/2025/08/agents-md/) is now adopted by **20,000+ repositories** and natively supported by GitHub Copilot, Google Gemini, OpenAI Codex, Factory Droid, Cursor, and more.

**n-skills is just a curated marketplace.** No CLI. No complexity. [openskills](https://github.com/numman-ali/openskills) handles everything else.

---

## 🚀 Quick Start

### Install via OpenSkills (Recommended)

```bash
npm i -g openskills
openskills install numman-ali/n-skills
openskills sync
```

That's it. Works with **every agent**: Claude Code, Cursor, Windsurf, Cline, Aider, and anything that reads AGENTS.md.

> **New to OpenSkills?** It's the universal skills installer. [Learn more →](https://github.com/numman-ali/openskills)

---

<details>
<summary><strong>Prefer native installation?</strong></summary>

If you're adamant about using built-in methods:

**Claude Code:**
```bash
/plugin marketplace add numman-ali/n-skills
/plugin install zai-cli@n-skills
```

**Codex:**
```bash
$skill-installer https://github.com/numman-ali/n-skills/tree/main/skills/tools/zai-cli
```

</details>

---

## 📦 Available Skills

| Skill | Category | Description |
|:------|:---------|:------------|
| **[zai-cli](./skills/tools/zai-cli/)** | `tools` | Z.AI vision, search, reader, and GitHub exploration via MCP |

> More skills coming soon. Want to contribute? See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 🗂️ Categories

| Category | What goes here |
|:---------|:---------------|
| `tools` | CLI tools and utilities |
| `development` | Language-specific dev assistance |
| `productivity` | Workflow automation |
| `automation` | Browser, CI/CD, system automation |
| `data` | Databases, data processing |
| `documentation` | Docs, diagrams, specs |

---

## 🌐 Universal Compatibility

n-skills works everywhere because we use open standards:

| Agent | How it works | Status |
|:------|:-------------|:------:|
| **Claude Code** | Native plugin system | ✅ Native |
| **GitHub Copilot** | Reads AGENTS.md directly | ✅ Native |
| **Codex** | $skill-installer | ✅ Native |
| **Factory/Droid** | Reads AGENTS.md directly | ✅ Native |
| **Cursor** | openskills → AGENTS.md | ✅ Universal |
| **Windsurf** | openskills → AGENTS.md | ✅ Universal |
| **Cline** | openskills → AGENTS.md | ✅ Universal |
| **Aider** | openskills → AGENTS.md | ✅ Universal |
| **Amp Code** | openskills → AGENTS.md | ✅ Universal |

---

## 📁 Repository Structure

```
n-skills/
├── .claude-plugin/
│   └── marketplace.json     # Claude Code registry
├── AGENTS.md                # Universal discovery
├── skills/
│   ├── tools/
│   │   └── zai-cli/         # Flagship skill
│   ├── development/
│   ├── productivity/
│   ├── automation/
│   ├── data/
│   └── documentation/
└── docs/
    ├── skill-format.md      # How to write skills
    ├── cross-platform.md    # Multi-agent compatibility
    └── categories.md        # Category guidelines
```

---

## 🎯 Want to be Featured?

This is a **curated** marketplace. Anyone can request to be included, but only **high-quality, real value-add projects** will be considered.

**What we're looking for:**
- Skills that solve real problems
- Clean, well-documented code
- Genuine utility for developers
- Active maintenance

**Not interested in:**
- Wrapper skills with no real value
- Abandoned or unmaintained projects
- Low-effort submissions

### How to Submit

1. Open an [issue](https://github.com/numman-ali/n-skills/issues) with your skill details
2. Explain what it does and why it's valuable
3. If approved, submit a PR following [CONTRIBUTING.md](CONTRIBUTING.md)

Or DM me on X: [@nummanali](https://x.com/nummanali)

---

## 🔗 Related Projects

- **[openskills](https://github.com/numman-ali/openskills)** — Universal skills installer for all AI agents
- **[zai-cli](https://github.com/numman-ali/zai-cli)** — Z.AI capabilities via CLI and MCP
- **[agentskills.io](https://agentskills.io)** — The open standard for AI agent skills

---

<div align="center">

**Built for developers who value simplicity.**

Apache 2.0 · Made by [@numman-ali](https://github.com/numman-ali)

</div>
