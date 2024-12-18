type StyleParams = {
  width?: number;
  height?: number;
  aspectRatio?: number;
  objectFit?: string;
  objectPosition?: string;
  layout?: string;
  background?: string;
};

const LAYOUT_CONFIGS = {
  fixed: (params: StyleParams) => ({
    width: `${params.width}px`,
    height: `${params.height}px`,
    'object-position': 'top left',
  }),
  constrained: (params: StyleParams) => ({
    'max-width': `${params.width}px`,
    'max-height': `${params.height}px`,
    'aspect-ratio': params.aspectRatio?.toString(),
    width: '100%',
  }),
  fullWidth: (params: StyleParams) => ({
    width: '100%',
    'aspect-ratio': params.aspectRatio?.toString(),
    height: `${params.height}px`,
  }),
  responsive: (params: StyleParams) => ({
    width: '100%',
    height: 'auto',
    'aspect-ratio': params.aspectRatio?.toString(),
  }),
  contained: (params: StyleParams) => ({
    'max-width': '100%',
    'max-height': '100%',
    'object-fit': 'contain',
    'aspect-ratio': params.aspectRatio?.toString(),
  }),
  cover: () => ({
    'max-width': '100%',
    'max-height': '100%',
  }),
};

export const getStyle = ({
  width,
  height,
  aspectRatio,
  layout = 'responsive',
  objectFit = 'cover',
  objectPosition = 'center',
  background,
}: StyleParams): string => {
  let backgroundStyles = {};
  if (background?.match(/^(https?:|data:)/)) {
    backgroundStyles = {
      'background-image': `url(${background})`,
      'background-size': 'cover',
      'background-repeat': 'no-repeat',
    };
  } else if (background) {
    backgroundStyles = { background };
  }

  const baseStyles = {
    'object-fit': objectFit,
    'object-position': objectPosition,
    ...backgroundStyles,
    ...(LAYOUT_CONFIGS[layout as keyof typeof LAYOUT_CONFIGS] || {})({ width, height, aspectRatio }),
  };

  return Object.entries(baseStyles)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ');
};
