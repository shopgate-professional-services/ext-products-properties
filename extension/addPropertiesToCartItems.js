const getOriginalProducts = require('./getOriginalProducts')

module.exports = async (context, input) => {
  const { config } = context
  const { cartItems } = input

  const { products } = await getOriginalProducts(context, input)

  const addProperties = config
    .addProperties
    .split(',')
    .map(p => p.trim())
    .filter(Boolean)
    .map(val => val.toLowerCase())

  if (addProperties.length === 0) {
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

    const additionalProperties = product.properties.filter(prop =>
      addProperties.includes(prop.label.toLowerCase())
    )

    if (additionalProperties.length) {
      cartItem.product = {
        ...cartItem.product,
        additionalProperties
      }
    }
  })

  return { cartItems }
}
