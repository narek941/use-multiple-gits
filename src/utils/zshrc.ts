import { GitConfig } from '../types';
import { FileSystemError } from './errors';
import { fileExists, readFile, writeFile } from './fs';
import { PROFILE_PATH, ZSHRC_PATH } from './paths';
import { detectShell, getShellConfigPath } from './shellDetector';

const ALIAS_MARKER = '# Multi-Git Configuration Aliases';
const FUNCTION_MARKER = '# Multi-Git PowerShell Functions';

export const readZshrc = async (): Promise<string> => {
  if (!fileExists(ZSHRC_PATH)) {
    return '';
  }
  const content = await readFile(ZSHRC_PATH);
  return content || '';
};

const hasAliases = (content: string): boolean => {
  return content.includes(ALIAS_MARKER);
};

const removeAliases = (content: string): string => {
  const lines = content.split('\n');
  const startIndex = lines.findIndex(line => line.includes(ALIAS_MARKER));

  if (startIndex === -1) {
    return content;
  }

  const endIndex = lines.findIndex(
    (line, index) =>
      index > startIndex &&
      line.trim() !== '' &&
      !line.trim().startsWith('#') &&
      !line.trim().startsWith('alias use-')
  );

  if (endIndex === -1) {
    return lines.slice(0, startIndex).join('\n');
  }

  return [...lines.slice(0, startIndex), ...lines.slice(endIndex)].join('\n');
};

export const addAliases = async (configs: GitConfig[]): Promise<void> => {
  try {
    const shell = detectShell();
    const configPath = getShellConfigPath();
    let content = await readZshrc();

    if (shell === 'powershell') {
      // For PowerShell, functions are added via addPowerShellFunction
      // This is handled in scriptGenerator
      return;
    }

    if (hasAliases(content)) {
      content = removeAliases(content);
    }

    const aliases = configs
      .map(config => `alias use-${config.name}='~/.bin/use-${config.name}.sh'`)
      .join('\n');

    const aliasBlock = `\n${ALIAS_MARKER}\n${aliases}\n`;

    content += aliasBlock;
    await writeFile(configPath, content);
  } catch (error) {
    throw new FileSystemError(
      `Failed to update shell config: ${(error as Error).message}`,
      error as Error
    );
  }
};

export const removeAlias = async (name: string): Promise<void> => {
  try {
    const shell = detectShell();
    const configPath = getShellConfigPath();
    let content = (await readFile(configPath)) || '';

    if (shell === 'powershell') {
      // Remove PowerShell function
      const lines = content.split('\n');
      let inFunction = false;
      const filteredLines = lines.filter(line => {
        if (line.includes(`function use-${name}`)) {
          inFunction = true;
          return false;
        }
        if (inFunction && line.trim() === '}') {
          inFunction = false;
          return false;
        }
        return !inFunction;
      });
      await writeFile(configPath, filteredLines.join('\n'));
    } else {
      // Remove bash/zsh alias
      if (!hasAliases(content)) {
        return;
      }

      const lines = content.split('\n');
      const filteredLines = lines.filter(line => !line.includes(`alias use-${name}=`));

      await writeFile(configPath, filteredLines.join('\n'));
    }
  } catch (error) {
    throw new FileSystemError(
      `Failed to remove alias: ${(error as Error).message}`,
      error as Error
    );
  }
};

export const addPowerShellFunction = async (
  config: GitConfig,
  functionContent: string
): Promise<void> => {
  try {
    const profilePath = PROFILE_PATH;
    let content = (await readFile(profilePath)) || '';

    // Create profile if it doesn't exist
    if (!fileExists(profilePath)) {
      const fs = require('fs');
      const dir = require('path').dirname(profilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    // Remove existing function if present
    const lines = content.split('\n');
    let inFunction = false;
    const filteredLines = lines.filter(line => {
      if (line.includes(`function use-${config.name}`)) {
        inFunction = true;
        return false;
      }
      if (inFunction && line.trim() === '}') {
        inFunction = false;
        return false;
      }
      return !inFunction;
    });

    // Add function marker if not present
    if (!content.includes(FUNCTION_MARKER)) {
      filteredLines.push(`\n${FUNCTION_MARKER}\n`);
    }

    // Add function
    filteredLines.push(functionContent);

    await writeFile(profilePath, filteredLines.join('\n'));
  } catch (error) {
    throw new FileSystemError(
      `Failed to add PowerShell function: ${(error as Error).message}`,
      error as Error
    );
  }
};
