import { createSelector } from 'reselect';
import { getProductDataById, getProductPropertiesUnfiltered } from '@shopgate/engage/product';
import { getCartProducts } from '@shopgate/engage/cart';

/**
 * @returns {null|Object[]}
 */
export const makeGetPropertiesByProductId = () => (
  createSelector(
    getProductDataById,
    getProductPropertiesUnfiltered,
    (productData, productProperties) => {
      if (!productData) {
        return null;
      }

      let { additionalProperties = [] } = productData || {};
      if (productProperties) {
        // Add product properties
        additionalProperties = additionalProperties.concat(productProperties);
        // Remove duplicates
        additionalProperties = additionalProperties.filter((p, ind) => (
          ind === additionalProperties.findIndex(ap => ap.label === p.label)
        ));
      }

      return additionalProperties.length ? additionalProperties : null;
    }
  ));

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
