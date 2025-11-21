import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';
import { BIN_DIR } from './paths';
import { FileSystemError } from './errors';

export const ensureDir = async (dirPath: string): Promise<void> => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw new FileSystemError(
        `Failed to create directory: ${dirPath}`,
        error as Error
      );
    }
  }
};

export const readFile = async (filePath: string): Promise<string | null> => {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw new FileSystemError(
      `Failed to read file: ${filePath}`,
      error as Error
    );
  }
};

export const writeFile = async (filePath: string, content: string): Promise<void> => {
  try {
    await fs.writeFile(filePath, content, 'utf-8');
  } catch (error) {
    throw new FileSystemError(
      `Failed to write file: ${filePath}`,
      error as Error
    );
  }
};

export const fileExists = (filePath: string): boolean => {
  return fsSync.existsSync(filePath);
};

export const makeExecutable = async (filePath: string): Promise<void> => {
  try {
    await fs.chmod(filePath, 0o755);
  } catch (error) {
    throw new FileSystemError(
      `Failed to make file executable: ${filePath}`,
      error as Error
    );
  }
};

export const getScriptPath = (name: string): string => {
  return path.join(BIN_DIR, `use-${name}.sh`);
};

export const removeFile = async (filePath: string): Promise<void> => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw new FileSystemError(
        `Failed to remove file: ${filePath}`,
        error as Error
      );
    }
  }
};
