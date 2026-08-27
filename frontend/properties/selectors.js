import { createSelector } from 'reselect';
import {
  getProduct,
  getProductDataById,
  getProductPropertiesUnfiltered,
} from '@shopgate/engage/product';
import { getCartProducts } from '@shopgate/engage/cart';

/**
 * @returns {null|Object[]}
 */
export const makeGetPropertiesByProductId = () => (
  createSelector(
    getProduct,
    getProductDataById,
    getProductPropertiesUnfiltered,
    (product, baseProductData, productProperties) => {
      const { additionalProperties: productAdditionalProperties = [] } = product || {};
      const { additionalProperties: baseAdditionalProperties = [] } = baseProductData || {};

      // The sources are ordered from the most to the least specific one. getProduct() and
      // getProductPropertiesUnfiltered() resolve via getProductId() which prefers the variantId,
      // while getProductDataById() always resolves the productId. On the product detail page the
      // first two therefore describe the selected variant, while the base product only contributes
      // labels which the variant does not provide itself.
      const properties = [].concat(
        productProperties || [],
        productAdditionalProperties,
        baseAdditionalProperties
      );

      // Remove duplicates
      const uniqueProperties = properties.filter((p, ind) => (
        ind === properties.findIndex(ap => ap.label === p.label)
      ));

      return uniqueProperties.length ? uniqueProperties : null;
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
