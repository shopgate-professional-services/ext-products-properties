const { buildAdditionalProperties, hasConfiguredAdditions } = require('./helpers')
const getProductsByIds = require('./getProductsByIds.js')

module.exports = async (context, { products }) => {
  const { config } = context

  if (!hasConfiguredAdditions(config)) {
    return { products }
  }

  const productIds = products.map(p => p.id)

  const { collection } = await getProductsByIds(context, { productIds })

  products.forEach(product => {
    const originalProduct = collection.find(p => p.id === product.id)

    if (!originalProduct) {
      return
    }

    const additionalProperties = buildAdditionalProperties(
      config,
      originalProduct.properties,
      originalProduct.identifiers || product.identifiers
    )

    if (additionalProperties.length) {
      product.additionalProperties = additionalProperties
    }
  })

  return { products }
}
