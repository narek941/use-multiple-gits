import { writeFile, makeExecutable, getScriptPath } from './fs';
import { GitConfig } from '../types';
import { FileSystemError } from './errors';
import { generateSwitchScript } from './shellScriptGenerator';
import { detectShell } from './shellDetector';
import { addPowerShellFunction } from './zshrc';
import * as os from 'os';
import * as path from 'path';

export const generateScript = async (config: GitConfig): Promise<string> => {
  const shell = detectShell();
  const scriptContent = generateSwitchScript(
    config,
    shell === 'unknown' ? 'zsh' : shell
  );

  try {
    if (shell === 'powershell') {
      // For PowerShell, we need to add to profile instead of creating executable script
      await addPowerShellFunction(config, scriptContent);
      return 'PowerShell profile updated';
    }

    const scriptPath = getScriptPath(config.name);
    await writeFile(scriptPath, scriptContent);
    await makeExecutable(scriptPath);

    return scriptPath;
  } catch (error) {
    throw new FileSystemError(
      `Failed to generate script: ${(error as Error).message}`,
      error as Error
    );
  }
};
