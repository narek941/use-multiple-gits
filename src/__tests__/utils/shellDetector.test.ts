import { detectShell, getShellConfigPath } from '../../utils/shellDetector';
import * as os from 'os';

describe('shellDetector', () => {
  describe('detectShell', () => {
    it('should detect shell type', () => {
      const shell = detectShell();
      expect(['zsh', 'bash', 'powershell', 'unknown']).toContain(shell);
    });
  });

  describe('getShellConfigPath', () => {
    it('should return a valid path', () => {
      const path = getShellConfigPath();
      expect(path).toBeTruthy();
      expect(typeof path).toBe('string');
    });
  });
});
