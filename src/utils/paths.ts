import * as os from 'os';
import * as path from 'path';

export const HOME_DIR = os.homedir();
export const BIN_DIR = path.join(HOME_DIR, '.bin');
export const ZSHRC_PATH = path.join(HOME_DIR, '.zshrc');
export const SSH_DIR = path.join(HOME_DIR, '.ssh');
export const PROFILE_PATH = os.platform() === 'win32'
  ? path.join(HOME_DIR, 'Documents', 'WindowsPowerShell', 'Microsoft.PowerShell_profile.ps1')
  : path.join(HOME_DIR, '.bash_profile');
