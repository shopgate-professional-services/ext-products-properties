import { useMemo } from 'react';
import config from '../config.json';

/**
 * Get configs for target.
 * @param {string} target portal name
 * @returns {Object[]|null}
 */
export const useTargetConfigs = (target) => {
  const configs = useMemo(() => {
    const { productsProperties } = config;

    if (!productsProperties || !productsProperties.length) {
      return null;
    }
    return productsProperties.filter(conf => conf.target.includes(target));
  }, [target]);

  return configs && configs.length ? configs : null;
};
