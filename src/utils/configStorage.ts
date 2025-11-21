import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { ensureDir } from './fs';
import { ConfigData, GitConfig } from '../types';
import { FileSystemError, InvalidConfigError } from './errors';

const CONFIG_DIR = path.join(os.homedir(), '.multi-git');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

const ensureConfigDir = async (): Promise<void> => {
  await ensureDir(CONFIG_DIR);
};

export const readConfig = async (): Promise<ConfigData> => {
  await ensureConfigDir();

  if (!fs.existsSync(CONFIG_FILE)) {
    return {
      initialized: false,
      configs: [],
      groups: {},
      autoSwitchEnabled: false,
      directoryMappings: {}
    };
  }

  try {
    const content = fs.readFileSync(CONFIG_FILE, 'utf-8');
    const data = JSON.parse(content) as ConfigData;

    if (!data.configs || !Array.isArray(data.configs)) {
      return {
        initialized: data.initialized || false,
        configs: [],
        groups: data.groups || {},
        autoSwitchEnabled: data.autoSwitchEnabled || false,
        directoryMappings: data.directoryMappings || {}
      };
    }

    return {
      initialized: data.initialized || false,
      configs: data.configs,
      groups: data.groups || {},
      autoSwitchEnabled: data.autoSwitchEnabled || false,
      directoryMappings: data.directoryMappings || {}
    };
  } catch (error) {
    throw new InvalidConfigError(
      `Failed to read config file: ${(error as Error).message}`
    );
  }
};

export const writeConfig = async (data: ConfigData): Promise<void> => {
  try {
    await ensureConfigDir();
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    throw new FileSystemError(
      `Failed to write config file: ${(error as Error).message}`,
      error as Error
    );
  }
};

export const addConfig = async (config: GitConfig): Promise<void> => {
  const data = await readConfig();

  if (!data.configs) {
    data.configs = [];
  }

  const existingIndex = data.configs.findIndex(c => c.name === config.name);

  if (existingIndex !== -1) {
    data.configs[existingIndex] = config;
  } else {
    data.configs.push(config);
  }

  await writeConfig(data);
};

export const removeConfig = async (name: string): Promise<void> => {
  const data = await readConfig();

  if (!data.configs) {
    return;
  }

  data.configs = data.configs.filter(c => c.name !== name);
  await writeConfig(data);
};

export const getConfig = async (name: string): Promise<GitConfig | null> => {
  const data = await readConfig();

  if (!data.configs) {
    return null;
  }

  return data.configs.find(c => c.name === name) || null;
};

export const getAllConfigs = async (): Promise<GitConfig[]> => {
  const data = await readConfig();
  return data.configs || [];
};

export const setInitialized = async (): Promise<void> => {
  const data = await readConfig();
  data.initialized = true;
  await writeConfig(data);
};

export const isInitialized = async (): Promise<boolean> => {
  const data = await readConfig();
  return data.initialized === true;
};
