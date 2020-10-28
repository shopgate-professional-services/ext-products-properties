import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import { useTargetConfigs } from '../../properties/hooks';
import ProductPropertiesCmp from '../../components/ProductProperties';
import { filterProperties } from '../../properties/helpers';

/**
 * @param {Object} props Props
 * @return {JSX}
 */
const ProductPropertiesFav = ({ name, product }) => {
  const configs = useTargetConfigs(name);

  const { additionalProperties } = product || {};
  if (!additionalProperties || !configs) {
    return null;
  }

  return (
    <Fragment>
      {configs.map(config => (
        <ProductPropertiesCmp
          key={`${name}-${JSON.stringify(config)}`}
          styles={config.styles}
          format={config.format}
          isHtml={config.html === true}
          useDefaultLayout={config.use_default_layout === true}
          properties={filterProperties(additionalProperties, config)}
        />
      ))}
    </Fragment>
  );
};

ProductPropertiesFav.propTypes = {
  name: PropTypes.node.isRequired,
  product: PropTypes.shape().isRequired,
};

export default memo(ProductPropertiesFav);
