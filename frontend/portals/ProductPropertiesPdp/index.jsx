import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import { withCurrentProduct } from '@shopgate/engage/core';
import { withPropertiesByProductId } from '../../properties/connectors';
import { useTargetConfigs } from '../../properties/hooks';
import ProductPropertiesCmp from '../../components/ProductProperties';
import { filterProperties } from '../../properties/helpers';

/**
 * @param {Object} props Props
 * @return {JSX}
 */
const ProductPropertiesPdp = ({ name, properties }) => {
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
          isHtml={config.html === true}
          properties={filterProperties(properties, config)}
        />
      ))}
    </Fragment>
  );
};

ProductPropertiesPdp.propTypes = {
  name: PropTypes.node.isRequired,
  properties: PropTypes.arrayOf(PropTypes.shape()),
};

ProductPropertiesPdp.defaultProps = {
  properties: null,
};

export default withCurrentProduct(
  withPropertiesByProductId(
    memo(ProductPropertiesPdp)
  )
);
