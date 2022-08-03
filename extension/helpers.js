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

    configuredProperties = filterData(tempProperties);
    
    if (addPropertiesWithPrefix) {
      configuredPropertiesWithPrefix = filterData(addPropertiesWithPrefix);
    }
  }
  return {
    "addProperties": configuredProperties,
    "addPropertiesWithPrefix": configuredPropertiesWithPrefix
  }
}
