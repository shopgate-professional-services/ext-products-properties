import { createSelector } from 'reselect';
import { getProductDataById } from '@shopgate/engage/product';

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
