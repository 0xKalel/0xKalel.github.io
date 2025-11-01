---
layout: default
title: Chrome DevTools MCP for WSL
---

# Chrome DevTools MCP for WSL

> Guides and resources for using Chrome DevTools MCP with Claude Code in WSL environments

## 📚 Guides

### [Quick Start Guide](./README-CHROME-MCP.md)
Get up and running with Chrome DevTools MCP in WSL in under 5 minutes. Includes installation steps, configuration, and troubleshooting.

**Perfect for:** First-time users, quick setup

---

### [Complete Installation Guide](./CHROME_DEVTOOLS_MCP_WSL_GUIDE.md)
In-depth documentation covering every aspect of installing and configuring Chrome DevTools MCP in WSL. Includes detailed troubleshooting, alternative approaches, and technical explanations.

**Perfect for:** Detailed setup, advanced configuration, troubleshooting complex issues

---

## 🎯 What is Chrome DevTools MCP?

Chrome DevTools MCP is a Model Context Protocol server that allows AI assistants like Claude to interact with Chrome browsers for:

- 🌐 Browser automation and testing
- 📊 Performance analysis and debugging
- 🐛 Network inspection and console monitoring
- 📸 Screenshots and visual testing
- 🔍 Web scraping and data extraction

## 💻 WSL Support

These guides specifically address the challenges of running Chrome DevTools MCP in Windows Subsystem for Linux (WSL), providing solutions for:

- Chrome executable path resolution
- WSL/Windows Chrome bridge issues
- Permission and configuration setup
- Chrome for Testing integration

## 🚀 Quick Install

```bash
# Install Chrome for Testing
npx -y @puppeteer/browsers install chrome@stable --path ~/.local/share/chrome-for-testing

# Configure and enable in Claude Code
# See the Quick Start Guide for complete instructions
```

## 🔗 External Resources

- [Chrome DevTools MCP GitHub](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)

---

**Questions or issues?** Check the [Complete Installation Guide](./CHROME_DEVTOOLS_MCP_WSL_GUIDE.md) for detailed troubleshooting.
