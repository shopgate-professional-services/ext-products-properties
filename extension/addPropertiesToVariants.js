const { getConfiguredProperties } = require('./helpers')
const getProductsByIds = require('./getProductsByIds.js')

module.exports = async (context, { products }) => {
  const { config } = context

  const { addProperties, addPropertiesWithPrefix } = getConfiguredProperties(config)

  if (addProperties.length === 0 && addPropertiesWithPrefix.length === 0) {
    return { products }
  }

  const productIds = products.map(p => p.id)

  const { collection } = await getProductsByIds(context, { productIds })

  products.forEach(product => {
    const originalProduct = collection.find(p => p.id === product.id)
    if (!originalProduct) {
      return
    }

    const additionalProperties = originalProduct.properties.filter(prop => 
      addProperties.includes(prop.label.toLowerCase()) || prop.label.toLowerCase().includes(addPropertiesWithPrefix)
    )

    if (additionalProperties.length) {
      product.additionalProperties = additionalProperties
    }
  })

  return { products }
}
