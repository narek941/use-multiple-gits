import {
  addDirectoryMapping,
  removeDirectoryMapping,
  getConfigForDirectory,
  enableAutoSwitch,
  disableAutoSwitch,
  isAutoSwitchEnabled,
} from '../../utils/directoryMapper';
import * as path from 'path';
import * as os from 'os';

describe('directoryMapper', () => {
  const testDir = path.join(os.tmpdir(), 'multi-git-test-dir');
  const testSubDir = path.join(testDir, 'subdir');

  beforeEach(() => {
    // Clean up mappings
    // Note: In real scenario, we'd mock the config storage
  });

  describe('addDirectoryMapping', () => {
    it('should add directory mapping', async () => {
      await addDirectoryMapping(testDir, 'work');
      const config = await getConfigForDirectory(testDir);
      expect(config).toBe('work');
    });
  });

  describe('removeDirectoryMapping', () => {
    it('should remove directory mapping', async () => {
      await addDirectoryMapping(testDir, 'work');
      await removeDirectoryMapping(testDir);
      const config = await getConfigForDirectory(testDir);
      expect(config).toBeNull();
    });
  });

  describe('getConfigForDirectory', () => {
    it('should return config for matching directory', async () => {
      await addDirectoryMapping(testDir, 'work');
      const config = await getConfigForDirectory(testSubDir);
      expect(config).toBe('work');
    });

    it('should return null for non-matching directory', async () => {
      const config = await getConfigForDirectory('/nonexistent/path');
      expect(config).toBeNull();
    });
  });

  describe('enableAutoSwitch and disableAutoSwitch', () => {
    it('should enable and disable auto-switch', async () => {
      expect(await isAutoSwitchEnabled()).toBe(false);
      await enableAutoSwitch();
      expect(await isAutoSwitchEnabled()).toBe(true);
      await disableAutoSwitch();
      expect(await isAutoSwitchEnabled()).toBe(false);
    });
  });
});
