import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useTargetConfigs } from '../../properties/hooks';
import ProductProperties from '../ProductProperties';
import { filterProperties } from '../../properties/helpers';

/**
 * Renders a property block for every config that targets the given portal.
 * @param {Object} props Props
 * @return {JSX}
 */
const ProductPropertiesList = ({ name, properties }) => {
  const configs = useTargetConfigs(name);

  if (!properties || !configs) {
    return null;
  }

  return (
    <>
      {configs.map(config => (
        <ProductProperties
          key={`${name}-${JSON.stringify(config)}`}
          styles={config.styles}
          format={config.format}
          formats={config.formats}
          isHtml={config.html === true}
          useDefaultLayout={config.use_default_layout === true}
          properties={filterProperties(properties, config)}
        />
      ))}
    </>
  );
};

ProductPropertiesList.propTypes = {
  name: PropTypes.node.isRequired,
  properties: PropTypes.arrayOf(PropTypes.shape()),
};

ProductPropertiesList.defaultProps = {
  properties: null,
};

export default memo(ProductPropertiesList);
