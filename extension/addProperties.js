const { buildAdditionalProperties, hasConfiguredAdditions } = require('./helpers')

module.exports = async (context, input) => {
  const { config } = context
  let { products } = input

  if (!hasConfiguredAdditions(config)) {
    return { products }
  }

  products = products.map(product => {
    const additionalProperties = buildAdditionalProperties(config, product.properties, product.identifiers)

    if (additionalProperties.length) {
      return Object.assign(product, { additionalProperties })
    }

    return product
  })

  return { products }
}
