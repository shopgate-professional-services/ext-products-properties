const getProductsByIds = require('./getProductsByIds')

/**
 * @param {Object} context
 * @param {{ cartItems }} input
 * @returns {Promise<{products: Object[]}>}
 */
module.exports = async (context, { cartItems: inputCartItems }) => {
  const cartProducts = inputCartItems.filter(cartItem => cartItem.type === 'product')

  let products = cartProducts
    .filter(cartItem => !!cartItem.product.shopItem)
    .map(cartItem => cartItem.product.shopItem)

  const withoutShopItem = cartProducts.filter(cartItem => !cartItem.product.shopItem)
  if (withoutShopItem.length) {
    const productIds = withoutShopItem.map(cartItem => encodeURIComponent(cartItem.product.id))

    const { collection } = await getProductsByIds(context, { productIds })

    products = products.concat(collection)
  }

  return {
    products
  }
}
