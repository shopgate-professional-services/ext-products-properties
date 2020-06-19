import { useMemo } from 'react';
import { productsProperties } from '../config';

/**
 * Get configs for target.
 * @param {string} target portal name
 * @returns {Object[]|null}
 */
export const useTargetConfigs = (target) => {
  const configs = useMemo(() => {
    if (!productsProperties || !productsProperties.length) {
      return null;
    }
    return productsProperties.filter(config => config.target.includes(target));
  }, [target]);

  return configs.length ? configs : null;
};
