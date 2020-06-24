import { bin2hex } from '@shopgate/engage/core';
import { productsProperties } from '../config';

let locale = {};

// Add frontend properties
if (productsProperties && productsProperties.length) {
  locale = productsProperties.reduce((acc, conf) => ({
    ...acc,
    [bin2hex(conf.format)]: conf.format,
  }), {});
}
/**
 * Export in INtl format to use with i18n module
 */
export default {
  // eslint-disable-next-line camelcase
  product_properties: locale,
};
