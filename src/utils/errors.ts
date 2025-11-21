export class MultiGitError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'MultiGitError';
    Object.setPrototypeOf(this, MultiGitError.prototype);
  }
}

export class ConfigNotFoundError extends MultiGitError {
  constructor(name: string) {
    super(`Configuration "${name}" not found`, 'CONFIG_NOT_FOUND');
    this.name = 'ConfigNotFoundError';
  }
}

export class SSHKeyNotFoundError extends MultiGitError {
  constructor(keyPath: string) {
    super(`SSH key not found at ${keyPath}`, 'SSH_KEY_NOT_FOUND');
    this.name = 'SSHKeyNotFoundError';
  }
}

export class InvalidConfigError extends MultiGitError {
  constructor(message: string) {
    super(message, 'INVALID_CONFIG');
    this.name = 'InvalidConfigError';
  }
}

export class FileSystemError extends MultiGitError {
  constructor(message: string, public originalError?: Error) {
    super(message, 'FILE_SYSTEM_ERROR');
    this.name = 'FileSystemError';
  }
}
