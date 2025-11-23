#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { join } from 'path';
import { addCommand } from '../commands/add';
import { autoSwitchCommand } from '../commands/autoSwitch';
import { exportCommand } from '../commands/export';
import { groupCommand } from '../commands/group';
import { hookCommand } from '../commands/hook';
import { importCommand } from '../commands/import';
import { initCommand } from '../commands/init';
import { listCommand } from '../commands/list';
import { removeCommand } from '../commands/remove';
import { setLocalCommand } from '../commands/setLocal';
import { setupCommand } from '../commands/setup';

const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../../package.json'), 'utf-8')
);

const program = new Command();

program
  .name('multiGit')
  .description('CLI tool to manage multiple git configurations')
  .version(packageJson.version);

program
  .command('setup')
  .description('Complete setup: install, initialize, and optionally add first config')
  .option('--auto-add <name>', 'Automatically add a configuration after setup')
  .option('--generate-ssh-key', 'Generate SSH key when adding config')
  .action((options) => {
    setupCommand({
      autoAdd: !!options.autoAdd,
      configName: options.autoAdd,
      generateSshKey: options.generateSshKey,
    });
  });

program
  .command('init')
  .description('Initialize multi-git configuration system')
  .action(initCommand);

program
  .command('add <name>')
  .description('Add a new git configuration')
  .option('--generate-ssh-key', 'Automatically generate SSH key if missing')
  .action((name, options) => {
    addCommand(name, { generateSshKey: options.generateSshKey });
  });

program.command('list').description('List all configured git identities').action(listCommand);

program.command('remove <name>').description('Remove a git configuration').action(removeCommand);

program
  .command('export [file]')
  .description('Export configurations to file (or stdout if no file specified)')
  .action(exportCommand);

program
  .command('import <file>')
  .description('Import configurations from file')
  .action(importCommand);

program
  .command('set-local <name>')
  .description('Set git config for current repository only (not global)')
  .action(setLocalCommand);

program
  .command('hook <action>')
  .description('Manage git hooks (install/uninstall pre-commit hook)')
  .action(hookCommand);

program
  .command('auto-switch <action>')
  .description('Manage auto-switch feature (enable/disable/add/remove)')
  .argument('[path]', 'Directory path for mapping')
  .argument('[config]', 'Config name for mapping')
  .action((action, path, config) => autoSwitchCommand(action, path, config));

program
  .command('group <action>')
  .description('Manage configuration groups (create/add/remove/delete/list)')
  .argument('[groupName]', 'Group name')
  .argument('[configName]', 'Config name')
  .action((action, groupName, configName) => groupCommand(action, groupName, configName));

program.parse();
