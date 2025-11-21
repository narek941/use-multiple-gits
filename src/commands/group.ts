import chalk from 'chalk';
import {
  createGroup,
  addConfigToGroup,
  removeConfigFromGroup,
  deleteGroup,
  getGroupConfigs,
  getAllGroups,
} from '../utils/groupManager';
import { getAllConfigs } from '../utils/configStorage';

export const groupCommand = async (
  action: string,
  groupName?: string,
  configName?: string
): Promise<void> => {
  try {
    switch (action) {
      case 'create':
        if (!groupName) {
          console.error(chalk.red('\n❌ Missing group name\n'));
          console.log(chalk.yellow('Usage: multiGit group create <group-name>\n'));
          process.exit(1);
        }
        await createGroup(groupName);
        console.log(chalk.green(`\n✅ Group "${groupName}" created!\n`));
        break;

      case 'add':
        if (!groupName || !configName) {
          console.error(chalk.red('\n❌ Missing arguments\n'));
          console.log(chalk.yellow('Usage: multiGit group add <group-name> <config-name>\n'));
          process.exit(1);
        }
        await addConfigToGroup(configName, groupName);
        console.log(chalk.green(`\n✅ Added "${configName}" to group "${groupName}"\n`));
        break;

      case 'remove':
        if (!groupName || !configName) {
          console.error(chalk.red('\n❌ Missing arguments\n'));
          console.log(chalk.yellow('Usage: multiGit group remove <group-name> <config-name>\n'));
          process.exit(1);
        }
        await removeConfigFromGroup(configName, groupName);
        console.log(chalk.green(`\n✅ Removed "${configName}" from group "${groupName}"\n`));
        break;

      case 'delete':
        if (!groupName) {
          console.error(chalk.red('\n❌ Missing group name\n'));
          console.log(chalk.yellow('Usage: multiGit group delete <group-name>\n'));
          process.exit(1);
        }
        await deleteGroup(groupName);
        console.log(chalk.green(`\n✅ Group "${groupName}" deleted!\n`));
        break;

      case 'list':
        const groups = await getAllGroups();
        if (groups.length === 0) {
          console.log(chalk.yellow('\nNo groups found.\n'));
        } else {
          console.log(chalk.blue('\n📋 Configuration Groups:\n'));
          for (const group of groups) {
            const configs = await getGroupConfigs(group);
            console.log(chalk.cyan(`${group}:`));
            if (configs.length === 0) {
              console.log(chalk.gray('  (empty)'));
            } else {
              configs.forEach(config => {
                console.log(chalk.gray(`  - ${config}`));
              });
            }
            console.log('');
          }
        }
        break;

      case 'show':
        if (!groupName) {
          console.error(chalk.red('\n❌ Missing group name\n'));
          console.log(chalk.yellow('Usage: multiGit group show <group-name>\n'));
          process.exit(1);
        }
        const groupConfigs = await getGroupConfigs(groupName);
        if (groupConfigs.length === 0) {
          console.log(chalk.yellow(`\nGroup "${groupName}" is empty or does not exist.\n`));
        } else {
          console.log(chalk.blue(`\n📋 Group "${groupName}":\n`));
          const allConfigs = await getAllConfigs();
          groupConfigs.forEach(configName => {
            const config = allConfigs.find(c => c.name === configName);
            if (config) {
              console.log(chalk.cyan(`  ${config.displayName || config.name}`));
              console.log(chalk.gray(`    Name: ${config.userName}`));
              console.log(chalk.gray(`    Email: ${config.userEmail}`));
            }
          });
          console.log('');
        }
        break;

      default:
        console.error(chalk.red(`\n❌ Unknown action: ${action}\n`));
        console.log(chalk.yellow('Usage: multiGit group <create|add|remove|delete|list|show>\n'));
        process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red(`\n❌ Error: ${(error as Error).message}\n`));
    process.exit(1);
  }
};
