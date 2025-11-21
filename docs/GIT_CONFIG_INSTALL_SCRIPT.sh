#!/bin/bash

# Git Configuration Installation Script for New Mac
# This script installs the git configuration switching system

set -e

echo "🚀 Installing Git Configuration Switching System..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Create directory structure
echo "📁 Step 1: Creating directory structure..."
mkdir -p ~/.bin

# Add to PATH if not already there
if [[ ":$PATH:" != *":$HOME/.bin:"* ]]; then
    echo 'export PATH="$HOME/.bin:$PATH"' >> ~/.zshrc
    echo -e "${GREEN}✅ Added ~/.bin to PATH${NC}"
else
    echo -e "${YELLOW}⚠️  ~/.bin already in PATH${NC}"
fi

# Step 2: Create use-riobet.sh
echo ""
echo "📝 Step 2: Creating use-riobet.sh..."
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
echo -e "${GREEN}✅ Created ~/.bin/use-riobet.sh${NC}"

# Step 3: Create use-nq.sh
echo ""
echo "📝 Step 3: Creating use-nq.sh..."
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
echo -e "${GREEN}✅ Created ~/.bin/use-nq.sh${NC}"

# Step 4: Create use-quintegro.sh
echo ""
echo "📝 Step 4: Creating use-quintegro.sh..."
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
echo -e "${GREEN}✅ Created ~/.bin/use-quintegro.sh${NC}"

# Step 5: Add aliases to ~/.zshrc
echo ""
echo "🔗 Step 5: Adding aliases to ~/.zshrc..."

# Check if aliases already exist
if grep -q "alias use-riobet" ~/.zshrc; then
    echo -e "${YELLOW}⚠️  Aliases already exist in ~/.zshrc${NC}"
else
    cat >> ~/.zshrc << 'ALIASES'

# SSH Identity Switching Aliases
alias use-nq='~/.bin/use-nq.sh'
alias use-quintegro='~/.bin/use-quintegro.sh'
alias use-riobet='~/.bin/use-riobet.sh'
ALIASES
    echo -e "${GREEN}✅ Added aliases to ~/.zshrc${NC}"
fi

# Step 6: Check SSH keys
echo ""
echo "🔑 Step 6: Checking SSH keys..."
SSH_KEYS_MISSING=0

if [ ! -f ~/.ssh/id_ed25519_riobet ]; then
    echo -e "${YELLOW}⚠️  Missing: ~/.ssh/id_ed25519_riobet${NC}"
    SSH_KEYS_MISSING=1
else
    echo -e "${GREEN}✅ Found: ~/.ssh/id_ed25519_riobet${NC}"
fi

if [ ! -f ~/.ssh/id_ed25519_nq ]; then
    echo -e "${YELLOW}⚠️  Missing: ~/.ssh/id_ed25519_nq${NC}"
    SSH_KEYS_MISSING=1
else
    echo -e "${GREEN}✅ Found: ~/.ssh/id_ed25519_nq${NC}"
fi

if [ ! -f ~/.ssh/id_ed25519_quintegro ]; then
    echo -e "${YELLOW}⚠️  Missing: ~/.ssh/id_ed25519_quintegro${NC}"
    SSH_KEYS_MISSING=1
else
    echo -e "${GREEN}✅ Found: ~/.ssh/id_ed25519_quintegro${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Installation complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $SSH_KEYS_MISSING -eq 1 ]; then
    echo -e "${YELLOW}⚠️  IMPORTANT: Some SSH keys are missing!${NC}"
    echo ""
    echo "Generate missing SSH keys with:"
    echo "  ssh-keygen -t ed25519 -C \"your.email@domain.com\" -f ~/.ssh/id_ed25519_riobet"
    echo "  ssh-keygen -t ed25519 -C \"your.email@domain.com\" -f ~/.ssh/id_ed25519_nq"
    echo "  ssh-keygen -t ed25519 -C \"your.email@domain.com\" -f ~/.ssh/id_ed25519_quintegro"
    echo ""
fi

echo "📋 Next steps:"
echo "1. Reload shell: source ~/.zshrc"
echo "2. Generate SSH keys if missing (see above)"
echo "3. Add SSH public keys to GitHub/GitLab:"
echo "   cat ~/.ssh/id_ed25519_riobet.pub"
echo "   cat ~/.ssh/id_ed25519_nq.pub"
echo "   cat ~/.ssh/id_ed25519_quintegro.pub"
echo "4. Test the setup:"
echo "   use-riobet"
echo "   use-nq"
echo "   use-quintegro"
echo ""
echo "📖 For detailed guide, see: docs/GIT_CONFIG_INSTALLATION_GUIDE.md"
