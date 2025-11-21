# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2024-11-21

### Added

#### Core Features
- ✅ Interactive CLI for managing multiple git configurations
- ✅ Automatic SSH key switching
- ✅ Shell alias integration (zsh, bash, PowerShell)
- ✅ Configuration persistence

#### New Features
- ✅ **Export/Import Configurations**: Backup and restore configs
  - `multiGit export [file]` - Export to file or stdout
  - `multiGit import <file>` - Import from file

- ✅ **Per-Repository Configuration**: Set local git config
  - `multiGit set-local <name>` - Set config for current repo only

- ✅ **SSH Key Generation**: Auto-generate SSH keys
  - `multiGit add <name> --generate-ssh-key` - Generate key automatically

- ✅ **Windows Support**: PowerShell integration
  - Automatic shell detection
  - PowerShell function generation
  - Profile integration

- ✅ **Git Hooks Integration**: Pre-commit verification
  - `multiGit hook install` - Install pre-commit hook
  - `multiGit hook uninstall` - Remove hook

- ✅ **Auto-Switch Based on Directory**: Smart identity switching
  - `multiGit auto-switch enable` - Enable feature
  - `multiGit auto-switch add <path> <config>` - Map directory to config
  - `multiGit auto-switch status` - Show current mappings

- ✅ **Configuration Groups**: Organize configs
  - `multiGit group create <name>` - Create group
  - `multiGit group add <group> <config>` - Add config to group
  - `multiGit group list` - List all groups
  - `multiGit group show <name>` - Show group details

### Technical
- ✅ TypeScript implementation
- ✅ Comprehensive error handling
- ✅ 50+ unit tests
- ✅ Cross-platform support (macOS, Linux, Windows)

### Documentation
- ✅ Complete README with examples
- ✅ Feature ideas document
- ✅ Project explanation document
