import * as path from 'path';
import * as fs from 'fs';
import { fileExists, writeFile, makeExecutable } from './fs';
import { getAllConfigs } from './configStorage';
import { FileSystemError } from './errors';

const GIT_HOOKS_DIR = '.git/hooks';
const PRE_COMMIT_HOOK = 'pre-commit';

export const installPreCommitHook = async (repoPath: string = process.cwd()): Promise<void> => {
  const hooksDir = path.join(repoPath, GIT_HOOKS_DIR);
  const hookPath = path.join(hooksDir, PRE_COMMIT_HOOK);

  // Check if it's a git repository
  if (!fileExists(path.join(repoPath, '.git'))) {
    throw new Error('Not a git repository. Run this command from a git repository root.');
  }

  // Create hooks directory if it doesn't exist
  if (!fileExists(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }

  const configs = await getAllConfigs();
  const configNames = configs.map(c => c.name).join(', ');

  const hookContent = `#!/bin/bash
# Multi-Git Pre-commit Hook
# Verifies that the correct git identity is being used

CURRENT_NAME=$(git config user.name)
CURRENT_EMAIL=$(git config user.email)

echo "Current Git identity: $CURRENT_NAME <$CURRENT_EMAIL>"
echo "Available configs: ${configNames}"

# Note: This hook can be enhanced to check directory mappings
# For now, it's a simple identity verification hook

exit 0
`;

  try {
    await writeFile(hookPath, hookContent);
    await makeExecutable(hookPath);
  } catch (error) {
    throw new FileSystemError(
      `Failed to install pre-commit hook: ${(error as Error).message}`,
      error as Error
    );
  }
};

export const uninstallPreCommitHook = async (repoPath: string = process.cwd()): Promise<void> => {
  const hookPath = path.join(repoPath, GIT_HOOKS_DIR, PRE_COMMIT_HOOK);

  if (fileExists(hookPath)) {
    try {
      fs.unlinkSync(hookPath);
    } catch (error) {
      throw new FileSystemError(
        `Failed to uninstall pre-commit hook: ${(error as Error).message}`,
        error as Error
      );
    }
  }
};
