import * as os from 'os';

export type ShellType = 'zsh' | 'bash' | 'powershell' | 'unknown';

export const detectShell = (): ShellType => {
  const platform = os.platform();
  const shell = process.env.SHELL || '';

  if (platform === 'win32') {
    return 'powershell';
  }

  if (shell.includes('zsh')) {
    return 'zsh';
  }

  if (shell.includes('bash')) {
    return 'bash';
  }

  return 'unknown';
};

export const getShellConfigPath = (): string => {
  const shell = detectShell();
  const { ZSHRC_PATH, PROFILE_PATH } = require('./paths');

  if (shell === 'zsh') {
    return ZSHRC_PATH;
  }

  if (shell === 'bash') {
    return PROFILE_PATH;
  }

  if (shell === 'powershell') {
    return PROFILE_PATH;
  }

  return ZSHRC_PATH; // Default fallback
};
