# use-multiple-gits

[![npm version](https://img.shields.io/npm/v/use-multiple-gits.svg)](https://www.npmjs.com/package/use-multiple-gits)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A CLI tool to easily manage multiple git configurations (user.name, user.email, SSH keys) with simple switching commands. Perfect for developers who work with multiple Git identities (work, personal, different organizations).

## 🚀 Quick Start (3 Steps)

### Step 1: Install & Setup

```bash
npm install -g use-multiple-gits && multiGit setup
```

Or use the automated script:

```bash
curl -fsSL https://raw.githubusercontent.com/narek941/use-multiple-gits/main/setup.sh | bash
```

### Step 2: Add Your First Configuration

```bash
multiGit add work --generate-ssh-key
```

You'll be prompted for:

- Display name (e.g., "Work")
- Git user.name
- Git user.email
- SSH key filename (auto-generated if using `--generate-ssh-key`)

### Step 3: Use It!

```bash
source ~/.zshrc  # Reload shell (or restart terminal)
use-work         # Switch to work configuration
```

That's it! 🎉

## 📖 Complete Example

```bash
# 1. Install and setup
npm install -g use-multiple-gits && multiGit setup

# 2. Add work configuration (with auto-generated SSH key)
multiGit add work --generate-ssh-key
# Enter: Work, John Doe, john@company.com

# 3. Add personal configuration
multiGit add personal --generate-ssh-key
# Enter: Personal, John Doe, john@gmail.com

# 4. Reload shell
source ~/.zshrc

# 5. Switch between identities
use-work      # Switch to work
use-personal  # Switch to personal
```

## ✨ Features

- ✅ **One-Command Setup**: Automated installation and configuration
- ✅ **Auto SSH Key Generation**: Creates SSH keys automatically
- ✅ **Simple Switching**: `use-work`, `use-personal`, etc.
- ✅ **Shell Integration**: Works with zsh, bash, PowerShell
- ✅ **Export/Import**: Backup and restore configurations
- ✅ **Cross-Platform**: macOS, Linux, Windows

## 📚 Commands

### Setup

```bash
multiGit setup              # Automated setup (recommended)
multiGit init               # Manual initialization
```

### Configuration Management

```bash
multiGit add <name>                    # Add new configuration
multiGit add <name> --generate-ssh-key # Add with auto-generated SSH key
multiGit list                           # List all configurations
multiGit remove <name>                  # Remove configuration
```

### Advanced

```bash
multiGit export [file]                  # Export configurations
multiGit import <file>                  # Import configurations
multiGit set-local <name>               # Set config for current repo only
```

## 🔑 Adding SSH Keys to GitHub/GitLab

After creating a configuration, add the public key:

```bash
# Display your public key
cat ~/.ssh/id_ed25519_work.pub

# Copy and add to:
# GitHub: Settings → SSH and GPG keys → New SSH key
# GitLab: Preferences → SSH Keys → Add SSH Key
```

## 🛠️ Troubleshooting

### Command Not Found

```bash
source ~/.zshrc  # Reload shell
# Or restart your terminal
```

### SSH Key Issues

```bash
# Check key permissions
ls -la ~/.ssh/id_ed25519_*

# Fix permissions if needed
chmod 600 ~/.ssh/id_ed25519_*
```

## 📋 Requirements

- Node.js >= 14.0.0
- Git installed
- macOS/Linux with zsh (or Windows with WSL/PowerShell)

## 📝 How It Works

1. Creates scripts in `~/.bin/` that switch git configurations
2. Adds aliases to your shell config (`~/.zshrc`)
3. Automatically manages SSH keys for each identity
4. Modifies global git config when switching

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

## 👤 Author

**Narek Kolyan** - [GitHub](https://github.com/narek941)

Created with ❤️ for developers who juggle multiple git identities.
