# Configuration Guide

This directory contains sample configuration files for setting up the **abap-harness-engineering** plugin.

## Installation Methods

This plugin supports three installation paths, each with different configuration requirements:

| Method | SAP Credentials | Config Location |
|--------|----------------|-----------------|
| **Marketplace** | `userConfig` prompt | `plugin.json` |
| **Manual** | `.env` or environment variables | `.mcp.json` |
| **Gemini CLI** | `.env` | `.gemini/settings.json` |

---

## Files

### `env.sample`

SAP system connection credentials. Copy to `.env` in your project root:

```bash
cp config/env.sample .env
```

Then edit `.env` with your SAP system details:
```bash
SAP_URL=https://your-sap-host:8080
SAP_USER=your-username
SAP_PASSWORD=your-password
SAP_CLIENT=100
```

**Security Note:** `.env` is gitignored. Never commit real credentials.

### `mcp.json.sample`

Model Context Protocol (MCP) server configuration for Claude Code.

For **manual installation**, copy and rename:
```bash
cp config/mcp.json.sample .mcp.json
```

Select the platform-specific block (`abap-windows`, `abap-macos`, `abap-linux`) and rename the key to `abap`.

### `.gemini/settings.json.sample` (located in `.gemini/`)

Gemini CLI / Antigravity configuration. Copy within the `.gemini/` directory:
```bash
cp .gemini/settings.json.sample .gemini/settings.json
```

---

## Quick Setup by Installation Type

### Marketplace Install (Recommended)

1. Install via Claude Code: Settings → Plugins → Search "abap-harness-engineering"
2. Enable the plugin in your project
3. Follow the `userConfig` prompts to enter SAP credentials

**No manual configuration files needed.**

### Manual Install

1. Clone or download this plugin
2. Install `vsp` binary: `bash scripts/install-vsp.sh`
3. Copy configuration samples:
   ```bash
   cp config/env.sample .env
   cp config/mcp.json.sample .mcp.json
   ```
4. Edit `.env` with your SAP credentials
5. Configure `.mcp.json` for your platform

### Gemini CLI / Antigravity

1. Clone or download this plugin
2. Install `vsp` binary: `bash scripts/install-vsp.sh`
3. Copy configuration samples:
   ```bash
   cp config/env.sample .env
   cp .gemini/settings.json.sample .gemini/settings.json
   ```
4. Edit `.env` with your SAP credentials
5. Launch Gemini CLI from the project root

---

## Feature Flags

The `vsp` server supports these optional features (enabled by default):

| Flag | Description |
|------|-------------|
| `SAP_FEATURE_ABAPGIT=on` | abapGit integration |
| `SAP_FEATURE_TRANSPORT=on` | CTS transport management |
| `SAP_FEATURE_UI5=on` | Fiori/UI5 support |
| `SAP_FEATURE_RAP=on` | ABAP RESTful Programming Model |

Set to `off` to disable a feature.

---

## Documentation Servers

The plugin includes two HTTP-based documentation MCP servers:

- **abap-docs** - ABAP language reference via [mcp-abap.marianzeis.de](https://mcp-abap.marianzeis.de)
- **sap-docs** - SAP Help Portal via [mcp-sap-docs.marianzeis.de](https://mcp-sap-docs.marianzeis.de)

These are automatically included in all configuration samples.

---

*Last Updated: 2026-05-24*
