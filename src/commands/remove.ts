import inquirer from 'inquirer';
import chalk from 'chalk';
import { removeConfig, getConfig, getAllConfigs, isInitialized } from '../utils/configStorage';
import { removeAlias, addAliases } from '../utils/zshrc';
import { getScriptPath, removeFile } from '../utils/fs';
import { ConfigNotFoundError, FileSystemError } from '../utils/errors';

export const removeCommand = async (name: string): Promise<void> => {
  try {
    if (!name) {
      console.log(chalk.red('Error: Configuration name is required'));
      console.log(chalk.yellow('Usage: multiGit remove <name>'));
      process.exit(1);
    }

    const initialized = await isInitialized();

    if (!initialized) {
      console.log(chalk.yellow('⚠️  Multi-Git not initialized.\n'));
      return;
    }

    const config = await getConfig(name);

    if (!config) {
      throw new ConfigNotFoundError(name);
    }

    const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Remove configuration "${name}"?`,
        default: false,
      },
    ]);

    if (!confirm) {
      console.log(chalk.yellow('Cancelled.'));
      return;
    }

    const scriptPath = getScriptPath(name);
    await removeFile(scriptPath);
    console.log(chalk.green(`✅ Removed script: ${scriptPath}`));

    await removeConfig(name);
    await removeAlias(name);

    const allConfigs = await getAllConfigs();
    if (allConfigs.length > 0) {
      await addAliases(allConfigs);
    }

    console.log(chalk.green(`\n✅ Configuration "${name}" removed successfully!\n`));
  } catch (error) {
    if (error instanceof ConfigNotFoundError) {
      console.error(chalk.red(`\n❌ ${error.message}\n`));
    } else if (error instanceof FileSystemError) {
      console.error(chalk.red(`\n❌ ${error.message}\n`));
    } else {
      console.error(chalk.red(`\n❌ Error: ${(error as Error).message}\n`));
    }
    process.exit(1);
  }
};
