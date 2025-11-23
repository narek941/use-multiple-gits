#!/bin/bash

set -e

echo "🚀 Multi-Git Setup Script"
echo "=========================="
echo ""

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js and npm first."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ node is not installed. Please install Node.js first."
    exit 1
fi

echo "📦 Step 1: Installing use-multiple-gits globally..."
if npm install -g use-multiple-gits; then
    echo "✅ Installation successful!"
else
    echo "❌ Installation failed. Please check your npm setup."
    exit 1
fi

echo ""
echo "⚙️  Step 2: Setting up Multi-Git (this will auto-configure everything)..."
if multiGit setup; then
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Reload your shell: source ~/.zshrc (or restart terminal)"
    echo "   2. Add your first config: multiGit add work"
    echo "   3. Use it: use-work"
    echo ""
    echo "💡 Tip: Auto-generate SSH key with: multiGit add work --generate-ssh-key"
    echo ""
else
    echo "❌ Setup failed. Please run 'multiGit setup' manually."
    exit 1
fi

