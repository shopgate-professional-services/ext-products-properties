const { getConfiguredProperties } = require('./helpers')

module.exports = async (context, input) => {
  const { config } = context
  const { products } = input

  const addProperties = getConfiguredProperties(config)
  if (addProperties.length === 0 || products.length === 0) {
    return
  }

  const product = products[0]

  return { additionalProperties: product.additionalProperties }
}
