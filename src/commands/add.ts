import inquirer from 'inquirer';
import chalk from 'chalk';
import * as path from 'path';
import { generateScript } from '../utils/scriptGenerator';
import { addAliases } from '../utils/zshrc';
import { addConfig, getAllConfigs, isInitialized } from '../utils/configStorage';
import { fileExists } from '../utils/fs';
import { SSH_DIR } from '../utils/paths';
import { GitConfig } from '../types';
import { initCommand } from './init';
import { SSHKeyNotFoundError, FileSystemError } from '../utils/errors';
import { generateSSHKey } from '../utils/sshKeyGenerator';

interface AddAnswers {
  displayName: string;
  userName: string;
  userEmail: string;
  sshKeyName: string;
}

export const addCommand = async (name: string, options?: { generateSshKey?: boolean }): Promise<void> => {
  try {
    if (!name) {
      console.log(chalk.red('Error: Configuration name is required'));
      console.log(chalk.yellow('Usage: multiGit add <name>'));
      process.exit(1);
    }

    const initialized = await isInitialized();

    if (!initialized) {
      console.log(chalk.yellow('⚠️  Multi-Git not initialized. Running init...\n'));
      await initCommand();
    }

    console.log(chalk.blue(`\n📝 Adding configuration: ${name}\n`));

    const existingConfigs = await getAllConfigs();
    const existingConfig = existingConfigs.find(c => c.name === name);

    if (existingConfig) {
      const { overwrite } = await inquirer.prompt<{ overwrite: boolean }>([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `Configuration "${name}" already exists. Overwrite?`,
          default: false,
        },
      ]);

      if (!overwrite) {
        console.log(chalk.yellow('Cancelled.'));
        return;
      }
    }

    const questions = [
      {
        type: 'input',
        name: 'displayName',
        message: 'Display name (e.g., "Work", "Personal", "Company"):',
        default: name.charAt(0).toUpperCase() + name.slice(1),
      },
      {
        type: 'input',
        name: 'userName',
        message: 'Git user.name:',
        validate: (input: string) => input.trim().length > 0 || 'User name is required',
      },
      {
        type: 'input',
        name: 'userEmail',
        message: 'Git user.email:',
        validate: (input: string) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(input) || 'Valid email is required';
        },
      },
    {
      type: 'input',
      name: 'sshKeyName',
      message: 'SSH key filename (e.g., id_ed25519_work):',
      default: `id_ed25519_${name}`,
        validate: (input: string) => {
          const keyPath = path.join(SSH_DIR, input);
          if (!fileExists(keyPath)) {
            if (options?.generateSshKey) {
              // Will generate key later
              return true;
            }
            return `SSH key not found at ${keyPath}. Use --generate-ssh-key to create it automatically.`;
          }
          return true;
        },
    },
    ];

    const answers = await inquirer.prompt<AddAnswers>(questions);

    // Generate SSH key if needed
    let sshKeyName = answers.sshKeyName;
    const keyPath = path.join(SSH_DIR, sshKeyName);

    if (!fileExists(keyPath) && options?.generateSshKey) {
      console.log(chalk.blue(`\n🔑 Generating SSH key: ${sshKeyName}...\n`));
      try {
        await generateSSHKey({
          email: answers.userEmail,
          keyName: sshKeyName,
          keyType: 'ed25519',
        });
        console.log(chalk.green(`✅ SSH key generated successfully!\n`));
        console.log(chalk.cyan('Public key:'));
        const { getPublicKey } = require('../utils/sshKeyGenerator');
        const publicKey = await getPublicKey(keyPath);
        console.log(chalk.gray(publicKey));
        console.log(chalk.yellow('\n⚠️  Add this key to your GitHub/GitLab account!\n'));
      } catch (error) {
        console.error(chalk.red(`\n❌ Failed to generate SSH key: ${(error as Error).message}\n`));
        process.exit(1);
      }
    }

    const config: GitConfig = {
      name,
      displayName: answers.displayName,
      userName: answers.userName,
      userEmail: answers.userEmail,
      sshKeyName,
    };

    await generateScript(config);
    await addConfig(config);

    const allConfigs = await getAllConfigs();
    await addAliases(allConfigs);

    console.log(chalk.green(`\n✅ Configuration "${name}" added successfully!\n`));
    console.log(chalk.cyan('Next steps:'));
    console.log(`  1. Reload shell: source ~/.zshrc`);
    console.log(`  2. Use: use-${name}`);
    console.log(`  3. Add SSH public key to GitHub/GitLab:`);
    console.log(chalk.gray(`     cat ~/.ssh/${answers.sshKeyName}.pub\n`));
  } catch (error) {
    if (error instanceof SSHKeyNotFoundError) {
      console.error(chalk.red(`\n❌ ${error.message}`));
      console.log(chalk.yellow(`   Please generate it first with:`));
      console.log(chalk.gray(`   ssh-keygen -t ed25519 -C "your.email@domain.com" -f ~/.ssh/${error.message.split(' ').pop()}\n`));
    } else if (error instanceof FileSystemError) {
      console.error(chalk.red(`\n❌ ${error.message}\n`));
    } else {
      console.error(chalk.red(`\n❌ Error: ${(error as Error).message}\n`));
    }
    process.exit(1);
  }
};
