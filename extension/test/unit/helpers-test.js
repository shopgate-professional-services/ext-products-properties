const assert = require('assert')
const { getConfiguredProperties } = require('../../helpers')

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
    const props = getConfiguredProperties(stubConfig)
    assert.deepStrictEqual(props, [
      'weight',
      'width',
      'height',
      'isbn',
      'bonus points',
      'long name',
      'abbr. name'
    ])
  })
})
