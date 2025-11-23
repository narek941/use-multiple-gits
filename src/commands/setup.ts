import chalk from 'chalk';
import { initCommand } from './init';
import { addCommand } from './add';
import { isInitialized } from '../utils/configStorage';

interface SetupOptions {
  autoAdd?: boolean;
  configName?: string;
  displayName?: string;
  userName?: string;
  userEmail?: string;
  sshKeyName?: string;
  generateSshKey?: boolean;
}

export const setupCommand = async (options: SetupOptions = {}): Promise<void> => {
  try {
    console.log(chalk.blue('\n🚀 Setting up Multi-Git Configuration System\n'));

    const initialized = await isInitialized();
    
    if (!initialized) {
      console.log(chalk.cyan('Step 1/2: Initializing...'));
      await initCommand();
    } else {
      console.log(chalk.green('✅ Already initialized, skipping init step'));
    }

    if (options.autoAdd && options.configName) {
      console.log(chalk.cyan('\nStep 2/2: Adding configuration...'));
      
      if (options.userName && options.userEmail && options.sshKeyName) {
        console.log(chalk.yellow('⚠️  Non-interactive mode requires all config details'));
        console.log(chalk.cyan('Run interactive setup: multiGit add <name>\n'));
        return;
      }
      
      await addCommand(options.configName, { generateSshKey: options.generateSshKey });
    } else {
      console.log(chalk.cyan('\n✅ Setup complete!\n'));
      console.log(chalk.yellow('Next steps:'));
      console.log('  1. Run: source ~/.zshrc (or restart your terminal)');
      console.log('  2. Add a configuration: multiGit add <name>');
      console.log('  3. Example: multiGit add work\n');
    }

    console.log(chalk.green('🎉 All done! Multi-Git is ready to use.\n'));
  } catch (error) {
    console.error(chalk.red(`\n❌ Setup failed: ${(error as Error).message}\n`));
    process.exit(1);
  }
};

