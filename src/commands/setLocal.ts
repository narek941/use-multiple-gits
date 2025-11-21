import chalk from 'chalk';
import { exec } from 'child_process';
import { promisify } from 'util';
import { getConfig } from '../utils/configStorage';
import { ConfigNotFoundError } from '../utils/errors';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

export const setLocalCommand = async (name: string): Promise<void> => {
  try {
    const config = await getConfig(name);

    if (!config) {
      throw new ConfigNotFoundError(name);
    }

    // Check if we're in a git repository
    const gitDir = path.join(process.cwd(), '.git');
    if (!fs.existsSync(gitDir)) {
      console.error(chalk.red('\n❌ Not a git repository. Run this command from a git repository root.\n'));
      process.exit(1);
    }

    // Set local git config
    await execAsync(`git config user.name "${config.userName}"`);
    await execAsync(`git config user.email "${config.userEmail}"`);

    // Set SSH key for this repo
    const sshKeyPath = path.join(require('os').homedir(), '.ssh', config.sshKeyName);
    await execAsync(`git config core.sshCommand "ssh -i ${sshKeyPath} -F /dev/null"`);

    console.log(chalk.green(`\n✅ Set local git config for this repository:\n`));
    console.log(chalk.cyan(`   Name: ${config.userName}`));
    console.log(chalk.cyan(`   Email: ${config.userEmail}`));
    console.log(chalk.cyan(`   SSH Key: ${config.sshKeyName}\n`));
  } catch (error) {
    if (error instanceof ConfigNotFoundError) {
      console.error(chalk.red(`\n❌ ${error.message}\n`));
    } else {
      console.error(chalk.red(`\n❌ Error: ${(error as Error).message}\n`));
    }
    process.exit(1);
  }
};
