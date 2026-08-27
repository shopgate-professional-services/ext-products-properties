const assert = require('assert')

const helpersPath = require.resolve('../../helpers')

/**
 * The configured properties are cached in module scope, so every test needs a fresh copy.
 * @return {Object}
 */
const loadHelpers = () => {
  delete require.cache[helpersPath]
  return require(helpersPath)
}

describe('helpers', () => {
  const stubConfig = {
    addProperties: [
      'Weight',
      'Width',
      'Height',
      'ISBN'
    ],
    productsProperties: [
      {
        target: ['product-item.name.after'],
        properties: ['ISBN']
      },
      {
        target: ['product.priceInfo.after'],
        properties: ['Bonus points']
      },
      {
        target: ['product.name.after'],
        properties: ['Long name', 'Abbr. name']
      }
    ]
  }

  it('should get properties list', () => {
    const props = loadHelpers().getConfiguredProperties(stubConfig)
    assert.deepStrictEqual(props, {
      addProperties: [
        'weight',
        'width',
        'height',
        'isbn',
        'bonus points',
        'long name',
        'abbr. name'
      ],
      addPropertiesWithPrefix: []
    })
  })

  it('should get properties list with prefixes', () => {
    const props = loadHelpers().getConfiguredProperties({
      ...stubConfig,
      addPropertiesWithPrefix: ['swatchImage~']
    })
    assert.deepStrictEqual(props.addPropertiesWithPrefix, ['swatchimage~'])
  })

  it('should ignore a config entry without properties', () => {
    const props = loadHelpers().getConfiguredProperties({
      addProperties: ['ISBN'],
      productsProperties: [
        {
          target: ['product.name.after'],
          include_values: ['Important hint']
        },
        {
          target: ['product-item.name.after'],
          properties: ['Bonus points']
        }
      ]
    })
    assert.deepStrictEqual(props.addProperties, ['isbn', 'bonus points'])
  })
})
