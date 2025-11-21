import {
  createGroup,
  addConfigToGroup,
  removeConfigFromGroup,
  deleteGroup,
  getGroupConfigs,
  getAllGroups,
} from '../../utils/groupManager';
import { addConfig, removeConfig } from '../../utils/configStorage';
import { GitConfig } from '../../types';

describe('groupManager', () => {
  const testConfig1: GitConfig = {
    name: 'work',
    displayName: 'Work',
    userName: 'John Doe',
    userEmail: 'john@company.com',
    sshKeyName: 'id_ed25519_work',
  };

  const testConfig2: GitConfig = {
    name: 'personal',
    displayName: 'Personal',
    userName: 'John Doe',
    userEmail: 'john@gmail.com',
    sshKeyName: 'id_ed25519_personal',
  };

  beforeEach(async () => {
    // Clean up
    try {
      await removeConfig('work');
      await removeConfig('personal');
    } catch {
      // Ignore
    }
  });

  describe('createGroup', () => {
    it('should create a new group', async () => {
      const uniqueGroupName = `test-group-${Date.now()}`;
      await createGroup(uniqueGroupName);
      const groups = await getAllGroups();
      expect(groups).toContain(uniqueGroupName);
    });

    it('should throw if group already exists', async () => {
      const uniqueGroupName = `existing-group-${Date.now()}`;
      await createGroup(uniqueGroupName);
      await expect(createGroup(uniqueGroupName)).rejects.toThrow();
    });
  });

  describe('addConfigToGroup', () => {
    it('should add config to group', async () => {
      await addConfig(testConfig1);
      // Use unique group name to avoid conflicts
      const uniqueGroupName = `work-group-${Date.now()}`;
      await createGroup(uniqueGroupName);
      await addConfigToGroup('work', uniqueGroupName);

      const configs = await getGroupConfigs(uniqueGroupName);
      expect(configs).toContain('work');
    });
  });

  describe('removeConfigFromGroup', () => {
    it('should remove config from group', async () => {
      await addConfig(testConfig1);
      // Use unique group name to avoid conflicts
      const uniqueGroupName = `work-group-${Date.now()}`;
      await createGroup(uniqueGroupName);
      await addConfigToGroup('work', uniqueGroupName);
      await removeConfigFromGroup('work', uniqueGroupName);

      const configs = await getGroupConfigs(uniqueGroupName);
      expect(configs).not.toContain('work');
    });
  });

  describe('deleteGroup', () => {
    it('should delete group', async () => {
      await createGroup('temp-group');
      await deleteGroup('temp-group');

      const groups = await getAllGroups();
      expect(groups).not.toContain('temp-group');
    });
  });

  describe('getGroupConfigs', () => {
    it('should return configs in group', async () => {
      await addConfig(testConfig1);
      await addConfig(testConfig2);
      const uniqueGroupName = `all-group-${Date.now()}`;
      await createGroup(uniqueGroupName);
      await addConfigToGroup('work', uniqueGroupName);
      await addConfigToGroup('personal', uniqueGroupName);

      const configs = await getGroupConfigs(uniqueGroupName);
      expect(configs.length).toBeGreaterThanOrEqual(2);
      expect(configs).toContain('work');
      expect(configs).toContain('personal');
    });
  });
});
