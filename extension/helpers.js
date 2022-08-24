let configuredProperties = null
let configuredPropertiesWithPrefix = null

const filterData = (data) => data
      .filter(Boolean)
      .filter((prop, i, arr) => arr.indexOf(prop) === i)
      .map(prop => prop.toLowerCase());

module.exports.getConfiguredProperties = (config) => {
  const { addProperties, productsProperties, addPropertiesWithPrefix } = config
  if (configuredProperties === null) {

    const tempProperties = []
    const tempPropertiesWithPrefix = []

    // Add backend properties
    if (addProperties) {
      tempProperties.push(...[].concat(addProperties))     
    }
    if (addPropertiesWithPrefix) {
      tempPropertiesWithPrefix.push(...[].concat(addPropertiesWithPrefix))     
    }
    // Add frontend properties
    if (productsProperties && productsProperties.length) {
      tempProperties.push(...productsProperties.reduce((acc, conf) => {
        acc.push(...conf.properties)
        return acc
      }, []))
    }

    configuredProperties = filterData(tempProperties);
    configuredPropertiesWithPrefix = filterData(tempPropertiesWithPrefix);
  }
  return {
    "addProperties": configuredProperties,
    "addPropertiesWithPrefix": configuredPropertiesWithPrefix
  }
}
