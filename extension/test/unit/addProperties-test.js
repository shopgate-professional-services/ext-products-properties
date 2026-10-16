const assert = require('assert')

const helpersPath = require.resolve('../../helpers')
const subjectPath = require.resolve('../../addProperties')

/**
 * The configured properties are cached in module scope, so every test needs a fresh copy.
 * @return {Function}
 */
const loadSubject = () => {
  delete require.cache[helpersPath]
  delete require.cache[subjectPath]
  return require(subjectPath)
}

const getProductsResult = () => ({
  products: [
    {
      id: '1',
      properties: [
        {
          label: 'added',
          value: 'added'
        },
        {
          label: 'ignored',
          value: 'ignored'
        },
        {
          label: 'foo',
          value: 'bar'
        }
      ]
    }
  ]
})

describe('addProperties', () => {
  it('should add properties if they are configured', async () => {
    const { products } = await loadSubject()({
      config: {
        addProperties: ['foo', 'added']
      }
    }, getProductsResult())
    assert.deepStrictEqual(products[0].additionalProperties, [
      {
        label: 'added',
        value: 'added'
      },
      {
        label: 'foo',
        value: 'bar'
      }
    ])
  })

  it('should add properties if they are configured - independent of the configured case', async () => {
    const { products } = await loadSubject()({
      config: {
        addProperties: ['foo', 'Added']
      }
    }, getProductsResult())
    assert.deepStrictEqual(products[0].additionalProperties, [
      {
        label: 'added',
        value: 'added'
      },
      {
        label: 'foo',
        value: 'bar'
      }
    ])
  })

  it('should add properties if they are configured - independent of the label case', async () => {
    const input = getProductsResult()
    input.products[0].properties[0].label = 'Added'

    const { products } = await loadSubject()({
      config: {
        addProperties: ['foo', 'added']
      }
    }, input)
    assert.deepStrictEqual(products[0].additionalProperties, [
      {
        label: 'Added',
        value: 'added'
      },
      {
        label: 'foo',
        value: 'bar'
      }
    ])
  })

  it('should add properties that start with a configured prefix', async () => {
    const input = getProductsResult()
    input.products[0].properties[2].label = 'myPrefix_foo'

    const { products } = await loadSubject()({
      config: {
        addPropertiesWithPrefix: ['myPrefix_']
      }
    }, input)
    assert.deepStrictEqual(products[0].additionalProperties, [
      {
        label: 'myPrefix_foo',
        value: 'bar'
      }
    ])
  })

  it('should not do anything if no property is matched', async () => {
    const { products } = await loadSubject()({
      config: {
        addProperties: ['nomatch', 'nonomatch']
      }
    }, getProductsResult())
    assert.deepStrictEqual({ products }, getProductsResult())
  })

  it('should not do anything if no property is configured to be added', async () => {
    const { products } = await loadSubject()({
      config: {
        addProperties: null
      }
    }, getProductsResult())
    assert.deepStrictEqual({ products }, getProductsResult())
  })
})
