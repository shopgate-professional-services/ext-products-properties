let configuredProperties = null
let configuredPropertiesWithPrefix = null

const filterData = (data) => data
  .filter(Boolean)
  .filter((prop, i, arr) => arr.indexOf(prop) === i)
  .map(prop => prop.toLowerCase())

module.exports.getConfiguredProperties = (config) => {
  const { addProperties, productsProperties, addPropertiesWithPrefix } = config

  // Add properties
  if (configuredProperties === null) {
    const tempProperties = []

    // Add backend properties
    if (addProperties) {
      tempProperties.push(...[].concat(addProperties))
    }
    // Add frontend properties
    if (productsProperties && productsProperties.length) {
      tempProperties.push(...productsProperties.reduce((acc, conf) => {
        acc.push(...(conf.properties || []))
        return acc
      }, []))
    }

    configuredProperties = filterData(tempProperties)
  }

  // Add properties with prefix
  if (configuredPropertiesWithPrefix === null) {
    const tempPropertiesWithPrefix = []

    // Add backend properties
    if (addPropertiesWithPrefix) {
      tempPropertiesWithPrefix.push(...[].concat(addPropertiesWithPrefix))
    }

    configuredPropertiesWithPrefix = filterData(tempPropertiesWithPrefix)
  }

  return {
    addProperties: configuredProperties,
    addPropertiesWithPrefix: configuredPropertiesWithPrefix
  }
}

/**
 * Reads the `addIdentifiers` setting, which maps product identifier keys to property labels,
 * e.g. `{ "sku": "Article no." }`. Entries without a label are ignored.
 * @param {Object} config The extension config.
 * @return {Array<{ key: string, label: string }>}
 */
const getConfiguredIdentifiers = (config) => {
  const { addIdentifiers } = config || {}

  if (!addIdentifiers || typeof addIdentifiers !== 'object' || Array.isArray(addIdentifiers)) {
    return []
  }

  return Object.keys(addIdentifiers)
    .filter(key => typeof addIdentifiers[key] === 'string' && addIdentifiers[key].trim() !== '')
    .map(key => ({ key, label: addIdentifiers[key] }))
}

module.exports.getConfiguredIdentifiers = getConfiguredIdentifiers

/**
 * Picks the configured properties of a product from its property list.
 * @param {Object[]} properties The product properties.
 * @param {{ addProperties: string[], addPropertiesWithPrefix: string[] }} configured The configured labels.
 * @return {Object[]}
 */
const pickProperties = (properties, { addProperties, addPropertiesWithPrefix }) => (properties || [])
  .filter(prop => {
    const label = prop.label.toLowerCase()
    return addProperties.includes(label) || addPropertiesWithPrefix.map(propWithPrefix => label.includes(propWithPrefix)).includes(true)
  })

/**
 * Builds the additional properties of a product: the configured properties from its property list,
 * followed by the configured identifiers as properties. An identifier is skipped when the product
 * has no value for it or when a property with the same label was already picked.
 * @param {Object} config The extension config.
 * @param {Object[]} properties The product properties.
 * @param {Object} identifiers The product identifiers, e.g. `{ sku: '123' }`.
 * @return {Object[]}
 */
module.exports.buildAdditionalProperties = (config, properties, identifiers) => {
  const additionalProperties = pickProperties(properties, module.exports.getConfiguredProperties(config))

  if (!identifiers || typeof identifiers !== 'object') {
    return additionalProperties
  }

  getConfiguredIdentifiers(config).forEach(({ key, label }) => {
    const value = identifiers[key]

    if (value === null || value === undefined || String(value).trim() === '') {
      return
    }

    const lowerLabel = label.toLowerCase()
    if (additionalProperties.some(prop => prop.label.toLowerCase() === lowerLabel)) {
      return
    }

    additionalProperties.push({ label, value: String(value) })
  })

  return additionalProperties
}

/**
 * @param {Object} config The extension config.
 * @return {boolean} Whether any property or identifier is configured to be added.
 */
module.exports.hasConfiguredAdditions = (config) => {
  const { addProperties, addPropertiesWithPrefix } = module.exports.getConfiguredProperties(config)
  return addProperties.length > 0 || addPropertiesWithPrefix.length > 0 || getConfiguredIdentifiers(config).length > 0
}
