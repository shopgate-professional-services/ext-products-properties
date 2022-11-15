const getApiClient = require('./api/getApiClient')

const getChunksOfArray = (array, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * @param {Object} context
 * @param {{ productIds }} input
 * @returns {Promise<{products: Object[]}>}
 */
module.exports = async (context, { productIds }) => {
  const apiClient = getApiClient()
  const chunks = getChunksOfArray(productIds, 100)
  let collection = []

  const request = async (productIdsChunk) => {
    try {
      const { body: { collection: result = [] } } = await apiClient.request({
        service: 'product',
        version: 'v1',
        path: `${context.meta.appId.split('_')[1]}/products`,
        method: 'GET',
        query: {
          productNumbers: productIdsChunk.join(',')
        }
      })
  
      return result
    } catch (err) {
      context.log.warn(err, 'Error requesting bigapi for original products')
  
      return []
    }
  }

  for (let chunk of chunks) {
    const result = await request(chunk);
    collection = [...collection, ...result];
  }

  return { collection };

}
