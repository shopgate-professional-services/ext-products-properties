import { makeGetPropertiesByProductId } from './selectors';

const BASE_ID = 'base-product';
const VARIANT_ID = 'variant-product';

/**
 * The engage selectors are mocked with the resolution rules of the real implementations
 * (pwa 7.31, libraries/commerce/product/selectors/product.js):
 * getProductDataById() always resolves props.productId, while getProduct() and
 * getProductPropertiesUnfiltered() resolve via getProductId(), which prefers props.variantId.
 * On the product detail page those are two different products.
 */
jest.mock('@shopgate/engage/product', () => {
  const getProductId = (state, props) => (
    (typeof props.variantId !== 'undefined' && props.variantId !== null)
      ? props.variantId
      : (props.productId || null)
  );

  return {
    getProduct: (state, props) => {
      const { productData } = state.product.productsById[getProductId(state, props)] || {};
      return productData || null;
    },
    getProductDataById: (state, props) => {
      const entry = state.product.productsById[props.productId];
      return entry ? entry.productData : undefined;
    },
    getProductPropertiesUnfiltered: (state, props) => {
      const entry = state.product.propertiesByProductId[getProductId(state, props)];
      if (!entry || entry.isFetching || typeof entry.properties === 'undefined') {
        return null;
      }
      return entry.properties;
    },
  };
});

jest.mock('@shopgate/engage/cart', () => ({
  getCartProducts: () => [],
}));

const baseNumber = {
  label: 'No.',
  value: 'BASE-1',
};

const baseBarcode = {
  label: 'Barcode',
  value: '1000000000001',
};

const baseMaterial = {
  label: 'Material',
  value: 'Cotton',
};

const variantNumber = {
  label: 'No.',
  value: 'VARIANT-1',
};

const variantBarcode = {
  label: 'Barcode',
  value: '2000000000002',
};

const baseProperties = [baseNumber, baseBarcode, baseMaterial];
const variantProperties = [variantNumber, variantBarcode];

/**
 * Builds a product state. Every part is optional to model the different loading states.
 * @param {Object} [options] Options.
 * @param {Object[]} [options.base] additionalProperties of the base product.
 * @param {Object[]} [options.variant] additionalProperties of the variant.
 * @param {Object} [options.properties] Properties state entry of the variant.
 * @returns {Object}
 */
const createState = ({ base, variant, properties } = {}) => {
  const productsById = {};

  if (base) {
    productsById[BASE_ID] = {
      productData: {
        id: BASE_ID,
        additionalProperties: base,
      },
    };
  }

  if (variant) {
    productsById[VARIANT_ID] = {
      productData: {
        id: VARIANT_ID,
        baseProductId: BASE_ID,
        additionalProperties: variant,
      },
    };
  }

  return {
    product: {
      productsById,
      propertiesByProductId: properties ? {
        [VARIANT_ID]: properties,
      } : {},
    },
  };
};

/**
 * Runs the selector for a product detail page on which a variant is selected.
 * @param {Object} state The application state.
 * @returns {null|Object[]}
 */
const selectForSelectedVariant = state => makeGetPropertiesByProductId()(state, {
  productId: BASE_ID,
  variantId: VARIANT_ID,
});

describe('makeGetPropertiesByProductId()', () => {
  it('should prefer the properties of the selected variant over the base product', () => {
    const result = selectForSelectedVariant(createState({
      base: baseProperties,
      properties: {
        properties: variantProperties,
      },
    }));

    expect(result).toContainEqual(variantNumber);
    expect(result).toContainEqual(variantBarcode);
    expect(result).not.toContainEqual(baseNumber);
  });

  it('should keep base product labels which the variant does not provide', () => {
    const result = selectForSelectedVariant(createState({
      base: baseProperties,
      properties: {
        properties: variantProperties,
      },
    }));

    expect(result).toContainEqual(baseMaterial);
    expect(result).toHaveLength(3);
  });

  it('should fall back to the variant additionalProperties while properties are fetched', () => {
    const result = selectForSelectedVariant(createState({
      base: baseProperties,
      variant: [variantNumber],
      properties: {
        isFetching: true,
      },
    }));

    expect(result).toContainEqual(variantNumber);
    expect(result).not.toContainEqual(baseNumber);
  });

  it('should return the base product properties when no variant is selected', () => {
    const result = makeGetPropertiesByProductId()(createState({ base: baseProperties }), {
      productId: BASE_ID,
      variantId: null,
    });

    expect(result).toEqual(baseProperties);
  });

  it('should return the variant properties when the base product is not loaded yet', () => {
    const result = selectForSelectedVariant(createState({
      properties: {
        properties: variantProperties,
      },
    }));

    expect(result).toEqual(variantProperties);
  });

  it('should return null when no properties are available', () => {
    const result = makeGetPropertiesByProductId()(createState(), { productId: BASE_ID });

    expect(result).toBeNull();
  });

  it('should not throw when the properties of a product are not an array', () => {
    const state = createState({
      base: baseProperties,
      properties: {
        properties: variantNumber,
      },
    });

    expect(() => selectForSelectedVariant(state)).not.toThrow();
  });
});
