# Installing Chrome DevTools MCP in WSL for Claude Code VSCode Extension

A step-by-step guide to install and configure the Chrome DevTools MCP server in WSL (Windows Subsystem for Linux) for use with the Claude Code VSCode extension.

## Prerequisites

- WSL 2 installed on Windows
- VSCode with Claude Code extension installed
- Node.js and npm installed in WSL

## The Challenge

The Chrome DevTools MCP server expects to find Chrome installed locally. In WSL, you have two options:

1. Use Windows Chrome from WSL (complex, prone to connection issues)
2. Use Chrome for Testing in WSL (recommended, works reliably)

This guide uses option 2 for the best experience.

## Step 1: Install Chrome for Testing

Chrome for Testing is a headless-ready build of Chrome specifically designed for automated testing and tools like MCP servers.

```bash
npx -y @puppeteer/browsers install chrome@stable --path ~/.local/share/chrome-for-testing
```

This will download Chrome to `~/.local/share/chrome-for-testing/chrome/linux-<version>/chrome-linux64/chrome`.

Note the exact path shown in the output - you'll need it in the next step.

## Step 2: Configure the MCP Server

Edit your `~/.claude.json` file and add the chrome-devtools MCP server to your project configuration:

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
            "/home/yourusername/.local/share/chrome-for-testing/chrome/linux-142.0.7444.59/chrome-linux64/chrome",
            "--isolated"
          ],
          "env": {}
        }
      }
    }
  }
}
```

**Important:** Replace `/home/yourusername/.local/share/chrome-for-testing/chrome/linux-142.0.7444.59/chrome-linux64/chrome` with the actual path from Step 1.

The `--isolated` flag creates a temporary user data directory that gets cleaned up automatically after the browser closes.

## Step 3: Configure Permissions

### Global Permissions

Edit `~/.claude/settings.json` and add chrome-devtools permissions to the allow list:

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

### Project Permissions (Optional)

If you want project-specific permissions, edit `.claude/settings.local.json` in your project:

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

## Step 4: Reload VSCode

Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac), type "Developer: Reload Window", and press Enter.

## Step 5: Verify Installation

Check if the MCP server is running:

```bash
claude mcp list
```

You should see:

```
chrome-devtools: npx -y chrome-devtools-mcp@latest -e /home/... - ✓ Connected
```

## Step 6: Test It!

Try opening a page in Claude Code:

```
Can you open https://example.com and take a snapshot?
```

Claude should now be able to:
- Open web pages
- Take screenshots and snapshots
- Analyze performance
- Inspect network requests
- Debug console messages
- And much more!

## Troubleshooting

### "Could not find Google Chrome executable" Error

This means the `-e` path is incorrect. Double-check the path from Step 1 matches exactly what you put in `~/.claude.json`.

### "Protocol error (Target.setDiscoverTargets): Target closed"

This usually happens when trying to use Windows Chrome from WSL. Use Chrome for Testing (Linux version) instead as shown in this guide.

### MCP Server Not Showing in `claude mcp list`

1. Verify your `~/.claude.json` syntax is valid JSON
2. Make sure you've reloaded VSCode
3. Check VSCode logs: `~/.vscode-server/data/logs/*/exthost*/Anthropic.claude-code/Claude VSCode.log`

### Permission Denied Errors

Make sure you've added the chrome-devtools permissions to both:
- `~/.claude/settings.json` (global)
- `.claude/settings.local.json` (project-specific, optional)

## Why This Approach Works

1. **Chrome for Testing** is purpose-built for automation tools and works natively in Linux/WSL
2. **--isolated flag** ensures each session uses a fresh profile, avoiding conflicts
3. **Project-level configuration** in `~/.claude.json` keeps settings organized per project
4. **Autoapprove via permissions** means Claude can use all tools without asking each time

## Alternative: Using Windows Chrome (Not Recommended)

If you really want to use Windows Chrome, you can try:

```json
"args": [
  "-y",
  "chrome-devtools-mcp@latest",
  "-e",
  "/mnt/c/Program Files/Google/Chrome/Application/chrome.exe",
  "--isolated"
]
```

However, this approach has known issues with WSL:
- Connection instability ("Target closed" errors)
- Profile selection dialogs interfering with automation
- WSL-to-Windows binary execution overhead

For the best experience, stick with Chrome for Testing.

## Resources

- [Chrome DevTools MCP GitHub](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [Chrome DevTools MCP Documentation](https://developer.chrome.com/blog/chrome-devtools-mcp)
- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code)
- [MCP Server Configuration Guide](https://modelcontextprotocol.io/)

## Conclusion

With Chrome DevTools MCP installed, Claude Code can now interact with web browsers to help you:

- Debug frontend issues
- Analyze performance bottlenecks
- Test web applications
- Scrape and analyze web content
- Automate browser-based tasks

Happy coding!
