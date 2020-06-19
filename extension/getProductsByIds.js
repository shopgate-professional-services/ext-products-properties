const getApiClient = require('./api/getApiClient')

/**
 * @param {Object} context
 * @param {{ productIds }} input
 * @returns {Promise<{products: Object[]}>}
 */
module.exports = async (context, { productIds }) => {
  const apiClient = getApiClient(context)

  try {
    const { body: { collection = [] } } = await apiClient.request({
      service: 'product',
      version: 'v1',
      path: `${context.meta.appId.split('_')[1]}/products`,
      method: 'GET',
      query: {
        productNumbers: productIds.join(',')
      }
    })

    return { collection }
  } catch (err) {
    context.log.warn(err, 'Error requesting bigapi for original products')

    return { collection: [] }
  }
}
