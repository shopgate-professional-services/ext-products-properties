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

  it('should get the configured identifiers', () => {
    const identifiers = loadHelpers().getConfiguredIdentifiers({
      addIdentifiers: { sku: 'Article no.', ean: 'EAN', mpn: '', upc: null }
    })
    assert.deepStrictEqual(identifiers, [
      { key: 'sku', label: 'Article no.' },
      { key: 'ean', label: 'EAN' }
    ])
  })

  it('should ignore an addIdentifiers setting that is no object', () => {
    const helpers = loadHelpers()
    assert.deepStrictEqual(helpers.getConfiguredIdentifiers({ addIdentifiers: ['sku'] }), [])
    assert.deepStrictEqual(helpers.getConfiguredIdentifiers({ addIdentifiers: 'sku' }), [])
    assert.deepStrictEqual(helpers.getConfiguredIdentifiers({ addIdentifiers: null }), [])
    assert.deepStrictEqual(helpers.getConfiguredIdentifiers({}), [])
  })

  it('should report configured additions for identifiers only', () => {
    assert.strictEqual(loadHelpers().hasConfiguredAdditions({ addIdentifiers: { sku: 'Article no.' } }), true)
    assert.strictEqual(loadHelpers().hasConfiguredAdditions({ addIdentifiers: null }), false)
  })

  it('should not add an identifier when a property with the same label was picked', () => {
    const additionalProperties = loadHelpers().buildAdditionalProperties(
      { addProperties: ['Article no.'], addIdentifiers: { sku: 'Article no.' } },
      [{ label: 'article no.', value: 'from property' }],
      { sku: 'from identifier' }
    )
    assert.deepStrictEqual(additionalProperties, [{ label: 'article no.', value: 'from property' }])
  })

  it('should skip identifiers without a value and stringify numbers', () => {
    const additionalProperties = loadHelpers().buildAdditionalProperties(
      { addIdentifiers: { sku: 'Article no.', ean: 'EAN', mpn: 'MPN' } },
      [],
      { sku: 12345, ean: '', mpn: null }
    )
    assert.deepStrictEqual(additionalProperties, [{ label: 'Article no.', value: '12345' }])
  })
})
