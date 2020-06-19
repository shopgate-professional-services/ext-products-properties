module.exports = async (context, input) => {
  const { config } = context
  const { products } = input

  const addProperties = config.addProperties.split(',')
    .filter(val => val) // remove empty values
    .map(val => val.toLowerCase())

  if (addProperties.length === 0 || products.length === 0) return

  const product = products[0]

  return { additionalProperties: product.additionalProperties }
}
