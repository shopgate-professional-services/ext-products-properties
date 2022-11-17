const { getConfiguredProperties } = require('./helpers')

module.exports = async (context, input) => {
  const { config } = context
  let { products } = input

  const { addProperties, addPropertiesWithPrefix } = getConfiguredProperties(config);

  if (addProperties.length === 0 && addPropertiesWithPrefix.length === 0) {
    return { products }
  }

  products = products.map(product => {
    const additionalProperties = product.properties.filter(prop => {
      const label = prop.label.toLowerCase();
      return addProperties.includes(label) || addPropertiesWithPrefix.map(propWithPrefix => label.includes(propWithPrefix)).includes(true)
    })

    if (additionalProperties.length) {
      return Object.assign(product, { additionalProperties })
    }

    return product
  })

  return { products }
}
