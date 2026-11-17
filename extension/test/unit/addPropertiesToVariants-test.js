const assert = require('assert')

const helpersPath = require.resolve('../../helpers')
const getProductsByIdsPath = require.resolve('../../getProductsByIds.js')
const subjectPath = require.resolve('../../addPropertiesToVariants')

let requestCount = 0

/**
 * Loads the step with a fresh helpers module and a stubbed product request, so that no API client
 * and no config.json are needed.
 * @param {Object[]} fetchedProducts The products the stubbed request returns.
 * @return {Function}
 */
const loadSubject = (fetchedProducts = []) => {
  requestCount = 0
  require.cache[getProductsByIdsPath] = {
    id: getProductsByIdsPath,
    filename: getProductsByIdsPath,
    loaded: true,
    exports: async () => {
      requestCount++
      return { collection: fetchedProducts }
    }
  }

  delete require.cache[helpersPath]
  delete require.cache[subjectPath]
  return require(subjectPath)
}

describe('addPropertiesToVariants', () => {
  after(() => {
    delete require.cache[getProductsByIdsPath]
  })

  it('should add the fetched properties and the identifiers of the variant input', async () => {
    const { products } = await loadSubject([{
      id: 'v1',
      properties: [{ label: 'Color', value: 'black' }],
      identifiers: { sku: 'from-product-service' }
    }])(
      {
        config: {
          addProperties: ['color'],
          addIdentifiers: { sku: 'Artikel-Nr.' }
        }
      },
      { products: [{ id: 'v1', identifiers: { sku: '740598' } }] }
    )
    assert.strictEqual(requestCount, 1)
    assert.deepStrictEqual(products[0].additionalProperties, [
      { label: 'Color', value: 'black' },
      { label: 'Artikel-Nr.', value: '740598' }
    ])
  })

  it('should add the identifiers when the product service does not return the variant', async () => {
    const { products } = await loadSubject([])(
      {
        config: {
          addProperties: ['color'],
          addIdentifiers: { sku: 'Artikel-Nr.' }
        }
      },
      { products: [{ id: 'v1', identifiers: { sku: '740599' } }] }
    )
    assert.deepStrictEqual(products[0].additionalProperties, [
      { label: 'Artikel-Nr.', value: '740599' }
    ])
  })

  it('should not request products if only identifiers are configured', async () => {
    const { products } = await loadSubject()(
      {
        config: {
          addIdentifiers: { sku: 'Artikel-Nr.' }
        }
      },
      { products: [{ id: 'v1', identifiers: { sku: '740600' } }] }
    )
    assert.strictEqual(requestCount, 0)
    assert.deepStrictEqual(products[0].additionalProperties, [
      { label: 'Artikel-Nr.', value: '740600' }
    ])
  })

  it('should not request products if nothing is configured', async () => {
    const input = { products: [{ id: 'v1' }] }
    const { products } = await loadSubject()({ config: {} }, input)
    assert.strictEqual(requestCount, 0)
    assert.deepStrictEqual(products, [{ id: 'v1' }])
  })
})
