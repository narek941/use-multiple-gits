import {
  MultiGitError,
  ConfigNotFoundError,
  SSHKeyNotFoundError,
  InvalidConfigError,
  FileSystemError,
} from '../../utils/errors';

describe('Custom Errors', () => {
  describe('MultiGitError', () => {
    it('should create error with message', () => {
      const error = new MultiGitError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('MultiGitError');
    });

    it('should create error with code', () => {
      const error = new MultiGitError('Test error', 'TEST_CODE');
      expect(error.code).toBe('TEST_CODE');
    });
  });

  describe('ConfigNotFoundError', () => {
    it('should create error with config name', () => {
      const error = new ConfigNotFoundError('work');
      expect(error.message).toContain('work');
      expect(error.name).toBe('ConfigNotFoundError');
      expect(error.code).toBe('CONFIG_NOT_FOUND');
    });
  });

  describe('SSHKeyNotFoundError', () => {
    it('should create error with key path', () => {
      const error = new SSHKeyNotFoundError('/path/to/key');
      expect(error.message).toContain('/path/to/key');
      expect(error.name).toBe('SSHKeyNotFoundError');
      expect(error.code).toBe('SSH_KEY_NOT_FOUND');
    });
  });

  describe('InvalidConfigError', () => {
    it('should create error with message', () => {
      const error = new InvalidConfigError('Invalid configuration');
      expect(error.message).toBe('Invalid configuration');
      expect(error.name).toBe('InvalidConfigError');
      expect(error.code).toBe('INVALID_CONFIG');
    });
  });

  describe('FileSystemError', () => {
    it('should create error with message and original error', () => {
      const originalError = new Error('Original error');
      const error = new FileSystemError('File system error', originalError);
      expect(error.message).toBe('File system error');
      expect(error.originalError).toBe(originalError);
      expect(error.name).toBe('FileSystemError');
      expect(error.code).toBe('FILE_SYSTEM_ERROR');
    });
  });
});
