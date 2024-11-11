const initAssetPreload = () => {
  // Keep track of loaded assets and their status
  const loadedAssets = new Map();

  // Helper to create a promise for each asset type
  const createLoader = (url, type) => {
    return new Promise((resolve, reject) => {
      if (type === 'mp4') {
        const video = document.createElement('video');
        video.preload = 'auto';
        video.src = url;
        video.onloadeddata = () => resolve(url);
        video.onerror = () => reject(`Failed to load video: ${url}`);
      } else {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(url);
        img.onerror = () => reject(`Failed to load image: ${url}`);
      }
    });
  };

  // Main preload function
  const preloadAsset = async (url) => {
    // Skip if already loaded or loading
    if (loadedAssets.has(url)) {
      return loadedAssets.get(url);
    }

    const fileExtension = url.split('.').pop().toLowerCase();

    // Create and store the loading promise
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

  // Batch preload multiple assets
  const preloadAssets = async (urls, { concurrent = 3 } = {}) => {
    const results = [];

    // Process URLs in chunks to control concurrency
    for (let i = 0; i < urls.length; i += concurrent) {
      const chunk = urls.slice(i, i + concurrent);
      const chunkPromises = chunk.map((url) =>
        preloadAsset(url)
          .then((result) => ({ status: 'success', url, result }))
          .catch((error) => ({ status: 'error', url, error }))
      );

      results.push(...(await Promise.all(chunkPromises)));
    }

    return results;
  };

  // Find all assets in public/posts directory
  const findAssets = async () => {
    try {
      // You'll need to implement this based on your Astro setup
      // This is just a placeholder example
      const assetFiles = await import.meta.glob('/public/posts/**/*.{webp,png,mp4}');
      return Object.keys(assetFiles).map((path) => path.replace('/public', ''));
    } catch (error) {
      console.error('Error finding assets:', error);
      return [];
    }
  };

  // Initialize preloading
  const init = async () => {
    try {
      const assets = await findAssets();
      console.log(`Found ${assets.length} assets to preload`);

      const results = await preloadAssets(assets);

      const summary = {
        total: results.length,
        successful: results.filter((r) => r.status === 'success').length,
        failed: results.filter((r) => r.status === 'error').length,
      };

      console.log('Preload complete:', summary);
      return results;
    } catch (error) {
      console.error('Preload initialization failed:', error);
      throw error;
    }
  };

  return {
    init,
    preloadAsset,
    preloadAssets,
    getLoadedAssets: () => Array.from(loadedAssets.entries()),
  };
};

export default initAssetPreload;
