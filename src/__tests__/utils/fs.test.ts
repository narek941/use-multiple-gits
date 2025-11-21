import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import {
  ensureDir,
  readFile,
  writeFile,
  fileExists,
  makeExecutable,
  getScriptPath,
  removeFile,
} from '../../utils/fs';
import { BIN_DIR } from '../../utils/paths';

describe('fs utilities', () => {
  const testDir = path.join(os.tmpdir(), 'multi-git-test');
  const testFile = path.join(testDir, 'test.txt');

  beforeEach(() => {
    // Clean up before each test
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    // Clean up after each test
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('ensureDir', () => {
    it('should create directory if it does not exist', async () => {
      await ensureDir(testDir);
      expect(fs.existsSync(testDir)).toBe(true);
    });

    it('should not throw if directory already exists', async () => {
      await ensureDir(testDir);
      await ensureDir(testDir); // Should not throw
      expect(fs.existsSync(testDir)).toBe(true);
    });
  });

  describe('writeFile', () => {
    beforeEach(async () => {
      await ensureDir(testDir);
    });

    it('should write content to file', async () => {
      const content = 'test content';
      await writeFile(testFile, content);
      expect(fs.readFileSync(testFile, 'utf-8')).toBe(content);
    });
  });

  describe('readFile', () => {
    beforeEach(async () => {
      await ensureDir(testDir);
    });

    it('should read file content', async () => {
      const content = 'test content';
      fs.writeFileSync(testFile, content, 'utf-8');
      const result = await readFile(testFile);
      expect(result).toBe(content);
    });

    it('should return null if file does not exist', async () => {
      const result = await readFile(path.join(testDir, 'nonexistent.txt'));
      expect(result).toBeNull();
    });
  });

  describe('fileExists', () => {
    beforeEach(async () => {
      await ensureDir(testDir);
    });

    it('should return true if file exists', () => {
      fs.writeFileSync(testFile, 'test', 'utf-8');
      expect(fileExists(testFile)).toBe(true);
    });

    it('should return false if file does not exist', () => {
      expect(fileExists(path.join(testDir, 'nonexistent.txt'))).toBe(false);
    });
  });

  describe('makeExecutable', () => {
    beforeEach(async () => {
      await ensureDir(testDir);
    });

    it('should make file executable', async () => {
      fs.writeFileSync(testFile, '#!/bin/bash\necho test', 'utf-8');
      await makeExecutable(testFile);
      const stats = fs.statSync(testFile);
      expect(stats.mode & parseInt('111', 8)).toBeTruthy();
    });
  });

  describe('getScriptPath', () => {
    it('should return correct script path', () => {
      const name = 'work';
      const expectedPath = path.join(BIN_DIR, `use-${name}.sh`);
      expect(getScriptPath(name)).toBe(expectedPath);
    });
  });

  describe('removeFile', () => {
    beforeEach(async () => {
      await ensureDir(testDir);
    });

    it('should remove file if it exists', async () => {
      fs.writeFileSync(testFile, 'test', 'utf-8');
      await removeFile(testFile);
      expect(fs.existsSync(testFile)).toBe(false);
    });

    it('should not throw if file does not exist', async () => {
      await expect(removeFile(path.join(testDir, 'nonexistent.txt'))).resolves.not.toThrow();
    });
  });
});
