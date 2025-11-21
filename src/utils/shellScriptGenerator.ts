import { GitConfig } from '../types';

export const generateSwitchScript = (
  config: GitConfig,
  shell: 'zsh' | 'bash' | 'powershell' = 'zsh'
): string => {
  if (shell === 'powershell') {
    return generatePowerShellScript(config);
  }

  return generateBashScript(config);
};

const generateBashScript = (config: GitConfig): string => {
  return `#!/bin/bash
export GPG_TTY=$(tty)

# Set Git identity for ${config.displayName || config.name}
git config --global user.name "${config.userName}"
git config --global user.email "${config.userEmail}"

# Force Git to use ${config.name} private key
git config --global core.sshCommand "ssh -i ~/.ssh/${config.sshKeyName} -F /dev/null"

# Disable GPG commit signing
git config --global --unset user.signingkey 2>/dev/null || true
git config --global commit.gpgsign false

# Update SSH agent
ssh-add -D 2>/dev/null || true
ssh-add ~/.ssh/${config.sshKeyName}

echo "Name: ${config.userName}"
echo "Email: ${config.userEmail}"
echo "✅ Switched to ${config.displayName || config.name} identity"
`;
};

const generatePowerShellScript = (config: GitConfig): string => {
  return `# PowerShell function for ${config.displayName || config.name}
function use-${config.name} {
    $env:GPG_TTY = $PSSession.TTY

    # Set Git identity
    git config --global user.name "${config.userName}"
    git config --global user.email "${config.userEmail}"

    # Set SSH key (Windows uses different path)
    $sshKeyPath = "$env:USERPROFILE\\.ssh\\${config.sshKeyName}"
    git config --global core.sshCommand "ssh -i $sshKeyPath -F NUL"

    # Disable GPG signing
    git config --global --unset user.signingkey 2>$null
    git config --global commit.gpgsign false

    Write-Host "Name: ${config.userName}" -ForegroundColor Green
    Write-Host "Email: ${config.userEmail}" -ForegroundColor Green
    Write-Host "✅ Switched to ${config.displayName || config.name} identity" -ForegroundColor Green
}
`;
};
