/* eslint-disable no-use-before-define */
import slugify from 'limax';

import { SITE, APP_BLOG } from 'astrowind:config';

import { trim } from '~/utils/utils';

export const trimSlash = (s: string) => trim(trim(s, '/'));
const createPath = (...params: string[]) => {
  const paths = params
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');
  return '/' + paths + (SITE.trailingSlash && paths ? '/' : '');
};

const BASE_PATHNAME = SITE.base || '/';

export const cleanSlug = (text = '') =>
  trimSlash(text)
    .split('/')
    .map((slug) => slugify(slug))
    .join('/');

export const BLOG_BASE = cleanSlug(APP_BLOG?.list?.pathname);
export const CATEGORY_BASE = cleanSlug(APP_BLOG?.category?.pathname);
export const TAG_BASE = cleanSlug(APP_BLOG?.tag?.pathname) || 'tag';

export const POST_PERMALINK_PATTERN = trimSlash(APP_BLOG?.post?.permalink || `${BLOG_BASE}/%slug%`);

/** */
export const getCanonical = (path = ''): string | URL => {
  const url = String(new URL(path, SITE.site));
  if (SITE.trailingSlash == false && path && url.endsWith('/')) {
    return url.slice(0, -1);
  } else if (SITE.trailingSlash == true && path && !url.endsWith('/')) {
    return url + '/';
  }
  return url;
};

const isExternalLink = (slug: string): boolean => {
  return (
    slug.startsWith('https://') ||
    slug.startsWith('http://') ||
    slug.startsWith('://') ||
    slug.startsWith('#') ||
    slug.startsWith('javascript:')
  );
};

const definitivePermalink = (permalink: string): string => createPath(BASE_PATHNAME, permalink);

export const getAsset = (path: string): string =>
  '/' +
  [BASE_PATHNAME, path]
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');

export const getBlogPermalink = (): string => getPermalink(BLOG_BASE);

export const getHomePermalink = (): string => getPermalink('/');

export const getPermalink = (slug = '', type = 'page'): string => {
  if (isExternalLink(slug)) return slug;

  const permalink = generatePermalink(slug, type);
  return definitivePermalink(permalink);
};

const generatePermalink = (slug: string, type: string): string => {
  switch (type) {
    case 'home':
      return getHomePermalink();
    case 'blog':
      return getBlogPermalink();
    case 'asset':
      return getAsset(slug);
    case 'category':
      return createPath(CATEGORY_BASE, trimSlash(slug));
    case 'tag':
      return createPath(TAG_BASE, trimSlash(slug));
    case 'post':
      return createPath(trimSlash(slug));
    case 'page':
    default:
      return createPath(slug);
  }
};
