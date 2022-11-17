const { getConfiguredProperties } = require('./helpers')
const getOriginalProducts = require('./getOriginalProducts')

module.exports = async (context, input) => {
  const { config } = context
  const { cartItems } = input

  const { products } = await getOriginalProducts(context, input)

  const { addProperties, addPropertiesWithPrefix } = getConfiguredProperties(config)
  if (addProperties.length === 0 && addPropertiesWithPrefix.length === 0) {
    return { cartItems }
  }

  cartItems.forEach(cartItem => {
    if (cartItem.type !== 'product') {
      return
    }
    const product = products.find(p => p.id === cartItem.product.id)
    if (!product) {
      return
    }

    const additionalProperties = product.properties.filter(prop => {
      const label = prop.label.toLowerCase();
      return addProperties.includes(label) || addPropertiesWithPrefix.map(propWithPrefix => label.includes(propWithPrefix)).includes(true)
    })

    if (additionalProperties.length) {
      cartItem.product = {
        ...cartItem.product,
        additionalProperties
      }
    }
  })

  return { cartItems }
}
