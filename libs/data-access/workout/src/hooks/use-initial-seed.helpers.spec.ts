import { isImagelessOrphan } from './use-initial-seed.helpers';

const ref = new Set<string>(['used']);

describe('isImagelessOrphan', () => {
  it('prunes an image-less seeded exercise nothing references', () => {
    expect(
      isImagelessOrphan(
        { id: 'x', isCustom: false, mediaFrames: [] },
        ref,
      ),
    ).toBe(true);
  });

  it('keeps exercises that still have images', () => {
    expect(
      isImagelessOrphan(
        { id: 'x', isCustom: false, mediaFrames: ['a.jpg'] },
        ref,
      ),
    ).toBe(false);
  });

  it('keeps image-less exercises referenced by a plan or workout', () => {
    expect(
      isImagelessOrphan(
        { id: 'used', isCustom: false, mediaFrames: [] },
        ref,
      ),
    ).toBe(false);
  });

  it('keeps custom exercises even without images', () => {
    expect(
      isImagelessOrphan(
        { id: 'x', isCustom: true, mediaFrames: [] },
        ref,
      ),
    ).toBe(false);
  });
});
