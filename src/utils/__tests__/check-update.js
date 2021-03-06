import { versionGreaterThan } from '../check-update';

describe('checkUpdate.versionGreaterThan', () => {
  test('should determine if a version string is greater than another version string', () => {
    expect(versionGreaterThan('v1.0.0', 'v0.0.0')).toBeTruthy();
    expect(versionGreaterThan('v1.0.0', 'v2.0.0')).toBeFalsy();
    expect(versionGreaterThan('1.0.0', 'v0.0.0')).toBeTruthy();
    expect(versionGreaterThan('1.1.0', 'v1.1.1')).toBeFalsy();
    expect(versionGreaterThan('2.0.0', '1.9.0')).toBeTruthy();
    expect(versionGreaterThan('1.9.0', '1.8.9')).toBeTruthy();
    expect(versionGreaterThan('1.8.9', '1.9.0')).toBeFalsy();
  });
});
