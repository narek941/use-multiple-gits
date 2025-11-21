# Existing Git Configuration Setup

This document describes the **current setup** for switching git configurations on your system.

## Current Setup Overview

Your system uses **global git configuration switching** with scripts located in `~/.bin/` directory.

### Location

- **Scripts**: `~/.bin/` (not `~/bin/`)
- **Aliases**: Defined in `~/.zshrc`

### Available Commands

```bash
use-nq          # Switch to NQ configuration
use-riobet      # Switch to RioBet configuration
use-quintegro   # Switch to Quintegro configuration
```

## How It Works

The scripts modify **global git configuration** (`--global`) and SSH keys:

1. **Sets global git user.name and user.email**
2. **Configures SSH key** for the specific identity
3. **Updates SSH agent** with the correct key
4. **Disables GPG signing** (optional)

## Current Scripts

### `~/.bin/use-riobet.sh`

- **Name**: `grant.wood`
- **Email**: `grant.wood@riobet.com`
- **SSH Key**: `~/.ssh/id_ed25519_riobet`

### `~/.bin/use-nq.sh`

- **Name**: `narek941`
- **Email**: `nqolyan@gmail.com`
- **SSH Key**: `~/.ssh/id_ed25519_nq`

### `~/.bin/use-quintegro.sh`

- **Name**: `habrahamyanquintegro`
- **Email**: `habrahamyan@quintegro.com`
- **SSH Key**: `~/.ssh/id_ed25519_quintegro`

## Aliases in ~/.zshrc

```bash
alias use-nq='~/.bin/use-nq.sh'
alias use-quintegro='~/.bin/use-quintegro.sh'
alias use-riobet='~/.bin/use-riobet.sh'
```

## Usage

Simply run the command to switch:

```bash
use-riobet    # Switch to RioBet
use-nq        # Switch to NQ
use-quintegro # Switch to Quintegro
```

After switching, verify:

```bash
git config --global user.name
git config --global user.email
git config --global core.sshCommand
```

## Differences from Local Config Approach

### Current System (Global)

- ✅ Simple - one command switches everything
- ✅ Works across all repositories
- ⚠️ Changes global config (affects all repos)
- ⚠️ Manual switching required

### Alternative (Local per Repository)

- ✅ Each repo has its own config
- ✅ Automatic detection based on path
- ⚠️ More complex setup
- ⚠️ Requires git hooks

## Adding New Configuration

To add a new configuration (e.g., `use-company`):

1. **Create script** `~/.bin/use-company.sh`:

```bash
#!/bin/bash
export GPG_TTY=$(tty)

# Set Git identity
git config --global user.name "Your Name"
git config --global user.email "your.email@company.com"

# Set SSH key
git config --global core.sshCommand "ssh -i ~/.ssh/id_ed25519_company -F /dev/null"

# Disable GPG signing
git config --global --unset user.signingkey 2>/dev/null || true
git config --global commit.gpgsign false

# Update SSH agent
ssh-add -D 2>/dev/null || true
ssh-add ~/.ssh/id_ed25519_company

echo "Name: Your Name"
echo "Email: your.email@company.com"
echo "✅ Switched to Company identity"
```

2. **Make executable**:

```bash
chmod +x ~/.bin/use-company.sh
```

3. **Add alias** to `~/.zshrc`:

```bash
alias use-company='~/.bin/use-company.sh'
```

4. **Reload shell**:

```bash
source ~/.zshrc
```

## Current Status

✅ System is already set up and working
✅ Scripts are in `~/.bin/`
✅ Aliases are configured in `~/.zshrc`
✅ SSH keys are managed automatically

## Notes

- The system uses **global configuration**, meaning it affects all git repositories
- You need to manually run the command when switching between projects
- SSH keys are automatically added to the SSH agent
- GPG signing is disabled for all configurations
