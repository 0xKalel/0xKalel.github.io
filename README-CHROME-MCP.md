# Chrome DevTools MCP for WSL - Quick Setup Guide

> Get Chrome DevTools MCP working seamlessly in WSL with Claude Code VSCode Extension

[![Chrome DevTools MCP](https://img.shields.io/badge/Chrome_DevTools-MCP-blue)](https://github.com/ChromeDevTools/chrome-devtools-mcp)
[![WSL](https://img.shields.io/badge/WSL-2-green)](https://docs.microsoft.com/en-us/windows/wsl/)
[![Claude Code](https://img.shields.io/badge/Claude_Code-VSCode-purple)](https://docs.claude.com/en/docs/claude-code)

## 🚀 Quick Start

### Install Chrome for Testing

```bash
npx -y @puppeteer/browsers install chrome@stable --path ~/.local/share/chrome-for-testing
```

### Configure MCP Server

Add to your `~/.claude.json`:

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

> **Note:** Replace the path with your actual Chrome for Testing installation path.

### Enable Permissions

Add to `~/.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "mcp__chrome-devtools__*"
    ]
  }
}
```

Or for project-specific permissions, add to `.claude/settings.local.json` in your project.

### Reload VSCode

Press `Ctrl+Shift+P` → "Developer: Reload Window"

## ✅ Verify Installation

```bash
claude mcp list
```

Should show:
```
chrome-devtools: ... - ✓ Connected
```

## 🎯 What You Can Do

- 🌐 **Browser Automation**: Open pages, click, fill forms
- 📊 **Performance Analysis**: Record traces, analyze Core Web Vitals
- 🐛 **Debugging**: Inspect network requests, console messages
- 📸 **Screenshots**: Capture full pages or specific elements
- 🔍 **Testing**: Automate browser-based testing workflows

## 💡 Example Usage

Ask Claude in VSCode:

```
Can you open https://example.com and analyze its performance?
```

```
Take a screenshot of the homepage and check for console errors
```

```
Fill out the login form and submit it
```

## 🔧 Troubleshooting

### "Could not find Google Chrome executable"

Double-check the Chrome path in `~/.claude.json` matches your installation:

```bash
ls ~/.local/share/chrome-for-testing/chrome/
```

### "Protocol error: Target closed"

You're probably trying to use Windows Chrome. Use Chrome for Testing (Linux version) instead as shown above.

### MCP Not Connected

1. Verify JSON syntax in `~/.claude.json`
2. Reload VSCode window
3. Check permissions are configured

## 📚 Full Documentation

For detailed installation steps, troubleshooting, and advanced configuration, see [CHROME_DEVTOOLS_MCP_WSL_GUIDE.md](./CHROME_DEVTOOLS_MCP_WSL_GUIDE.md)

## ⚡ Why This Approach?

- ✅ **Native Linux Chrome**: No WSL/Windows bridge issues
- ✅ **Isolated Mode**: Fresh profile for each session
- ✅ **Auto-approve**: No permission prompts every time
- ✅ **Reliable**: Purpose-built for automation

## 🔗 Resources

- [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [Claude Code Docs](https://docs.claude.com/en/docs/claude-code)
- [MCP Protocol](https://modelcontextprotocol.io/)

## 📝 License

This guide is provided as-is for educational purposes.

---

**Made with ❤️ for the Claude Code community**

*Having issues? Open an issue or check the [full guide](./CHROME_DEVTOOLS_MCP_WSL_GUIDE.md) for detailed troubleshooting.*
