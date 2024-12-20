import { getImage } from 'astro:assets';
import { transformUrl, parseUrl } from 'unpic';
import { getStyle } from './get-image-style';

import type { ImageMetadata } from 'astro';
import type { HTMLAttributes } from 'astro/types';

type Layout = 'fixed' | 'constrained' | 'fullWidth' | 'cover' | 'responsive' | 'contained';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AttributesProps extends HTMLAttributes<'img'> {}

export interface ImageProps extends Omit<HTMLAttributes<'img'>, 'src'> {
  src?: string | ImageMetadata | null;
  width?: string | number | null;
  height?: string | number | null;
  alt?: string | null;
  loading?: 'eager' | 'lazy' | null;
  decoding?: 'sync' | 'async' | 'auto' | null;
  style?: string;
  srcset?: string | null;
  sizes?: string | null;
  fetchpriority?: 'high' | 'low' | 'auto' | null;
  layout?: Layout;
  widths?: number[] | null;
  aspectRatio?: string | number | null;
}

export type ImagesOptimizer = (
  imageInput: ImageMetadata | string,
  breakpointsList: number[],
  widthInput?: number,
  heightInput?: number
) => Promise<Array<{ src: string; width: number }>>;

const ImageSizes = {
  THUMBNAIL: 16,
  EXTRA_SMALL: 32,
  SMALL: 48,
  MEDIUM: 64,
  LARGE: 96,
  EXTRA_LARGE: 128,
  HERO: 256,
  FULL_WIDTH: 384,
};

const DeviceSizes = {
  MOBILE_SMALL: 640, // Older and lower-end phones
  IPHONE_6_8: 750, // iPhone 6-8
  IPHONE_XR_11: 828, // iPhone XR/11
  MOBILE_HORIZONTAL: 960, // Older horizontal phones
  IPHONE_PLUS: 1080, // iPhone 6-8 Plus
  HD_720P: 1280, // 720p
  IPAD_STANDARD: 1668, // Various iPads
  FULL_HD: 1920, // 1080p
  QXGA: 2048, // Quad Extended Graphics Array
  WQXGA: 2560, // Wide Quad Extended Graphics Array
  QHD_PLUS: 3200, // Quad High Definition Plus
  FOUR_K: 3840, // 4K Resolution
  FOUR_POINT_FIVE_K: 4480, // 4.5K Resolution
  FIVE_K: 5120, // 5K Resolution
  SIX_K: 6016, // 6K Resolution
};

const ImageFormats = {
  WEBP: 'image/webp',
};

const config = {
  imageSizes: Object.values(ImageSizes),
  deviceSizes: Object.values(DeviceSizes),
  formats: [ImageFormats.WEBP],
};

const computeHeight = (width: number, aspectRatio: number) => {
  return Math.floor(width / aspectRatio);
};

const parseAspectRatio = (aspectRatio: number | string | null | undefined): number | undefined => {
  if (typeof aspectRatio === 'number') {
    return aspectRatio;
  }

  if (typeof aspectRatio !== 'string') {
    return undefined;
  }

  const ratioResult = parseRatioString(aspectRatio);
  if (ratioResult !== undefined) {
    return ratioResult;
  }

  const numericValue = parseNumericValue(aspectRatio);
  if (numericValue !== undefined) {
    return numericValue;
  }

  return undefined;
};

const parseRatioString = (aspectRatio: string): number | undefined => {
  const match = aspectRatio.match(/(\d+)\s*[/:]\s*(\d+)/);
  if (!match) {
    return undefined;
  }

  const num = Number(match[1]);
  const den = Number(match[2]);

  return den && !isNaN(num) ? num / den : undefined;
};

const parseNumericValue = (aspectRatio: string): number | undefined => {
  const numericValue = parseFloat(aspectRatio);
  return !isNaN(numericValue) ? numericValue : undefined;
};

export const getSizes = (width?: number, layout?: Layout): string | undefined => {
  if (!width || !layout) {
    return undefined;
  }
  switch (layout) {
    case `constrained`:
      return `(min-width: ${width}px) ${width}px, 100vw`;

    case `fixed`:
      return `${width}px`;

    case `fullWidth`:
      return `100vw`;

    default:
      return undefined;
  }
};

const getBreakpoints = ({
  width,
  breakpoints,
  layout,
}: {
  width?: number;
  breakpoints?: number[];
  layout: Layout;
}): number[] => {
  if (layout === 'fullWidth' || layout === 'cover' || layout === 'responsive' || layout === 'contained') {
    return breakpoints || config.deviceSizes;
  }
  if (!width) {
    return [];
  }
  const DOUBLE_WIDTH_MULTIPLIER = 2;
  const doubleWidth = width * DOUBLE_WIDTH_MULTIPLIER;
  if (layout === 'fixed') {
    return [width, doubleWidth];
  }
  if (layout === 'constrained') {
    return [width, doubleWidth, ...(breakpoints || config.deviceSizes).filter((w) => w < doubleWidth)];
  }

  return [];
};

export const astroAssetsOptimizer: ImagesOptimizer = async (imageInput, breakpointsList) => {
  if (!imageInput) {
    return [];
  }

  return Promise.all(
    breakpointsList.map(async (w: number) => {
      const url = (await getImage({ src: imageInput, width: w, inferSize: true })).src;
      return {
        src: url,
        width: w,
      };
    })
  );
};

export const isUnPicCompatible = (image: string) => {
  return typeof parseUrl(image) !== 'undefined';
};

export const unPicOptimizer: ImagesOptimizer = async (image, breakpoints, width, height) => {
  if (!image || typeof image !== 'string') {
    return [];
  }

  const urlParsed = parseUrl(image);
  if (!urlParsed) {
    return [];
  }

  return Promise.all(
    breakpoints.map(async (w: number) => {
      const url =
        transformUrl({
          url: image,
          width: w,
          height: width && height ? computeHeight(w, width / height) : height,
          cdn: urlParsed.cdn,
        }) || image;
      return {
        src: String(url),
        width: w,
      };
    })
  );
};

const calculateDimensionsForNonString = (image, width, height) => {
  width ||= Number(image.width) || undefined;
  height ||= typeof width === 'number' ? computeHeight(width, image.width / image.height) : undefined;
  return { width, height };
};

// eslint-disable-next-line complexity
const calculateDimensionsFromAspectRatio = (width, height, aspectRatio, layout) => {
  if (aspectRatio && !width && !height && layout !== 'fullWidth') {
    throw new Error('When aspectRatio is set, either width or height must also be set');
  }

  if (!aspectRatio && !width && !height && layout !== 'fullWidth') {
    throw new Error('Either aspectRatio or both width and height must be set');
  }

  if (aspectRatio && width) {
    height ||= width / aspectRatio;
  }

  if (aspectRatio && height && !width) {
    width = Number(height * aspectRatio);
  }

  if (!aspectRatio && width && height) {
    aspectRatio = width / height;
  }

  return { width, height, aspectRatio };
};

const calculateDimensions = (image, width, height, aspectRatio, layout) => {
  if (typeof image !== 'string') {
    ({ width, height } = calculateDimensionsForNonString(image, width, height));
  }

  width = (width && Number(width)) || undefined;
  height = (height && Number(height)) || undefined;

  return calculateDimensionsFromAspectRatio(width, height, aspectRatio, layout);
};

const getBreakpointsAndSrcset = async (image, breakpoints, width, height, transform) => {
  const uniqueBreakpoints = [...new Set(breakpoints)].sort((a, b) => a - b);
  return (await transform(image, uniqueBreakpoints, Number(width) || undefined, Number(height) || undefined))
    .map(({ src, width }) => `${src} ${width}w`)
    .join(', ');
};

const processImageProperties = (image, options) => {
  const { width, height, aspectRatio, layout = 'constrained', widths, sizes } = options;

  const {
    width: finalWidth,
    height: finalHeight,
    aspectRatio: finalAspectRatio,
  } = calculateDimensions(image, width, height, parseAspectRatio(aspectRatio), layout);

  const finalWidths = widths || config.deviceSizes;
  const finalSizes = sizes || getSizes(Number(finalWidth) || undefined, layout);

  return { finalWidth, finalHeight, finalAspectRatio, finalWidths, finalSizes };
};

export async function getImagesOptimized(image, options, transform = () => Promise.resolve([])) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { src, style = '', ...rest } = options;
  const { finalWidth, finalHeight, finalAspectRatio, finalWidths, finalSizes } = processImageProperties(image, options);

  const breakpoints = getBreakpoints({ width: finalWidth, breakpoints: finalWidths, layout: options.layout });
  const srcset = await getBreakpointsAndSrcset(image, breakpoints, finalWidth, finalHeight, transform);

  return {
    src: typeof image === 'string' ? image : image.src,
    attributes: {
      width: finalWidth,
      height: finalHeight,
      srcset: srcset || undefined,
      sizes: finalSizes,
      style: `${getStyle({
        width: finalWidth,
        height: finalHeight,
        aspectRatio: finalAspectRatio,
        layout: options.layout,
      })}${style ?? ''}`,
      ...rest,
    },
  };
}
