import { loginUrlWithReturn, safeNextPath } from '@/lib/sessionAuth';

describe('sessionAuth', () => {
  it('accepts relative app paths', () => {
    expect(safeNextPath('/vaults/1?note=2')).toBe('/vaults/1?note=2');
    expect(safeNextPath('%2Fvaults%2F3')).toBe('/vaults/3');
  });

  it('rejects open redirects and api paths', () => {
    expect(safeNextPath('//evil.example')).toBeNull();
    expect(safeNextPath('/api/vaults')).toBeNull();
    expect(safeNextPath('https://evil.example')).toBeNull();
  });

  it('builds login url with next', () => {
    expect(loginUrlWithReturn('/vaults/1?note=9')).toBe('/?next=%2Fvaults%2F1%3Fnote%3D9');
    expect(loginUrlWithReturn('/')).toBe('/');
  });
});
