import chalk from 'chalk';
import { installPreCommitHook, uninstallPreCommitHook } from '../utils/gitHooks';

export const hookCommand = async (action: string): Promise<void> => {
  try {
    if (action === 'install') {
      await installPreCommitHook();
      console.log(chalk.green('\n✅ Pre-commit hook installed successfully!\n'));
      console.log(chalk.cyan('The hook will verify your git identity before each commit.\n'));
    } else if (action === 'uninstall') {
      await uninstallPreCommitHook();
      console.log(chalk.green('\n✅ Pre-commit hook uninstalled successfully!\n'));
    } else {
      console.error(chalk.red(`\n❌ Unknown action: ${action}\n`));
      console.log(chalk.yellow('Usage: multiGit hook <install|uninstall>\n'));
      process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red(`\n❌ Error: ${(error as Error).message}\n`));
    process.exit(1);
  }
};
