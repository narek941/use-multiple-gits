import { readConfig, writeConfig } from './configStorage';
import { ExportData, ConfigData } from '../types';
import { readFile, writeFile } from './fs';
import { InvalidConfigError } from './errors';

export const exportConfigs = async (): Promise<ExportData> => {
  const data = await readConfig();

  return {
    version: '1.0.0',
    configs: data.configs,
    groups: data.groups,
    exportedAt: new Date().toISOString(),
  };
};

export const exportConfigsToFile = async (filePath: string): Promise<void> => {
  const exportData = await exportConfigs();
  const json = JSON.stringify(exportData, null, 2);
  await writeFile(filePath, json);
};

export const importConfigs = async (importData: ExportData): Promise<void> => {
  const currentData = await readConfig();

  // Merge configs (existing configs with same name will be updated)
  const mergedConfigs = [...currentData.configs];

  for (const importedConfig of importData.configs) {
    const existingIndex = mergedConfigs.findIndex(c => c.name === importedConfig.name);
    if (existingIndex !== -1) {
      mergedConfigs[existingIndex] = importedConfig;
    } else {
      mergedConfigs.push(importedConfig);
    }
  }

  // Merge groups
  const mergedGroups = { ...currentData.groups, ...importData.groups };

  const newData: ConfigData = {
    initialized: currentData.initialized,
    configs: mergedConfigs,
    groups: mergedGroups,
    autoSwitchEnabled: currentData.autoSwitchEnabled,
    directoryMappings: currentData.directoryMappings,
  };

  await writeConfig(newData);
};

export const importConfigsFromFile = async (filePath: string): Promise<void> => {
  const content = await readFile(filePath);

  if (!content) {
    throw new InvalidConfigError(`File not found: ${filePath}`);
  }

  try {
    const importData = JSON.parse(content) as ExportData;

    if (!importData.configs || !Array.isArray(importData.configs)) {
      throw new InvalidConfigError('Invalid export file format: missing configs array');
    }

    await importConfigs(importData);
  } catch (error) {
    if (error instanceof InvalidConfigError) {
      throw error;
    }
    throw new InvalidConfigError(`Failed to parse import file: ${(error as Error).message}`);
  }
};
