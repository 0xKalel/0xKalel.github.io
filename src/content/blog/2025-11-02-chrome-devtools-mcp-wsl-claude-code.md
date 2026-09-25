---
title: "Connect Claude Code to Chrome in WSL"
description: "Install Chrome, connect the MCP server and check the connection."
date: 2025-11-02
tags: [claude-code, mcp, wsl, chrome-devtools]
---

This setup lets Claude inspect pages, check console errors and test browser interactions in WSL.

These examples date from November 2025. Check the linked documentation for current options and requirements.

## What you need

WSL 2, Node.js, npm, and VS Code with the Claude Code extension.

## Setup

### 1. Install Chrome for Testing

```bash
npx -y @puppeteer/browsers install chrome@stable --path ~/.local/share/chrome-for-testing
```

Save the executable path printed by the installer.

### 2. Configure MCP Server

Add this server entry under your project in `~/.claude.json`:

```json
{
  "projects": {
    "/path/to/your/project": {
      "mcpServers": {
        "chrome-devtools": {
          "type": "stdio",
          "command": "npx",
          "args": [
            "-y",
            "chrome-devtools-mcp@latest",
            "-e",
            "/home/username/.local/share/chrome-for-testing/chrome/linux-VERSION/chrome-linux64/chrome",
            "--isolated"
          ],
          "env": {}
        }
      }
    }
  }
}
```

Replace the project and Chrome paths with your own. `-e` selects the executable; `--isolated` uses a temporary browser profile.

### 3. Set permissions

To allow these tools without individual prompts, add this to `~/.claude/settings.json`. The wildcard covers all Chrome DevTools tools:

```json
{
  "permissions": {
    "allow": [
      "mcp__chrome-devtools__*"
    ]
  }
}
```

### 4. Reload VS Code

Press `Ctrl+Shift+P` → "Developer: Reload Window"

### 5. Check the connection

```bash
claude mcp list
```

You should see:
```
chrome-devtools: ... - ✓ Connected
```

## If it does not connect

- **Chrome not found:** check the installed version folder and update the `-e` path.
- **Target closed:** check whether Chrome starts. If you are launching Windows Chrome, try the Linux installation above.
- **Server missing:** check the JSON syntax, reload VS Code and inspect the extension logs.
- **Permission denied:** check the allow list in your global or project settings.

## Try it

Ask Claude:

```text
Open my local app, report console errors and take a screenshot.
```

Once that works, try a complete workflow such as signing in or submitting a test form.

## Documentation

- [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [Claude Code](https://docs.claude.com/en/docs/claude-code)
- [Chrome for Testing](https://developer.chrome.com/blog/chrome-for-testing/)
