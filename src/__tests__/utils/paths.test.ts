import { HOME_DIR, BIN_DIR, ZSHRC_PATH, SSH_DIR } from '../../utils/paths';
import * as os from 'os';
import * as path from 'path';

describe('paths', () => {
  it('should export correct HOME_DIR', () => {
    expect(HOME_DIR).toBe(os.homedir());
  });

  it('should export correct BIN_DIR', () => {
    expect(BIN_DIR).toBe(path.join(os.homedir(), '.bin'));
  });

  it('should export correct ZSHRC_PATH', () => {
    expect(ZSHRC_PATH).toBe(path.join(os.homedir(), '.zshrc'));
  });

  it('should export correct SSH_DIR', () => {
    expect(SSH_DIR).toBe(path.join(os.homedir(), '.ssh'));
  });
});
