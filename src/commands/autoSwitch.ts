import chalk from 'chalk';
import {
  enableAutoSwitch,
  disableAutoSwitch,
  isAutoSwitchEnabled,
  addDirectoryMapping,
  removeDirectoryMapping,
  getConfigForDirectory,
} from '../utils/directoryMapper';
import { readConfig } from '../utils/configStorage';

export const autoSwitchCommand = async (
  action: string,
  path?: string,
  configName?: string
): Promise<void> => {
  try {
    switch (action) {
      case 'enable':
        await enableAutoSwitch();
        console.log(chalk.green('\n✅ Auto-switch enabled!\n'));
        break;

      case 'disable':
        await disableAutoSwitch();
        console.log(chalk.green('\n✅ Auto-switch disabled!\n'));
        break;

      case 'status':
        const enabled = await isAutoSwitchEnabled();
        const data = await readConfig();
        console.log(chalk.blue('\n📋 Auto-switch Status:\n'));
        console.log(chalk.cyan(`Enabled: ${enabled ? 'Yes' : 'No'}`));
        if (data.directoryMappings && Object.keys(data.directoryMappings).length > 0) {
          console.log(chalk.cyan('\nDirectory Mappings:'));
          for (const [dir, config] of Object.entries(data.directoryMappings)) {
            console.log(chalk.gray(`  ${dir} -> ${config}`));
          }
        }
        console.log('');
        break;

      case 'add':
        if (!path || !configName) {
          console.error(chalk.red('\n❌ Missing arguments\n'));
          console.log(chalk.yellow('Usage: multiGit auto-switch add <directory-path> <config-name>\n'));
          process.exit(1);
        }
        await addDirectoryMapping(path, configName);
        console.log(chalk.green(`\n✅ Added mapping: ${path} -> ${configName}\n`));
        break;

      case 'remove':
        if (!path) {
          console.error(chalk.red('\n❌ Missing directory path\n'));
          console.log(chalk.yellow('Usage: multiGit auto-switch remove <directory-path>\n'));
          process.exit(1);
        }
        await removeDirectoryMapping(path);
        console.log(chalk.green(`\n✅ Removed mapping for: ${path}\n`));
        break;

      case 'current':
        const currentConfig = await getConfigForDirectory();
        if (currentConfig) {
          console.log(chalk.cyan(`\nCurrent directory maps to: ${currentConfig}\n`));
        } else {
          console.log(chalk.yellow('\nNo mapping found for current directory\n'));
        }
        break;

      default:
        console.error(chalk.red(`\n❌ Unknown action: ${action}\n`));
        console.log(chalk.yellow('Usage: multiGit auto-switch <enable|disable|status|add|remove|current>\n'));
        process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red(`\n❌ Error: ${(error as Error).message}\n`));
    process.exit(1);
  }
};
