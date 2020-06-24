let configuredProperties = null

module.exports.getConfiguredProperties = (config) => {
  if (configuredProperties === null) {
    const { addProperties, productsProperties } = config

    const tempProperties = []

    // Add backend properties
    if (addProperties) {
      tempProperties.push(...[].concat(addProperties))
    }

    // Add frontend properties
    if (productsProperties && productsProperties.length) {
      tempProperties.push(...productsProperties.reduce((acc, conf) => {
        acc.push(...conf.properties)
        return acc
      }, []))
    }

    configuredProperties = tempProperties
      .filter(Boolean)
      .filter((prop, i, arr) => arr.indexOf(prop) === i)
      .map(prop => prop.toLowerCase())
  }

  return configuredProperties
}
