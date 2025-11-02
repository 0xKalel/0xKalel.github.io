---
layout: default
title: "Complete Guide: Installing Chrome DevTools MCP in WSL for Claude Code"
date: 2025-11-02
categories: [AI, Development, Tools]
tags: [claude-code, mcp, wsl, chrome-devtools, automation, ai-development]
description: "Step-by-step guide to install and configure Chrome DevTools MCP server in WSL for Claude Code VSCode extension. Learn browser automation, performance analysis, and AI-assisted web development."
---

# Complete Guide: Installing Chrome DevTools MCP in WSL for Claude Code

Learn how to set up Chrome DevTools Model Context Protocol (MCP) server in Windows Subsystem for Linux (WSL) for seamless integration with Claude Code VSCode extension. This guide covers installation, configuration, troubleshooting, and practical use cases.

## Table of Contents
- [What is Chrome DevTools MCP?](#what-is-chrome-devtools-mcp)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Installation](#detailed-installation)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Use Cases](#use-cases)

## What is Chrome DevTools MCP?

Chrome DevTools MCP is a Model Context Protocol server that enables AI assistants like Claude to interact directly with Chrome browsers. This integration unlocks powerful capabilities:

- **Browser Automation**: Open pages, click elements, fill forms, navigate websites
- **Performance Analysis**: Record traces, analyze Core Web Vitals, identify bottlenecks
- **Network Inspection**: Monitor requests, inspect headers, debug API calls
- **Console Debugging**: Capture and analyze console messages and errors
- **Visual Testing**: Take screenshots, capture DOM snapshots, verify UI elements
- **Web Scraping**: Extract data, analyze content, automate information gathering

## Prerequisites

Before starting, ensure you have:

- **WSL 2** installed on Windows
- **VSCode** with Claude Code extension
- **Node.js and npm** installed in your WSL environment
- Basic command line knowledge

## Quick Start

If you want to get up and running quickly, follow these steps:

### 1. Install Chrome for Testing

```bash
npx -y @puppeteer/browsers install chrome@stable --path ~/.local/share/chrome-for-testing
```

This downloads a headless-ready Chrome build specifically designed for automation.

### 2. Configure MCP Server

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

**Important**: Replace the path with your actual Chrome installation path from step 1.

### 3. Enable Permissions

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

### 4. Reload VSCode

Press `Ctrl+Shift+P` → "Developer: Reload Window"

### 5. Verify Installation

```bash
claude mcp list
```

You should see:
```
chrome-devtools: ... - ✓ Connected
```

## Detailed Installation

### The WSL Challenge

When using Chrome DevTools MCP in WSL, you face two options:

1. **Use Windows Chrome from WSL** (complex, prone to connection issues)
2. **Use Chrome for Testing in WSL** (recommended, reliable)

This guide focuses on option 2 for the best experience.

### Step 1: Install Chrome for Testing

Chrome for Testing is a purpose-built, headless-ready version of Chrome designed for automated testing and tools like MCP servers.

```bash
npx -y @puppeteer/browsers install chrome@stable --path ~/.local/share/chrome-for-testing
```

The installation will output the exact path. Note it down - it will look something like:
```
~/.local/share/chrome-for-testing/chrome/linux-142.0.7444.59/chrome-linux64/chrome
```

### Step 2: Configure the MCP Server

Edit your `~/.claude.json` file and add the chrome-devtools MCP server configuration:

```json
{
  "projects": {
    "/home/username/your-project": {
      "mcpServers": {
        "chrome-devtools": {
          "type": "stdio",
          "command": "npx",
          "args": [
            "-y",
            "chrome-devtools-mcp@latest",
            "-e",
            "/home/username/.local/share/chrome-for-testing/chrome/linux-142.0.7444.59/chrome-linux64/chrome",
            "--isolated"
          ],
          "env": {}
        }
      }
    }
  }
}
```

**Key Configuration Options:**

- **`-e` flag**: Specifies the Chrome executable path
- **`--isolated` flag**: Creates a temporary user data directory that cleans up automatically after the browser closes, ensuring fresh sessions without conflicts

### Step 3: Configure Permissions

You can configure permissions globally or per-project.

#### Global Permissions

Edit `~/.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "mcp__chrome-devtools__click",
      "mcp__chrome-devtools__close_page",
      "mcp__chrome-devtools__drag",
      "mcp__chrome-devtools__emulate",
      "mcp__chrome-devtools__evaluate_script",
      "mcp__chrome-devtools__fill",
      "mcp__chrome-devtools__fill_form",
      "mcp__chrome-devtools__get_console_message",
      "mcp__chrome-devtools__get_network_request",
      "mcp__chrome-devtools__handle_dialog",
      "mcp__chrome-devtools__hover",
      "mcp__chrome-devtools__list_console_messages",
      "mcp__chrome-devtools__list_network_requests",
      "mcp__chrome-devtools__list_pages",
      "mcp__chrome-devtools__navigate_page",
      "mcp__chrome-devtools__new_page",
      "mcp__chrome-devtools__performance_analyze_insight",
      "mcp__chrome-devtools__performance_start_trace",
      "mcp__chrome-devtools__performance_stop_trace",
      "mcp__chrome-devtools__press_key",
      "mcp__chrome-devtools__resize_page",
      "mcp__chrome-devtools__select_page",
      "mcp__chrome-devtools__take_screenshot",
      "mcp__chrome-devtools__take_snapshot",
      "mcp__chrome-devtools__upload_file",
      "mcp__chrome-devtools__wait_for"
    ]
  }
}
```

#### Project-Specific Permissions (Optional)

Create `.claude/settings.local.json` in your project:

```json
{
  "permissions": {
    "allow": [
      "mcp__chrome-devtools__*"
    ]
  }
}
```

The `*` wildcard allows all chrome-devtools tools without listing them individually.

### Step 4: Reload VSCode

Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac), type "Developer: Reload Window", and press Enter.

This reloads the extension and picks up your new MCP configuration.

### Step 5: Verify Installation

Check if the MCP server is connected:

```bash
claude mcp list
```

Expected output:
```
chrome-devtools: npx -y chrome-devtools-mcp@latest -e /home/... - ✓ Connected
```

## Troubleshooting

### "Could not find Google Chrome executable"

**Cause**: The Chrome executable path in `~/.claude.json` doesn't match your installation.

**Solution**: Verify your Chrome for Testing installation path:

```bash
ls ~/.local/share/chrome-for-testing/chrome/
```

Update the `-e` path in `~/.claude.json` to match exactly.

### "Protocol error (Target.setDiscoverTargets): Target closed"

**Cause**: You're attempting to use Windows Chrome from WSL, which has compatibility issues.

**Solution**: Use Chrome for Testing (Linux version) as shown in this guide. Avoid using paths like `/mnt/c/Program Files/Google/Chrome/Application/chrome.exe`.

### MCP Server Not Showing in `claude mcp list`

**Possible causes and solutions:**

1. **Invalid JSON syntax**: Validate your `~/.claude.json` file using a JSON validator
2. **VSCode not reloaded**: Press `Ctrl+Shift+P` → "Developer: Reload Window"
3. **Extension errors**: Check VSCode logs at `~/.vscode-server/data/logs/*/exthost*/Anthropic.claude-code/Claude VSCode.log`

### Permission Denied Errors

**Cause**: Chrome DevTools permissions not configured.

**Solution**: Ensure permissions are added to:
- `~/.claude/settings.json` (global)
- `.claude/settings.local.json` (project-specific, optional)

## Use Cases

### Example 1: Performance Analysis

Ask Claude:
```
Can you open https://example.com and analyze its performance?
Check Core Web Vitals and identify any bottlenecks.
```

Claude will:
- Navigate to the URL
- Start a performance trace
- Analyze metrics (FCP, LCP, CLS, etc.)
- Provide optimization recommendations

### Example 2: Debugging Console Errors

Ask Claude:
```
Open https://myapp.com and check for console errors
```

Claude will:
- Navigate to your application
- Monitor console messages
- Report any errors, warnings, or issues
- Help diagnose the root cause

### Example 3: Visual Testing

Ask Claude:
```
Take a screenshot of the login page at https://myapp.com/login
and verify all form elements are visible
```

Claude will:
- Open the page
- Capture a screenshot
- Analyze the visual elements
- Confirm UI components are rendering correctly

### Example 4: Form Automation

Ask Claude:
```
Fill out the contact form at https://example.com/contact
with test data and submit it
```

Claude will:
- Navigate to the form
- Fill in the fields
- Submit the form
- Verify the submission response

### Example 5: Network Analysis

Ask Claude:
```
Open https://api-example.com and monitor all API calls.
Show me the request/response for the user profile endpoint.
```

Claude will:
- Navigate to the page
- Monitor network traffic
- Filter for specific API calls
- Display request/response details

## Why This Approach Works

### Advantages of Chrome for Testing

1. **Native Linux Support**: Purpose-built for automation, works natively in WSL without Windows bridge issues
2. **Isolated Mode**: The `--isolated` flag ensures each session uses a fresh profile, avoiding conflicts and state issues
3. **Headless-Ready**: Optimized for automated scenarios without GUI dependencies
4. **Reliable**: Designed specifically for testing tools and automation frameworks

### Benefits of MCP Integration

1. **AI-Assisted Debugging**: Claude can analyze browser behavior and suggest fixes
2. **Automated Testing**: Create test scenarios through natural language
3. **Performance Insights**: Get AI-powered analysis of web performance
4. **Documentation**: Generate screenshots and reports automatically
5. **Rapid Prototyping**: Test web interactions without writing code

## Alternative: Using Windows Chrome (Not Recommended)

While you can try using Windows Chrome from WSL:

```json
"args": [
  "-y",
  "chrome-devtools-mcp@latest",
  "-e",
  "/mnt/c/Program Files/Google/Chrome/Application/chrome.exe",
  "--isolated"
]
```

This approach has known issues:
- Connection instability and "Target closed" errors
- Profile selection dialogs interfering with automation
- WSL-to-Windows binary execution overhead
- Firewall and permission complications

**Recommendation**: Use Chrome for Testing for the best experience.

## Resources

- [Chrome DevTools MCP GitHub](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [Chrome DevTools MCP Documentation](https://developer.chrome.com/blog/chrome-devtools-mcp)
- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [Chrome for Testing](https://developer.chrome.com/blog/chrome-for-testing/)

## Conclusion

With Chrome DevTools MCP properly installed in WSL, you unlock powerful browser automation capabilities within Claude Code. This integration enables:

- **Faster debugging**: AI-assisted browser debugging and analysis
- **Automated testing**: Natural language test creation and execution
- **Performance optimization**: AI-powered performance insights
- **Web scraping**: Intelligent data extraction and analysis
- **Development velocity**: Automate repetitive browser tasks

The combination of Claude's intelligence with Chrome's DevTools creates a powerful workflow for modern web development.

---

**Questions or issues?** Feel free to reach out on [GitHub](https://github.com/0xKalel) or [LinkedIn](https://www.linkedin.com/in/hebachi-khalil/).

**Found this helpful?** Share it with other developers working with Claude Code and WSL!
