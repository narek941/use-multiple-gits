import inquirer from 'inquirer';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { ensureDir } from '../utils/fs';
import { BIN_DIR, ZSHRC_PATH } from '../utils/paths';
import { setInitialized, isInitialized } from '../utils/configStorage';
import { readZshrc } from '../utils/zshrc';
import { FileSystemError } from '../utils/errors';

export const initCommand = async (): Promise<void> => {
  try {
    console.log(chalk.blue('\n🚀 Initializing Multi-Git Configuration System\n'));

    const alreadyInitialized = await isInitialized();

    if (alreadyInitialized) {
      const { proceed } = await inquirer.prompt<{ proceed: boolean }>([
        {
          type: 'confirm',
          name: 'proceed',
          message: 'Multi-Git is already initialized. Re-initialize?',
          default: false,
        },
      ]);

      if (!proceed) {
        console.log(chalk.yellow('Cancelled.'));
        return;
      }
    }

    await ensureDir(BIN_DIR);

    const zshrcExists = fs.existsSync(ZSHRC_PATH);

    if (!zshrcExists) {
      console.log(chalk.yellow(`⚠️  ${ZSHRC_PATH} not found. Creating it...`));
      fs.writeFileSync(ZSHRC_PATH, '');
    }

    const zshrcContent = await readZshrc();
    const hasBinInPath = zshrcContent.includes('$HOME/.bin') || zshrcContent.includes('~/.bin');

    if (!hasBinInPath) {
      const { addToPath } = await inquirer.prompt<{ addToPath: boolean }>([
        {
          type: 'confirm',
          name: 'addToPath',
          message: 'Add ~/.bin to PATH in ~/.zshrc?',
          default: true,
        },
      ]);

      if (addToPath) {
        const currentContent = fs.readFileSync(ZSHRC_PATH, 'utf-8');
        const pathExport = '\nexport PATH="$HOME/.bin:$PATH"\n';

        if (!currentContent.includes(pathExport.trim())) {
          fs.appendFileSync(ZSHRC_PATH, pathExport);
          console.log(chalk.green('✅ Added ~/.bin to PATH'));
        }
      }
    }

    await setInitialized();

    console.log(chalk.green('\n✅ Multi-Git initialized successfully!\n'));
    console.log(chalk.cyan('Next steps:'));
    console.log('  1. Run: source ~/.zshrc');
    console.log('  2. Add a configuration: multiGit add <name>');
    console.log('  3. Example: multiGit add work\n');
  } catch (error) {
    if (error instanceof FileSystemError) {
      console.error(chalk.red(`\n❌ ${error.message}\n`));
    } else {
      console.error(chalk.red(`\n❌ Unexpected error: ${(error as Error).message}\n`));
    }
    process.exit(1);
  }
};
