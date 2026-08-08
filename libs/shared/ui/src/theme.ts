const COLOR_PROPS = {
  bg: 'backgroundColor',
  text: 'color',
  border: 'borderColor',
} as const;

/**
 * Resolves `bg-*`/`text-*`/`border-*` utilities whose suffix names a semantic
 * colour role below. Anything else — `text-base`, `border-b`, or a variant-
 * prefixed `active:bg-surface` — has no matching role and is left to the CSS
 * layer untouched.
 */
export function resolveSemanticStyle(
  className: string | undefined,
  theme: typeof lightTheme,
) {
  if (!className) return undefined;
  const style: Record<string, string> = {};

  for (const item of className.split(/\s+/)) {
    const separator = item.indexOf('-');
    const prop =
      COLOR_PROPS[item.slice(0, separator) as keyof typeof COLOR_PROPS];
    const color = theme[`--${item.slice(separator + 1)}` as keyof typeof theme];
    if (prop && color) style[prop] = color;
  }

  return Object.keys(style).length ? style : undefined;
}

export const lightTheme = {
  '--canvas': '#FFFFFF',
  '--surface': '#F2F3F5',
  '--surface-raised': '#FFFFFF',
  '--ink': '#101114',
  '--muted': '#62666D',
  '--outline': '#DFE1E5',
  '--primary': '#087E6C',
  '--on-primary': '#FFFFFF',
  '--coral': '#D72D4C',
  '--lime': '#237A3C',
  '--cyan': '#096FBD',
  '--recovery': '#7B3AB5',
  '--on-recovery': '#FFFFFF',
  '--success': '#167C4D',
  '--warning': '#9B5A00',
  '--danger': '#C82D48',
  '--brand': '#0E8F63',
  '--tile': '#FFFFFF',
  '--primary-soft': 'rgba(8,126,108,.10)',
  '--danger-soft': 'rgba(200,45,72,.09)',
  '--warning-soft': 'rgba(155,90,0,.10)',
  '--success-soft': 'rgba(22,124,77,.10)',
  '--placeholder': '#E4E6EA',
  '--placeholder-ink': '#B6BBC3',
};

export const darkTheme: Record<keyof typeof lightTheme, string> = {
  '--canvas': '#070A10',
  '--surface': '#151A22',
  '--surface-raised': '#1D232D',
  '--ink': '#F7F9FC',
  '--muted': '#AAB1BC',
  '--outline': '#343D4B',
  '--primary': '#94E8D1',
  '--on-primary': '#061E19',
  '--coral': '#FF3858',
  '--lime': '#38D16A',
  '--cyan': '#1689F8',
  '--recovery': '#B45CF2',
  '--on-recovery': '#180824',
  '--success': '#5DD895',
  '--warning': '#F3C558',
  '--danger': '#FF5C73',
  '--brand': '#2FD08A',
  '--tile': '#16181D',
  '--primary-soft': 'rgba(148,232,209,.13)',
  '--danger-soft': 'rgba(255,92,115,.13)',
  '--warning-soft': 'rgba(243,197,88,.13)',
  '--success-soft': 'rgba(93,216,149,.13)',
  '--placeholder': '#232A35',
  '--placeholder-ink': '#48525F',
};
