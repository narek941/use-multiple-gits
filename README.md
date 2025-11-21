# use-multiple-gits

[![npm version](https://img.shields.io/npm/v/use-multiple-gits.svg)](https://www.npmjs.com/package/use-multiple-gits)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A CLI tool to easily manage multiple git configurations (user.name, user.email, SSH keys) with simple switching commands. Perfect for developers who work with multiple Git identities (work, personal, different organizations).

## Features

- ✅ **Easy Setup**: Interactive CLI to add and manage git configurations
- ✅ **SSH Key Management**: Automatically switches SSH keys for each identity
- ✅ **SSH Key Generation**: Auto-generate SSH keys with `--generate-ssh-key` flag
- ✅ **Shell Integration**: Creates convenient aliases in your shell (zsh, bash, PowerShell)
- ✅ **Cross-Platform**: Works on macOS, Linux, and Windows (PowerShell support)
- ✅ **Export/Import**: Backup and restore configurations
- ✅ **Per-Repository Config**: Set local git config for specific repositories
- ✅ **Git Hooks**: Pre-commit hook to verify git identity
- ✅ **Auto-Switch**: Automatically switch identity based on directory
- ✅ **Configuration Groups**: Organize configs into groups
- ✅ **TypeScript**: Built with TypeScript for reliability
- ✅ **Error Handling**: Comprehensive error handling and validation
- ✅ **Fully Tested**: 50+ tests ensuring reliability

## Installation

```bash
npm install -g use-multiple-gits
```

## Quick Start

### 1. Initialize

```bash
multiGit init
```

This will:

- Create `~/.bin/` directory
- Add `~/.bin` to your PATH in `~/.zshrc`
- Set up the configuration system

### 2. Add Your First Configuration

```bash
multiGit add work
```

You'll be prompted for:

- Display name (e.g., "Work", "Personal", "Company")
- Git user.name
- Git user.email
- SSH key filename (e.g., `id_ed25519_work`)

**Note**: Make sure your SSH key exists before adding the configuration. Generate it with:

```bash
ssh-keygen -t ed25519 -C "your.email@company.com" -f ~/.ssh/id_ed25519_work
```

### 3. Reload Shell

```bash
source ~/.zshrc
```

### 4. Use It!

```bash
use-work      # Switch to work configuration
use-personal  # Switch to personal configuration
use-company   # Switch to any other configuration
```

## Commands

### `multiGit init`

Initialize the multi-git configuration system. Run this first.

### `multiGit add <name> [--generate-ssh-key]`

Add a new git configuration. Example:

```bash
multiGit add work
multiGit add personal --generate-ssh-key  # Auto-generate SSH key
multiGit add company
```

### `multiGit list`

List all configured git identities.

### `multiGit remove <name>`

Remove a git configuration. Example:

```bash
multiGit remove work
```

### `multiGit export [file]`

Export configurations to file (or stdout if no file specified):

```bash
multiGit export > configs.json
multiGit export my-configs.json
```

### `multiGit import <file>`

Import configurations from file:

```bash
multiGit import configs.json
```

### `multiGit set-local <name>`

Set git config for current repository only (not global):

```bash
multiGit set-local work
```

### `multiGit hook <install|uninstall>`

Manage git hooks:

```bash
multiGit hook install    # Install pre-commit hook
multiGit hook uninstall  # Remove pre-commit hook
```

### `multiGit auto-switch <action>`

Manage auto-switch feature:

```bash
multiGit auto-switch enable                    # Enable auto-switch
multiGit auto-switch disable                   # Disable auto-switch
multiGit auto-switch status                    # Show status
multiGit auto-switch add ~/Projects/Work work  # Map directory to config
multiGit auto-switch remove ~/Projects/Work    # Remove mapping
multiGit auto-switch current                    # Show current mapping
```

### `multiGit group <action>`

Manage configuration groups:

```bash
multiGit group create company-projects          # Create group
multiGit group add company-projects work        # Add config to group
multiGit group remove company-projects work     # Remove from group
multiGit group list                            # List all groups
multiGit group show company-projects           # Show group details
multiGit group delete company-projects          # Delete group
```

## How It Works

1. **Scripts**: Creates `~/.bin/use-<name>.sh` scripts that switch git global config
2. **Aliases**: Adds aliases to `~/.zshrc` for easy access
3. **SSH Keys**: Automatically uses the specified SSH key for git operations
4. **Global Config**: Modifies global git config (affects all repositories)

## Example Workflow

```bash
# Initialize
multiGit init

# Add work configuration
multiGit add work
# Enter: John Doe, john.doe@company.com, id_ed25519_work

# Add personal configuration
multiGit add personal
# Enter: John Doe, john.doe@gmail.com, id_ed25519_personal

# Reload shell
source ~/.zshrc

# Switch between configurations
use-work      # Now using work identity
use-personal  # Now using personal identity
```

## Configuration Storage

Configurations are stored in `~/.multi-git/config.json`. You can manually edit this file if needed.

## Requirements

- Node.js >= 14.0.0
- macOS with zsh (or Linux with zsh, or Windows with WSL)
- Git installed
- SSH keys generated for each identity

## Adding SSH Keys to GitHub/GitLab

After creating a configuration, add the public key to your GitHub/GitLab account:

```bash
# Display public key (replace 'work' with your configuration name)
cat ~/.ssh/id_ed25519_work.pub

# Copy and paste into:
# GitHub: Settings → SSH and GPG keys → New SSH key
# GitLab: Preferences → SSH Keys → Add SSH Key
```

## Troubleshooting

### Scripts Not Found

```bash
# Make sure ~/.bin is in PATH
echo $PATH | grep -o "$HOME/.bin"

# If not, reload shell
source ~/.zshrc
```

### SSH Key Not Working

```bash
# Check SSH key permissions (should be 600)
ls -la ~/.ssh/id_ed25519_*

# Fix permissions if needed
chmod 600 ~/.ssh/id_ed25519_*
```

### Aliases Not Working

```bash
# Check if aliases are loaded
alias | grep use-

# Reload shell
source ~/.zshrc
```

## Similar Packages

If you're looking for alternatives or similar functionality, here are some related packages:

- **[git-profile-switcher](https://www.npmjs.com/package/git-profile-switcher)** - Similar tool for switching git profiles
- **[git-user-switch](https://www.npmjs.com/package/git-user-switch)** - Another git identity switcher
- **[git-config](https://www.npmjs.com/package/git-config)** - Parse and manipulate Git configuration files
- **[git-config-path](https://www.npmjs.com/package/git-config-path)** - Find the path to Git configuration file

**Why use-multiple-gits?**

- More interactive setup with guided prompts
- Automatic SSH key management
- Shell integration with aliases
- TypeScript for better reliability
- Comprehensive error handling

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Author

Created with ❤️ for developers who juggle multiple git identities.
