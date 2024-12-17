export const GET_APP_BLOG_DEFAULTS = {
  isEnabled: false,
  postsPerPage: 6,
  isRelatedPostsEnabled: false,
  relatedPostsCount: 4,
  post: {
    isEnabled: true,
    permalink: '/blog/%slug%',
    robots: {
      index: true,
      follow: true,
    },
  },
  list: {
    isEnabled: true,
    pathname: 'blog',
    robots: {
      index: true,
      follow: true,
    },
  },
  category: {
    isEnabled: true,
    pathname: 'category',
    robots: {
      index: true,
      follow: true,
    },
  },
  tag: {
    isEnabled: true,
    pathname: 'tag',
    robots: {
      index: false,
      follow: true,
    },
  },
};
