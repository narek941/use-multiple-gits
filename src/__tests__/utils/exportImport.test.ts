import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import {
  exportConfigs,
  exportConfigsToFile,
  importConfigs,
  importConfigsFromFile,
} from '../../utils/exportImport';
import { addConfig, getAllConfigs } from '../../utils/configStorage';
import { GitConfig } from '../../types';

describe('exportImport', () => {
  const testFile = path.join(os.tmpdir(), 'multi-git-export-test.json');

  beforeEach(async () => {
    // Clean up
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  });

  afterEach(async () => {
    // Clean up
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  });

  describe('exportConfigs', () => {
    it('should export configurations', async () => {
      const config: GitConfig = {
        name: 'export-test',
        displayName: 'Export Test',
        userName: 'Test User',
        userEmail: 'test@example.com',
        sshKeyName: 'id_ed25519_export_test',
      };

      await addConfig(config);
      const exportData = await exportConfigs();

      expect(exportData).toHaveProperty('version');
      expect(exportData).toHaveProperty('configs');
      expect(exportData).toHaveProperty('exportedAt');
      expect(Array.isArray(exportData.configs)).toBe(true);
      expect(exportData.configs.map((c: GitConfig) => c.name)).toContain('export-test');
    });
  });

  describe('exportConfigsToFile', () => {
    it('should export to file', async () => {
      const config: GitConfig = {
        name: 'export-file-test',
        displayName: 'Export File Test',
        userName: 'Test User',
        userEmail: 'test@example.com',
        sshKeyName: 'id_ed25519_export_file_test',
      };

      await addConfig(config);
      await exportConfigsToFile(testFile);

      expect(fs.existsSync(testFile)).toBe(true);
      const content = fs.readFileSync(testFile, 'utf-8');
      const data = JSON.parse(content);
      expect(Array.isArray(data.configs)).toBe(true);
      expect((data.configs as GitConfig[]).map((c: GitConfig) => c.name)).toContain('export-file-test');
    });
  });

  describe('importConfigs', () => {
    it('should import configurations', async () => {
      const importData = {
        version: '1.0.0',
        configs: [
          {
            name: 'imported',
            displayName: 'Imported',
            userName: 'Imported User',
            userEmail: 'imported@example.com',
            sshKeyName: 'id_ed25519_imported',
          },
        ],
        exportedAt: new Date().toISOString(),
      };

      await importConfigs(importData);
      const configs = await getAllConfigs();
      expect(configs.map(c => c.name)).toContain('imported');
    });
  });

  describe('importConfigsFromFile', () => {
    it('should import from file', async () => {
      const importData = {
        version: '1.0.0',
        configs: [
          {
            name: 'fromfile',
            displayName: 'From File',
            userName: 'File User',
            userEmail: 'file@example.com',
            sshKeyName: 'id_ed25519_file',
          },
        ],
        exportedAt: new Date().toISOString(),
      };

      fs.writeFileSync(testFile, JSON.stringify(importData, null, 2));
      await importConfigsFromFile(testFile);

      const configs = await getAllConfigs();
      expect(configs.map(c => c.name)).toContain('fromfile');
    });
  });
});
