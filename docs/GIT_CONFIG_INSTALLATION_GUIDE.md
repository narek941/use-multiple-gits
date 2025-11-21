# Git Configuration Installation Guide for New Mac

Complete step-by-step guide to install the git configuration switching system on a new Mac.

## 🚀 Quick Installation (Automated)

For automated installation, run:

```bash
./docs/GIT_CONFIG_INSTALL_SCRIPT.sh
```

This script will:

- Create `~/.bin/` directory
- Create all three configuration scripts
- Add aliases to `~/.zshrc`
- Check for SSH keys

**After running the script**, you still need to:

1. Generate SSH keys (if not already done) - see Step 2
2. Add SSH public keys to GitHub/GitLab - see Step 6
3. Reload shell: `source ~/.zshrc`

## Manual Installation (Step-by-Step)

If you prefer to install manually, follow the steps below.

## Prerequisites

- macOS with zsh (default on macOS Catalina+)
- Git installed
- SSH keys generated for each identity

## Step 1: Create Directory Structure

```bash
# Create the bin directory for scripts
mkdir -p ~/.bin

# Make sure it's in your PATH
echo 'export PATH="$HOME/.bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## Step 2: Generate SSH Keys (if not already done)

For each identity, generate a separate SSH key:

```bash
# RioBet SSH key
ssh-keygen -t ed25519 -C "grant.wood@riobet.com" -f ~/.ssh/id_ed25519_riobet

# NQ SSH key
ssh-keygen -t ed25519 -C "nqolyan@gmail.com" -f ~/.ssh/id_ed25519_nq

# Quintegro SSH key
ssh-keygen -t ed25519 -C "habrahamyan@quintegro.com" -f ~/.ssh/id_ed25519_quintegro
```

**Important**: When prompted for passphrase, you can either:

- Set a passphrase (more secure)
- Press Enter twice for no passphrase (less secure but more convenient)

## Step 3: Add SSH Keys to SSH Agent

Add keys to `~/.ssh/config` for automatic loading:

```bash
# Create or edit SSH config
cat >> ~/.ssh/config << 'EOF'

# RioBet
Host github.com-riobet
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_riobet
    IdentitiesOnly yes

# NQ
Host github.com-nq
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_nq
    IdentitiesOnly yes

# Quintegro
Host github.com-quintegro
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_quintegro
    IdentitiesOnly yes
EOF

# Set correct permissions
chmod 600 ~/.ssh/config
```

## Step 4: Create Git Configuration Scripts

### Create `~/.bin/use-riobet.sh`

```bash
cat > ~/.bin/use-riobet.sh << 'EOF'
#!/bin/bash
export GPG_TTY=$(tty)

# Set Git identity for RioBet
git config --global user.name "grant.wood"
git config --global user.email "grant.wood@riobet.com"

# Force Git to use RioBet private key
git config --global core.sshCommand "ssh -i ~/.ssh/id_ed25519_riobet -F /dev/null"

# Disable GPG commit signing
git config --global --unset user.signingkey 2>/dev/null || true
git config --global commit.gpgsign false

# Update SSH agent
ssh-add -D 2>/dev/null || true
ssh-add ~/.ssh/id_ed25519_riobet

echo "Name: grant.wood"
echo "Email: grant.wood@riobet.com"
echo "✅ Switched to Rio identity"
EOF

chmod +x ~/.bin/use-riobet.sh
```

### Create `~/.bin/use-nq.sh`

```bash
cat > ~/.bin/use-nq.sh << 'EOF'
#!/bin/bash
export GPG_TTY=$(tty)

# Set Git identity for NQ
git config --global user.name "narek941"
git config --global user.email "nqolyan@gmail.com"

# Force Git to use NQ private key
git config --global core.sshCommand "ssh -i ~/.ssh/id_ed25519_nq -F /dev/null"

# Disable GPG commit signing (optional)
git config --global --unset user.signingkey 2>/dev/null || true
git config --global commit.gpgsign false

# Update SSH agent
ssh-add -D 2>/dev/null || true
ssh-add ~/.ssh/id_ed25519_nq

# Show current Git identity
name=$(git config --global user.name)
email=$(git config --global user.email)
ssh_cmd=$(git config --global core.sshCommand)

if [[ "$ssh_cmd" == *"id_ed25519_nq"* ]]; then
    platform="NQ (Github)"
else
    platform="Unknown"
fi

echo "Name:" "narek941"
echo "Email" "nqolyan@gmail.com"
echo "✅ Switched to Narek Qolyan identity"
EOF

chmod +x ~/.bin/use-nq.sh
```

### Create `~/.bin/use-quintegro.sh`

```bash
cat > ~/.bin/use-quintegro.sh << 'EOF'
#!/bin/bash
export GPG_TTY=$(tty)

# Git identity for Quintegro
git config --global user.name "habrahamyanquintegro"
git config --global user.email "habrahamyan@quintegro.com"
git config --global core.sshCommand "ssh -i ~/.ssh/id_ed25519_quintegro -F /dev/null"

# Disable GPG signing
git config --global --unset user.signingkey
git config --global commit.gpgsign false

# GitHub credential helpers
git config --global credential.helper osxkeychain
git config --global init.defaultbranch main
git config --global http.postbuffer 524288000
git config --global credential.https://github.com.helper "!/opt/homebrew/bin/gh auth git-credential"
git config --global credential.https://gist.github.com.helper "!/opt/homebrew/bin/gh auth git-credential"

# Update SSH agent
ssh-add -D 2>/dev/null || true
ssh-add ~/.ssh/id_ed25519_quintegro

echo "Name:" "habrahamyanquintegro"
echo "Email:" "habrahamyan@quintegro.com"
echo "✅ Switched to Quintegro identity"
EOF

chmod +x ~/.bin/use-quintegro.sh
```

## Step 5: Add Aliases to ~/.zshrc

```bash
cat >> ~/.zshrc << 'EOF'

# SSH Identity Switching Aliases
alias use-nq='~/.bin/use-nq.sh'
alias use-quintegro='~/.bin/use-quintegro.sh'
alias use-riobet='~/.bin/use-riobet.sh'
EOF

# Reload shell configuration
source ~/.zshrc
```

## Step 6: Add SSH Public Keys to GitHub/GitLab

For each identity, add the public key to the corresponding GitHub/GitLab account:

```bash
# Display public keys
echo "=== RioBet Public Key ==="
cat ~/.ssh/id_ed25519_riobet.pub

echo -e "\n=== NQ Public Key ==="
cat ~/.ssh/id_ed25519_nq.pub

echo -e "\n=== Quintegro Public Key ==="
cat ~/.ssh/id_ed25519_quintegro.pub
```

**Add to GitHub/GitLab:**

1. Copy each public key
2. Go to GitHub/GitLab → Settings → SSH Keys
3. Add new SSH key
4. Paste the public key
5. Save

## Step 7: Test the Setup

```bash
# Test RioBet configuration
use-riobet
git config --global user.name    # Should show: grant.wood
git config --global user.email   # Should show: grant.wood@riobet.com

# Test NQ configuration
use-nq
git config --global user.name    # Should show: narek941
git config --global user.email   # Should show: nqolyan@gmail.com

# Test Quintegro configuration
use-quintegro
git config --global user.name    # Should show: habrahamyanquintegro
git config --global user.email   # Should show: habrahamyan@quintegro.com
```

## Step 8: Verify SSH Connection

Test SSH connection for each identity:

```bash
# Test RioBet SSH
ssh -T git@github.com -i ~/.ssh/id_ed25519_riobet

# Test NQ SSH
ssh -T git@github.com -i ~/.ssh/id_ed25519_nq

# Test Quintegro SSH
ssh -T git@github.com -i ~/.ssh/id_ed25519_quintegro
```

## Quick Installation Script

You can also create a single installation script:

```bash
# Save as install-git-config.sh
#!/bin/bash
set -e

echo "🚀 Installing Git Configuration System..."

# Step 1: Create directory
mkdir -p ~/.bin
echo 'export PATH="$HOME/.bin:$PATH"' >> ~/.zshrc

# Step 2-4: (Copy scripts from Step 4 above)

# Step 5: Add aliases
cat >> ~/.zshrc << 'ALIASES'

# SSH Identity Switching Aliases
alias use-nq='~/.bin/use-nq.sh'
alias use-quintegro='~/.bin/use-quintegro.sh'
alias use-riobet='~/.bin/use-riobet.sh'
ALIASES

echo "✅ Installation complete!"
echo "📋 Next steps:"
echo "1. Generate SSH keys (see Step 2)"
echo "2. Add SSH keys to GitHub/GitLab (see Step 6)"
echo "3. Run: source ~/.zshrc"
echo "4. Test with: use-riobet"
```

## Troubleshooting

### Scripts Not Found

```bash
# Check if ~/.bin is in PATH
echo $PATH | grep -o "$HOME/.bin"

# If not, add it
export PATH="$HOME/.bin:$PATH"
```

### SSH Key Not Working

```bash
# Check SSH key permissions
ls -la ~/.ssh/id_ed25519_*

# Should be 600 (read/write for owner only)
chmod 600 ~/.ssh/id_ed25519_*
```

### Aliases Not Working

```bash
# Check if aliases are loaded
alias | grep use-

# If not, reload shell
source ~/.zshrc
```

### SSH Agent Issues

```bash
# Start SSH agent
eval "$(ssh-agent -s)"

# Add keys manually
ssh-add ~/.ssh/id_ed25519_riobet
ssh-add ~/.ssh/id_ed25519_nq
ssh-add ~/.ssh/id_ed25519_quintegro
```

## Summary Checklist

- [ ] Created `~/.bin/` directory
- [ ] Added `~/.bin` to PATH in `~/.zshrc`
- [ ] Generated SSH keys for all identities
- [ ] Created `~/.bin/use-riobet.sh` script
- [ ] Created `~/.bin/use-nq.sh` script
- [ ] Created `~/.bin/use-quintegro.sh` script
- [ ] Made all scripts executable (`chmod +x`)
- [ ] Added aliases to `~/.zshrc`
- [ ] Added SSH public keys to GitHub/GitLab
- [ ] Tested all configurations
- [ ] Verified SSH connections work

## Current Configuration Details

### RioBet

- **Name**: grant.wood
- **Email**: grant.wood@riobet.com
- **SSH Key**: `~/.ssh/id_ed25519_riobet`

### NQ

- **Name**: narek941
- **Email**: nqolyan@gmail.com
- **SSH Key**: `~/.ssh/id_ed25519_nq`

### Quintegro

- **Name**: habrahamyanquintegro
- **Email**: habrahamyan@quintegro.com
- **SSH Key**: `~/.ssh/id_ed25519_quintegro`

## Notes

- All scripts modify **global** git configuration
- You need to manually run the command when switching projects
- SSH keys are automatically added to SSH agent
- GPG signing is disabled for all configurations
- The system works across all git repositories
