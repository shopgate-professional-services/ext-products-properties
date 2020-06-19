const assert = require('assert')
const subjectUnderTest = require('../../addProperties')
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
    const { products } = await subjectUnderTest({
      config: {
        addProperties: 'foo,added'
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

  it('should add properties if they are configured - independent of case', async () => {
    const { products } = await subjectUnderTest({
      config: {
        addProperties: 'foo,Added'
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

  it('should add properties if they are configured - independent of case', async () => {
    const input = getProductsResult()
    input.products[0].properties[0].label = 'Added'

    const { products } = await subjectUnderTest({
      config: {
        addProperties: 'foo,added'
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

  it('should not do anything if no property is matched', async () => {
    const { products } = await subjectUnderTest({
      config: {
        addProperties: 'nomatch,nonomatch'
      }
    }, getProductsResult())
    assert.deepStrictEqual({ products }, getProductsResult())
  })

  it('should not do anything if no property is configured to be added', async () => {
    const { products } = await subjectUnderTest({
      config: {
        addProperties: ''
      }
    }, getProductsResult())
    assert.deepStrictEqual({ products }, getProductsResult())
  })
})
