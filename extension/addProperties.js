const { getConfiguredProperties } = require('./helpers')

module.exports = async (context, input) => {
  const { config } = context
  let { products } = input

  const {addProperties, addPropertiesWithPrefix } = getConfiguredProperties(config);

  if (addProperties.length === 0 && addPropertiesWithPrefix.length === 0) return { products }

  products = products.map(product => {
    const additionalProperties = product.properties.filter(prop =>
      addProperties.includes(prop.label.toLowerCase()) || prop.label.toLowerCase().includes(addPropertiesWithPrefix)
    )

    if (additionalProperties.length) {
      return Object.assign(product, { additionalProperties })
    }

    return product
  })

  return { products }
}
