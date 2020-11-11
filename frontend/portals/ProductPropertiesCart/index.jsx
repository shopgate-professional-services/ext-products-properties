import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import { withPropertiesByCartItemId } from '../../properties/connectors';
import { useTargetConfigs } from '../../properties/hooks';
import ProductPropertiesCmp from '../../components/ProductProperties';
import { filterProperties } from '../../properties/helpers';

/**
 * @param {Object} props Props
 * @return {JSX}
 */
const ProductPropertiesCart = ({ name, properties }) => {
  const configs = useTargetConfigs(name);

  if (!properties || !configs) {
    return null;
  }

  return (
    <Fragment>
      {configs.map(config => (
        <ProductPropertiesCmp
          key={`${name}-${JSON.stringify(config)}`}
          styles={config.styles}
          format={config.format}
          formats={config.formats}
          isHtml={config.html === true}
          useDefaultLayout={config.use_default_layout === true}
          properties={filterProperties(properties, config)}
        />
      ))}
    </Fragment>
  );
};

ProductPropertiesCart.propTypes = {
  name: PropTypes.node.isRequired,
  properties: PropTypes.arrayOf(PropTypes.shape()),
};

ProductPropertiesCart.defaultProps = {
  properties: null,
};

export default withPropertiesByCartItemId(memo(ProductPropertiesCart));
