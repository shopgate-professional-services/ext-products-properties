import { createSelector } from 'reselect';
import { getProductDataById } from '@shopgate/engage/product';
import { getCartProducts } from '@shopgate/engage/cart';

/**
 * @returns {null|Object[]}
 */
export const getPropertiesByProductId = createSelector(
  getProductDataById,
  (productData) => {
    if (!productData) {
      return null;
    }

    const { additionalProperties } = productData || {};
    return additionalProperties || null;
  }
);

/**
 * @returns {null|Object[]}
 */
export const getPropertiesByCartItemId = createSelector(
  getCartProducts,
  (_, { cartItemId }) => cartItemId,
  (products, cartItemId) => {
    if (!products || !products.length || !cartItemId) {
      return null;
    }

    const {
      product: {
        additionalProperties,
      } = {},
    } = products.find(c => c.id === cartItemId) || {};
    return additionalProperties || null;
  }
);
