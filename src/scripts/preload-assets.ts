const CONCURRENT_REQUESTS = 3;

const createLoader = (url, type) => (type === 'mp4' ? createVideoLoader(url) : createImageLoader(url));

const createVideoLoader = (url) =>
  new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.src = url;
    video.onloadeddata = () => resolve(url);
    video.onerror = () => reject(`Failed to load video: ${url}`);
  });

const createImageLoader = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(url);
    img.onerror = () => reject(`Failed to load image: ${url}`);
  });

const getFileExtension = (url) => url.split('.').pop().toLowerCase();

const handleAssetLoading = async (url, fileExtension, loadedAssets) => {
  const loadingPromise = createLoader(url, fileExtension)
    .then((loadedUrl) => {
      loadedAssets.set(url, { status: 'loaded', url: loadedUrl });
      return loadedUrl;
    })
    .catch((error) => {
      loadedAssets.set(url, { status: 'error', error });
      throw error;
    });

  loadedAssets.set(url, { status: 'loading', promise: loadingPromise });
  return loadingPromise;
};

const preloadAsset = async (url, loadedAssets) => {
  if (loadedAssets.has(url)) return loadedAssets.get(url);

  const fileExtension = getFileExtension(url);
  return handleAssetLoading(url, fileExtension, loadedAssets);
};

const processAssetsInChunks = async (urls, concurrent, loadedAssets) => {
  const results = [];
  for (let i = 0; i < urls.length; i += concurrent) {
    const chunk = urls.slice(i, i + concurrent);
    const chunkResults = await Promise.all(
      chunk.map((url) =>
        preloadAsset(url, loadedAssets)
          .then((result) => ({ status: 'success', url, result }))
          .catch((error) => ({ status: 'error', url, error }))
      )
    );
    results.push(...chunkResults);
  }
  return results;
};

const findAssets = async () => {
  try {
    const assetFiles = await import.meta.glob('/public/posts/**/*.{webp,png,mp4}');
    return Object.keys(assetFiles).map((path) => path.replace('/public', ''));
  } catch (error) {
    console.error('Error finding assets:', error);
    return [];
  }
};

const getResultsSummary = (results) => ({
  total: results.length,
  successful: results.filter((r) => r.status === 'success').length,
  failed: results.filter((r) => r.status === 'error').length,
});

const initAssetPreload = () => {
  const loadedAssets = new Map();

  const preloadAssets = (urls, options = {}) => {
    const { concurrent = CONCURRENT_REQUESTS } = options;
    return processAssetsInChunks(urls, concurrent, loadedAssets);
  };

  const init = async () => {
    try {
      const assets = await findAssets();
      console.log(`Found ${assets.length} assets to preload`);
      const results = await preloadAssets(assets);
      const summary = getResultsSummary(results);
      console.log('Preload complete:', summary);
      return results;
    } catch (error) {
      console.error('Preload initialization failed:', error);
      throw error;
    }
  };

  return {
    init,
    preloadAsset: (url) => preloadAsset(url, loadedAssets),
    preloadAssets,
    getLoadedAssets: () => Array.from(loadedAssets.entries()),
  };
};

export default initAssetPreload;
