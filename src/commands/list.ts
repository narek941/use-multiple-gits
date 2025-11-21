import chalk from 'chalk';
import { getAllConfigs, isInitialized } from '../utils/configStorage';

export const listCommand = async (): Promise<void> => {
  try {
    const initialized = await isInitialized();

    if (!initialized) {
      console.log(chalk.yellow('⚠️  Multi-Git not initialized. Run: multiGit init\n'));
      return;
    }

    const configs = await getAllConfigs();

    if (configs.length === 0) {
      console.log(chalk.yellow('No configurations found. Add one with: multiGit add <name>\n'));
      return;
    }

    console.log(chalk.blue('\n📋 Configured Git Identities:\n'));

    configs.forEach((config, index) => {
      console.log(chalk.cyan(`${index + 1}. ${config.displayName || config.name}`));
      console.log(chalk.gray(`   Name: ${config.userName}`));
      console.log(chalk.gray(`   Email: ${config.userEmail}`));
      console.log(chalk.gray(`   SSH Key: ~/.ssh/${config.sshKeyName}`));
      console.log(chalk.gray(`   Command: use-${config.name}`));
      console.log('');
    });
  } catch (error) {
    console.error(chalk.red(`\n❌ Error: ${(error as Error).message}\n`));
    process.exit(1);
  }
};
