import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { generateScript } from '../../utils/scriptGenerator';
import { getScriptPath } from '../../utils/fs';
import { GitConfig } from '../../types';
import { BIN_DIR } from '../../utils/paths';

describe('scriptGenerator', () => {
  const testConfig: GitConfig = {
    name: 'test',
    displayName: 'Test Identity',
    userName: 'Test User',
    userEmail: 'test@example.com',
    sshKeyName: 'id_ed25519_test',
  };

  beforeEach(() => {
    // Clean up test script if it exists
    const scriptPath = getScriptPath('test');
    if (fs.existsSync(scriptPath)) {
      fs.unlinkSync(scriptPath);
    }
  });

  afterEach(() => {
    // Clean up test script
    const scriptPath = getScriptPath('test');
    if (fs.existsSync(scriptPath)) {
      fs.unlinkSync(scriptPath);
    }
  });

  it('should generate script file', async () => {
    const scriptPath = await generateScript(testConfig);
    expect(fs.existsSync(scriptPath)).toBe(true);
  });

  it('should generate script with correct content', async () => {
    const scriptPath = await generateScript(testConfig);
    const content = fs.readFileSync(scriptPath, 'utf-8');

    expect(content).toContain(testConfig.userName);
    expect(content).toContain(testConfig.userEmail);
    expect(content).toContain(testConfig.sshKeyName);
    expect(content).toContain(testConfig.displayName);
    expect(content).toContain('#!/bin/bash');
    expect(content).toContain('git config --global user.name');
    expect(content).toContain('git config --global user.email');
    expect(content).toContain('ssh-add');
  });

  it('should make script executable', async () => {
    const scriptPath = await generateScript(testConfig);
    const stats = fs.statSync(scriptPath);
    expect(stats.mode & parseInt('111', 8)).toBeTruthy();
  });

  it('should return correct script path', async () => {
    const scriptPath = await generateScript(testConfig);
    const expectedPath = path.join(BIN_DIR, `use-${testConfig.name}.sh`);
    expect(scriptPath).toBe(expectedPath);
  });
});
