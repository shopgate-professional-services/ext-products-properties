import React from 'react';
import PropTypes from 'prop-types';
import { logger } from '@shopgate/engage/core';
import { useTargetConfigs } from '../../properties/hooks';
import { filterProperties } from '../../properties/helpers';

/**
 * @param {Object} props Props
 * @return {JSX}
 */
const ProductPropertiesPdp = ({ name, properties, children }) => {
  const configs = useTargetConfigs(name);

  if (!configs) {
    // Return original properties component
    return children;
  }

  logger.assert(configs.length === 1, 'Found multiple configs for product.properties portal', configs);

  // Take the first one
  const [config] = configs;

  return React.cloneElement(children, {
    ...children.props,
    properties: filterProperties(properties, config),
  });
};

ProductPropertiesPdp.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  properties: PropTypes.arrayOf(PropTypes.shape()),
};

ProductPropertiesPdp.defaultProps = {
  properties: null,
};

export default ProductPropertiesPdp;
