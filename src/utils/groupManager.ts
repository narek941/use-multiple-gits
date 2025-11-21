import { readConfig, writeConfig, getConfig } from './configStorage';
import { ConfigData } from '../types';
import { ConfigNotFoundError } from './errors';

export const createGroup = async (groupName: string): Promise<void> => {
  const data = await readConfig();

  if (!data.groups) {
    data.groups = {};
  }

  if (data.groups[groupName]) {
    throw new Error(`Group "${groupName}" already exists`);
  }

  data.groups[groupName] = [];
  await writeConfig(data);
};

export const addConfigToGroup = async (configName: string, groupName: string): Promise<void> => {
  const data = await readConfig();
  const config = await getConfig(configName);

  if (!config) {
    throw new ConfigNotFoundError(configName);
  }

  if (!data.groups) {
    data.groups = {};
  }

  if (!data.groups[groupName]) {
    data.groups[groupName] = [];
  }

  if (!data.groups[groupName].includes(configName)) {
    data.groups[groupName].push(configName);
  }

  // Update config's group property
  const configIndex = data.configs.findIndex(c => c.name === configName);
  if (configIndex !== -1) {
    data.configs[configIndex].group = groupName;
  }

  await writeConfig(data);
};

export const removeConfigFromGroup = async (configName: string, groupName: string): Promise<void> => {
  const data = await readConfig();

  if (!data.groups || !data.groups[groupName]) {
    return;
  }

  data.groups[groupName] = data.groups[groupName].filter(name => name !== configName);

  // Remove group from config
  const configIndex = data.configs.findIndex(c => c.name === configName);
  if (configIndex !== -1) {
    delete data.configs[configIndex].group;
  }

  await writeConfig(data);
};

export const deleteGroup = async (groupName: string): Promise<void> => {
  const data = await readConfig();

  if (!data.groups || !data.groups[groupName]) {
    throw new Error(`Group "${groupName}" does not exist`);
  }

  // Remove group from all configs
  data.configs.forEach(config => {
    if (config.group === groupName) {
      delete config.group;
    }
  });

  delete data.groups[groupName];
  await writeConfig(data);
};

export const getGroupConfigs = async (groupName: string): Promise<string[]> => {
  const data = await readConfig();
  return data.groups?.[groupName] || [];
};

export const getAllGroups = async (): Promise<string[]> => {
  const data = await readConfig();
  return Object.keys(data.groups || {});
};
