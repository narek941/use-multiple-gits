import chalk from 'chalk';
import { importConfigsFromFile } from '../utils/exportImport';
import { addAliases } from '../utils/zshrc';
import { getAllConfigs } from '../utils/configStorage';
import { InvalidConfigError } from '../utils/errors';

export const importCommand = async (filePath: string): Promise<void> => {
  try {
    await importConfigsFromFile(filePath);

    // Update aliases after import
    const allConfigs = await getAllConfigs();
    await addAliases(allConfigs);

    console.log(chalk.green(`\n✅ Configurations imported from ${filePath}\n`));
    console.log(chalk.cyan('Next steps:'));
    console.log('  1. Reload shell: source ~/.zshrc (or restart PowerShell)');
    console.log('  2. Verify: multiGit list\n');
  } catch (error) {
    if (error instanceof InvalidConfigError) {
      console.error(chalk.red(`\n❌ ${error.message}\n`));
    } else {
      console.error(chalk.red(`\n❌ Error: ${(error as Error).message}\n`));
    }
    process.exit(1);
  }
};
