const { buildAdditionalProperties, hasConfiguredAdditions } = require('./helpers')
const getOriginalProducts = require('./getOriginalProducts')

module.exports = async (context, input) => {
  const { config } = context
  const { cartItems } = input

  const { products } = await getOriginalProducts(context, input)

  if (!hasConfiguredAdditions(config)) {
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

    const additionalProperties = buildAdditionalProperties(config, product.properties, product.identifiers)

    if (additionalProperties.length) {
      cartItem.product = {
        ...cartItem.product,
        additionalProperties
      }
    }
  })

  return { cartItems }
}
