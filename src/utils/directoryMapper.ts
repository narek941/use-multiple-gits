import * as path from 'path';
import * as os from 'os';
import { readConfig, writeConfig } from './configStorage';
import { ConfigData } from '../types';

export const addDirectoryMapping = async (directoryPath: string, configName: string): Promise<void> => {
  const data = await readConfig();

  if (!data.directoryMappings) {
    data.directoryMappings = {};
  }

  // Normalize path
  const normalizedPath = path.resolve(directoryPath);
  data.directoryMappings[normalizedPath] = configName;

  await writeConfig(data);
};

export const removeDirectoryMapping = async (directoryPath: string): Promise<void> => {
  const data = await readConfig();

  if (!data.directoryMappings) {
    return;
  }

  const normalizedPath = path.resolve(directoryPath);
  delete data.directoryMappings[normalizedPath];

  await writeConfig(data);
};

export const getConfigForDirectory = async (currentDir: string = process.cwd()): Promise<string | null> => {
  const data = await readConfig();

  if (!data.directoryMappings) {
    return null;
  }

  const normalizedCurrentDir = path.resolve(currentDir);

  // Find the longest matching path
  let bestMatch: { path: string; config: string } | null = null;

  for (const [mappedPath, configName] of Object.entries(data.directoryMappings)) {
    if (normalizedCurrentDir.startsWith(mappedPath)) {
      if (!bestMatch || mappedPath.length > bestMatch.path.length) {
        bestMatch = { path: mappedPath, config: configName };
      }
    }
  }

  return bestMatch ? bestMatch.config : null;
};

export const enableAutoSwitch = async (): Promise<void> => {
  const data = await readConfig();
  data.autoSwitchEnabled = true;
  await writeConfig(data);
};

export const disableAutoSwitch = async (): Promise<void> => {
  const data = await readConfig();
  data.autoSwitchEnabled = false;
  await writeConfig(data);
};

export const isAutoSwitchEnabled = async (): Promise<boolean> => {
  const data = await readConfig();
  return data.autoSwitchEnabled === true;
};
