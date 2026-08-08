import { darkTheme, lightTheme, resolveSemanticStyle } from './theme';

describe('semantic colour tokens', () => {
  it('defines the same roles in both appearances', () => {
    expect(Object.keys(darkTheme).sort()).toEqual(
      Object.keys(lightTheme).sort(),
    );
  });

  it('keeps brand distinct from primary in both appearances', () => {
    expect(lightTheme['--brand']).not.toBe(lightTheme['--primary']);
    expect(darkTheme['--brand']).not.toBe(darkTheme['--primary']);
  });
});

describe('resolveSemanticStyle', () => {
  it('maps bg/text/border utilities onto their token', () => {
    expect(resolveSemanticStyle('bg-canvas text-ink', lightTheme)).toEqual({
      backgroundColor: '#FFFFFF',
      color: '#101114',
    });
    expect(resolveSemanticStyle('border-primary', darkTheme)).toEqual({
      borderColor: '#94E8D1',
    });
  });

  it('resolves multi-word tokens rather than their prefix', () => {
    expect(resolveSemanticStyle('bg-surface-raised', darkTheme)).toEqual({
      backgroundColor: darkTheme['--surface-raised'],
    });
    expect(resolveSemanticStyle('text-on-primary', lightTheme)).toEqual({
      color: lightTheme['--on-primary'],
    });
  });

  it('ignores utilities that only look like colour roles', () => {
    expect(
      resolveSemanticStyle(
        'flex-1 text-base border-b px-3 rounded-xl',
        lightTheme,
      ),
    ).toBeUndefined();
  });

  it('leaves variant-prefixed utilities to the CSS layer', () => {
    expect(
      resolveSemanticStyle('active:bg-surface', lightTheme),
    ).toBeUndefined();
  });
});
