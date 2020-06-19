const assert = require('assert')
const subjectUnderTest = require('../../addPropertiesToCartItems')

const getCartResult = () => ({
  cartItems: [
    {
      product: {
        shopItem: {
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
      }
    }
  ]
})

describe('addPropertiesToCartItems', () => {
  it('should add properties if they are configured', async () => {
    const { cartItems } = await subjectUnderTest(
      {
        config: {
          addProperties: 'foo,added'
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

  it('should add properties if they are configured - independent of case', async () => {
    const { cartItems } = await subjectUnderTest(
      {
        config: {
          addProperties: 'foo,Added'
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

  it('should add properties if they are configured - independent of case', async () => {
    const input = getCartResult()
    input.cartItems[0].product.shopItem.properties[0].label = 'Added'

    const { cartItems } = await subjectUnderTest(
      {
        config: {
          addProperties: 'foo,added'
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

  it('should not do anything if no property is matched', async () => {
    const { cartItems } = await subjectUnderTest(
      {
        config: {
          addProperties: 'nomatch,nonomatch'
        }
      },
      getCartResult()
    )
    assert.deepStrictEqual({ cartItems }, getCartResult())
  })

  it('should not do anything if no property is configured to be added', async () => {
    const { cartItems } = await subjectUnderTest(
      {
        config: {
          addProperties: ''
        }
      },
      getCartResult()
    )
    assert.deepStrictEqual({ cartItems }, getCartResult())
  })
})
