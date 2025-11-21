import { exec } from 'child_process';
import * as path from 'path';
import { promisify } from 'util';
import { SSHKeyNotFoundError } from './errors';
import { SSH_DIR } from './paths';

const execAsync = promisify(exec);

export interface SSHKeyGenerationOptions {
  email: string;
  keyName: string;
  keyType?: 'ed25519' | 'rsa';
  keySize?: number;
  passphrase?: string;
}

export const generateSSHKey = async (options: SSHKeyGenerationOptions): Promise<string> => {
  const { email, keyName, keyType = 'ed25519', keySize = 4096, passphrase } = options;
  const keyPath = path.join(SSH_DIR, keyName);
  const publicKeyPath = `${keyPath}.pub`;

  // Check if key already exists
  const fs = require('fs');
  if (fs.existsSync(keyPath)) {
    throw new SSHKeyNotFoundError(`SSH key already exists at ${keyPath}. Use a different name.`);
  }

  try {
    let command: string;

    if (keyType === 'ed25519') {
      command = `ssh-keygen -t ed25519 -C "${email}" -f "${keyPath}" -N "${passphrase || ''}"`;
    } else {
      command = `ssh-keygen -t rsa -b ${keySize} -C "${email}" -f "${keyPath}" -N "${passphrase || ''}"`;
    }

    await execAsync(command);

    // Verify key was created
    if (!fs.existsSync(keyPath) || !fs.existsSync(publicKeyPath)) {
      throw new Error('SSH key generation failed');
    }

    return keyPath;
  } catch (error) {
    throw new Error(`Failed to generate SSH key: ${(error as Error).message}`);
  }
};

export const getPublicKey = async (keyPath: string): Promise<string> => {
  const fs = require('fs').promises;
  const publicKeyPath = `${keyPath}.pub`;

  try {
    const content = await fs.readFile(publicKeyPath, 'utf-8');
    return content.trim();
  } catch (error) {
    throw new Error(`Failed to read public key: ${(error as Error).message}`);
  }
};
