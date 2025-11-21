import chalk from 'chalk';
import { exportConfigs, exportConfigsToFile } from '../utils/exportImport';
import { writeFile } from '../utils/fs';
import { FileSystemError } from '../utils/errors';

export const exportCommand = async (filePath?: string): Promise<void> => {
  try {
    const exportData = await exportConfigs();

    if (filePath) {
      await exportConfigsToFile(filePath);
      console.log(chalk.green(`\n✅ Configurations exported to ${filePath}\n`));
    } else {
      // Output to stdout
      console.log(JSON.stringify(exportData, null, 2));
    }
  } catch (error) {
    if (error instanceof FileSystemError) {
      console.error(chalk.red(`\n❌ ${error.message}\n`));
    } else {
      console.error(chalk.red(`\n❌ Error: ${(error as Error).message}\n`));
    }
    process.exit(1);
  }
};
