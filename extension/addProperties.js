module.exports = async (context, input) => {
  const { config } = context
  let { products } = input

  const addProperties = config.addProperties.split(',').filter(val => val).map(val => val.toLowerCase())

  if (addProperties.length === 0) return { products }

  products = products.map(product => {
    const additionalProperties = product.properties.filter(prop =>
      addProperties.includes(prop.label.toLowerCase())
    )

    if (additionalProperties.length) { return Object.assign(product, { additionalProperties }) }

    return product
  })

  return { products }
}
