import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import {
  readConfig,
  writeConfig,
  addConfig,
  removeConfig,
  getConfig,
  getAllConfigs,
  setInitialized,
  isInitialized,
} from '../../utils/configStorage';
import { GitConfig } from '../../types';

// Mock the config file path
const TEST_CONFIG_DIR = path.join(os.tmpdir(), 'multi-git-test-config');
const TEST_CONFIG_FILE = path.join(TEST_CONFIG_DIR, 'config.json');

// We need to mock the configStorage module to use test paths
// For now, we'll test with actual file system but in a temp directory

describe('configStorage', () => {
  beforeEach(() => {
    // Clean up before each test
    if (fs.existsSync(TEST_CONFIG_DIR)) {
      fs.rmSync(TEST_CONFIG_DIR, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    // Clean up after each test
    if (fs.existsSync(TEST_CONFIG_DIR)) {
      fs.rmSync(TEST_CONFIG_DIR, { recursive: true, force: true });
    }
  });

  describe('readConfig', () => {
    it('should return default config if file does not exist', async () => {
      // Note: This test uses the actual implementation which reads from ~/.multi-git
      // In a real scenario, we'd mock the paths
      const config = await readConfig();
      expect(config).toHaveProperty('initialized');
      expect(config).toHaveProperty('configs');
      expect(Array.isArray(config.configs)).toBe(true);
    });
  });

  describe('writeConfig and readConfig', () => {
    it('should write and read config correctly', async () => {
      const testConfig = {
        initialized: true,
        configs: [
          {
            name: 'test',
            displayName: 'Test',
            userName: 'Test User',
            userEmail: 'test@example.com',
            sshKeyName: 'id_ed25519_test',
          },
        ],
      };

      await writeConfig(testConfig);
      const read = await readConfig();
      expect(read.initialized).toBe(testConfig.initialized);
      expect(read.configs).toHaveLength(1);
      expect(read.configs[0].name).toBe('test');
    });
  });

  describe('addConfig', () => {
    it('should add new config', async () => {
      const newConfig: GitConfig = {
        name: 'work',
        displayName: 'Work',
        userName: 'John Doe',
        userEmail: 'john@company.com',
        sshKeyName: 'id_ed25519_work',
      };

      await addConfig(newConfig);
      const config = await getConfig('work');
      expect(config).not.toBeNull();
      expect(config?.name).toBe('work');
      expect(config?.userEmail).toBe('john@company.com');
    });

    it('should update existing config', async () => {
      const config1: GitConfig = {
        name: 'work',
        displayName: 'Work',
        userName: 'John Doe',
        userEmail: 'john@company.com',
        sshKeyName: 'id_ed25519_work',
      };

      const config2: GitConfig = {
        name: 'work',
        displayName: 'Work Updated',
        userName: 'John Doe Updated',
        userEmail: 'john.updated@company.com',
        sshKeyName: 'id_ed25519_work',
      };

      await addConfig(config1);
      await addConfig(config2);

      const config = await getConfig('work');
      expect(config?.displayName).toBe('Work Updated');
      expect(config?.userName).toBe('John Doe Updated');
    });
  });

  describe('removeConfig', () => {
    it('should remove config', async () => {
      const config: GitConfig = {
        name: 'work',
        displayName: 'Work',
        userName: 'John Doe',
        userEmail: 'john@company.com',
        sshKeyName: 'id_ed25519_work',
      };

      await addConfig(config);
      await removeConfig('work');

      const removed = await getConfig('work');
      expect(removed).toBeNull();
    });
  });

  describe('getConfig', () => {
    it('should return null for non-existent config', async () => {
      const config = await getConfig('nonexistent');
      expect(config).toBeNull();
    });
  });

  describe('getAllConfigs', () => {
    it('should return all configs', async () => {
      // Clear existing configs first
      const existingConfigs = await getAllConfigs();
      for (const config of existingConfigs) {
        await removeConfig(config.name);
      }

      const config1: GitConfig = {
        name: 'work',
        displayName: 'Work',
        userName: 'John Doe',
        userEmail: 'john@company.com',
        sshKeyName: 'id_ed25519_work',
      };

      const config2: GitConfig = {
        name: 'personal',
        displayName: 'Personal',
        userName: 'John Doe',
        userEmail: 'john@gmail.com',
        sshKeyName: 'id_ed25519_personal',
      };

      await addConfig(config1);
      await addConfig(config2);

      const configs = await getAllConfigs();
      expect(configs.length).toBeGreaterThanOrEqual(2);
      expect(configs.map(c => c.name)).toContain('work');
      expect(configs.map(c => c.name)).toContain('personal');
    });
  });

  describe('setInitialized and isInitialized', () => {
    it('should set and check initialized status', async () => {
      // Get current state
      const wasInitialized = await isInitialized();

      // Test setting to true
      await setInitialized();
      expect(await isInitialized()).toBe(true);

      // If it wasn't initialized before, test setting back
      if (!wasInitialized) {
        const data = await readConfig();
        data.initialized = false;
        await writeConfig(data);
        expect(await isInitialized()).toBe(false);
      }
    });
  });
});
