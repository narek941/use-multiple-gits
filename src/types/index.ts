export interface GitConfig {
  name: string;
  displayName: string;
  userName: string;
  userEmail: string;
  sshKeyName: string;
  directoryPath?: string; // For auto-switch feature
  group?: string; // For configuration groups
}

export interface ConfigData {
  initialized: boolean;
  configs: GitConfig[];
  groups?: Record<string, string[]>; // Group name -> config names
  autoSwitchEnabled?: boolean;
  directoryMappings?: Record<string, string>; // Directory path -> config name
}

export interface InitOptions {
  addToPath?: boolean;
}

export interface ExportData {
  version: string;
  configs: GitConfig[];
  groups?: Record<string, string[]>;
  exportedAt: string;
}

export interface DirectoryMapping {
  path: string;
  configName: string;
}
