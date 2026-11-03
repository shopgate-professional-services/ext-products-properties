const assert = require('assert')

const helpersPath = require.resolve('../../helpers')
const getOriginalProductsPath = require.resolve('../../getOriginalProducts')
const getProductsByIdsPath = require.resolve('../../getProductsByIds')
const subjectPath = require.resolve('../../addPropertiesToCartItems')

let requestedProductIds = []

/**
 * Loads the step with a fresh helpers module, since the configured properties are cached in module
 * scope, and with a stubbed product request, so that no API client and no config.json are needed.
 * @param {Object[]} fetchedProducts The products the stubbed request returns.
 * @return {Function}
 */
const loadSubject = (fetchedProducts = []) => {
  requestedProductIds = []

  require.cache[getProductsByIdsPath] = {
    id: getProductsByIdsPath,
    filename: getProductsByIdsPath,
    loaded: true,
    exports: async (context, { productIds }) => {
      requestedProductIds.push(...productIds)
      return { collection: fetchedProducts }
    }
  }

  delete require.cache[helpersPath]
  delete require.cache[getOriginalProductsPath]
  delete require.cache[subjectPath]
  return require(subjectPath)
}

const getProperties = () => [
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

const getCartResult = () => ({
  cartItems: [
    {
      type: 'product',
      product: {
        id: '1',
        shopItem: {
          id: '1',
          properties: getProperties()
        }
      }
    }
  ]
})

describe('addPropertiesToCartItems', () => {
  after(() => {
    delete require.cache[getProductsByIdsPath]
  })

  it('should add properties if they are configured', async () => {
    const { cartItems } = await loadSubject()(
      {
        config: {
          addProperties: ['foo', 'added']
        }
      },
      getCartResult()
    )
    assert.deepStrictEqual(cartItems[0].product.additionalProperties, [
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
    const { cartItems } = await loadSubject()(
      {
        config: {
          addProperties: ['foo', 'Added']
        }
      },
      getCartResult()
    )
    assert.deepStrictEqual(cartItems[0].product.additionalProperties, [
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
    const input = getCartResult()
    input.cartItems[0].product.shopItem.properties[0].label = 'Added'

    const { cartItems } = await loadSubject()(
      {
        config: {
          addProperties: ['foo', 'added']
        }
      },
      input
    )
    assert.deepStrictEqual(cartItems[0].product.additionalProperties, [
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

  it('should fetch the products of cart items without a shop item', async () => {
    const input = getCartResult()
    delete input.cartItems[0].product.shopItem

    const { cartItems } = await loadSubject([{ id: '1', properties: getProperties() }])(
      {
        config: {
          addProperties: ['foo']
        }
      },
      input
    )
    assert.deepStrictEqual(requestedProductIds, ['1'])
    assert.deepStrictEqual(cartItems[0].product.additionalProperties, [
      {
        label: 'foo',
        value: 'bar'
      }
    ])
  })

  it('should ignore cart items that are no products', async () => {
    const input = getCartResult()
    input.cartItems[0].type = 'coupon'

    const { cartItems } = await loadSubject()(
      {
        config: {
          addProperties: ['foo', 'added']
        }
      },
      input
    )
    assert.strictEqual(cartItems[0].product.additionalProperties, undefined)
    assert.deepStrictEqual(requestedProductIds, [])
  })

  it('should not do anything if no property is matched', async () => {
    const { cartItems } = await loadSubject()(
      {
        config: {
          addProperties: ['nomatch', 'nonomatch']
        }
      },
      getCartResult()
    )
    assert.deepStrictEqual({ cartItems }, getCartResult())
  })

  it('should not do anything if no property is configured to be added', async () => {
    const { cartItems } = await loadSubject()(
      {
        config: {
          addProperties: null
        }
      },
      getCartResult()
    )
    assert.deepStrictEqual({ cartItems }, getCartResult())
  })
})
