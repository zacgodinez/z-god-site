import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import type { OpenGraph, OpenGraphMedia } from '@astrolib/seo';

const load = async function () {
  let images: Record<string, () => Promise<unknown>> | undefined = undefined;
  try {
    images = import.meta.glob('~/assets/images/**/*.{jpeg,jpg,png,tiff,webp,gif,svg,JPEG,JPG,PNG,TIFF,WEBP,GIF,SVG}');
  } catch (e) {
    console.error(e);
  }
  return images;
};

let _images: Record<string, () => Promise<unknown>> | undefined = undefined;

export const fetchLocalImages = async () => {
  _images = _images || (await load());
  return _images;
};

export const findImage = async (
  imagePath?: string | ImageMetadata | null
): Promise<string | ImageMetadata | undefined | null> => {
  if (typeof imagePath !== 'string') {
    return imagePath;
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('/')) {
    return imagePath;
  }

  if (!imagePath.startsWith('~/assets/images')) {
    return imagePath;
  }

  const images = await fetchLocalImages();
  const key = imagePath.replace('~/', '/src/');

  return images && typeof images[key] === 'function'
    ? ((await images[key]()) as { default: ImageMetadata })['default']
    : null;
};

export const adaptOpenGraphImages = async (
  openGraph: OpenGraph = {},
  astroSite: URL | undefined = new URL('')
): Promise<OpenGraph> => {
  if (!openGraph?.images?.length) {
    return openGraph;
  }

  const adaptedImages = await processOpenGraphImages([...openGraph.images], astroSite);

  return {
    ...openGraph,
    images: adaptedImages.length ? adaptedImages : undefined,
  };
};

const processOpenGraphImages = async (
  images: OpenGraphMedia[],
  astroSite: URL | undefined
): Promise<OpenGraphMedia[]> => {
  const DEFAULT_WIDTH = 1200;
  const DEFAULT_HEIGHT = 626;

  return Promise.all(
    images.map(async (image) => {
      if (!image?.url) {
        return { url: '' };
      }

      const resolvedImage = await findImage(image.url);

      if (!resolvedImage || typeof resolvedImage === 'string') {
        return { url: '' };
      }

      return await createAdaptedImage(resolvedImage, image, astroSite, DEFAULT_WIDTH, DEFAULT_HEIGHT);
    })
  ).then((images) => images.filter((image) => image.url !== ''));
};

const createAdaptedImage = async (
  resolvedImage: ImageMetadata,
  originalImage: OpenGraphMedia,
  astroSite: URL | undefined,
  defaultWidth: number,
  defaultHeight: number
): Promise<OpenGraphMedia> => {
  const processedImage = await getImage({
    src: resolvedImage,
    alt: 'Placeholder alt',
    width: originalImage?.width || defaultWidth,
    height: originalImage?.height || defaultHeight,
  });

  if (typeof processedImage !== 'object') {
    return { url: '' };
  }

  return {
    url: generateImageUrl(processedImage, astroSite),
    width: extractImageDimension(processedImage, 'width'),
    height: extractImageDimension(processedImage, 'height'),
  };
};

const generateImageUrl = (
  image: ReturnType<typeof getImage> extends Promise<infer R> ? R : never,
  astroSite: URL | undefined
): string => {
  return typeof image.src === 'string' ? String(new URL(image.src, astroSite)) : '';
};

const extractImageDimension = (
  image: ReturnType<typeof getImage> extends Promise<infer R> ? R : never,
  dimension: 'width' | 'height'
): number | undefined => {
  return dimension in image && typeof image[dimension] === 'number' ? (image[dimension] as number) : undefined;
};
