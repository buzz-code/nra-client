import { resolvePendingFiles } from '../pendingFiles.util';
import { readAsDataURL } from '@shared/utils/fileUtil';

jest.mock('@shared/utils/fileUtil', () => ({
  readAsDataURL: jest.fn(),
}));

const mockReadAsDataURL = readAsDataURL as jest.Mock;

describe('resolvePendingFiles', () => {
  beforeEach(() => {
    mockReadAsDataURL.mockReset();
    mockReadAsDataURL.mockResolvedValue('data:application/pdf;base64,JVBERi0=');
  });

  it('replaces a blob: src with the data URL of rawFile', async () => {
    const rawFile = new File(['%PDF-'], 'a.pdf', { type: 'application/pdf' });
    const result = await resolvePendingFiles({
      title: 'x',
      fileData: { src: 'blob:https://app/123', title: 'a.pdf', rawFile },
    });

    expect(mockReadAsDataURL).toHaveBeenCalledWith(rawFile);
    expect(result.fileData.src).toBe('data:application/pdf;base64,JVBERi0=');
    expect(result.fileData.title).toBe('a.pdf');
    expect(result.title).toBe('x');
  });

  it('handles files inside arrays', async () => {
    const rawFile = new File(['x'], 'a.png', { type: 'image/png' });
    const result = await resolvePendingFiles({ files: [{ src: 'blob:https://app/1', rawFile }] });

    expect(result.files[0].src).toBe('data:application/pdf;base64,JVBERi0=');
  });

  it('leaves already converted files untouched', async () => {
    const value = { fileData: { src: 'data:application/pdf;base64,AAA', title: 'a.pdf' } };
    const result = await resolvePendingFiles(value);

    expect(mockReadAsDataURL).not.toHaveBeenCalled();
    expect(result).toEqual(value);
  });

  it('ignores a blob: src without rawFile', async () => {
    const value = { fileData: { src: 'blob:https://app/1' } };
    const result = await resolvePendingFiles(value);

    expect(mockReadAsDataURL).not.toHaveBeenCalled();
    expect(result).toEqual(value);
  });

  it('passes primitives, null, and dates through', async () => {
    const date = new Date('2026-01-01');
    expect(await resolvePendingFiles(null)).toBeNull();
    expect(await resolvePendingFiles(5)).toBe(5);
    expect(await resolvePendingFiles({ d: date })).toEqual({ d: date });
  });
});
