const { buildAdditionalProperties, getConfiguredProperties, hasConfiguredAdditions } = require('./helpers')
const getProductsByIds = require('./getProductsByIds.js')

module.exports = async (context, { products }) => {
  const { config } = context

  if (!hasConfiguredAdditions(config)) {
    return { products }
  }

  // The variant properties come from the product service; identifiers are read from the mapped
  // step input, so a config with identifiers only needs no request.
  const { addProperties, addPropertiesWithPrefix } = getConfiguredProperties(config)
  let collection = []
  if (addProperties.length || addPropertiesWithPrefix.length) {
    ({ collection } = await getProductsByIds(context, { productIds: products.map(p => p.id) }))
  }

  products.forEach(product => {
    const originalProduct = collection.find(p => p.id === product.id)

    const additionalProperties = buildAdditionalProperties(
      config,
      originalProduct ? originalProduct.properties : [],
      product.identifiers
    )

    if (additionalProperties.length) {
      product.additionalProperties = additionalProperties
    }
  })

  return { products }
}
