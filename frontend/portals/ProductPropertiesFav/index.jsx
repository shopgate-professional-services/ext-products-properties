import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import { useTargetConfigs } from '../../properties/hooks';
import ProductPropertiesCmp from '../../components/ProductProperties';
import { filterProperties } from '../../properties/helpers';
import { withPropertiesByProductId } from '../../properties/connectors';

/**
 * @param {Object} props Props
 * @return {JSX}
 */
const ProductPropertiesFav = ({ name, properties }) => {
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

ProductPropertiesFav.propTypes = {
  name: PropTypes.node.isRequired,
  properties: PropTypes.arrayOf(PropTypes.shape()),
};

ProductPropertiesFav.defaultProps = {
  properties: null,
};

export default withPropertiesByProductId(
  memo(ProductPropertiesFav)
);
