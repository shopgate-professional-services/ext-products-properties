import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import { withPropertiesByProductId } from '../../properties/connectors';
import { useTargetConfigs } from '../../properties/hooks';
import ProductPropertiesCmp from '../../components/ProductProperties';

/**
 * @param {Object} props Props
 * @return {JSX}
 */
const ProductProperties = ({ name, properties }) => {
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
          properties={properties.filter(prop => config.properties.includes(prop.label))}
        />
      ))}
    </Fragment>
  );
};

ProductProperties.propTypes = {
  name: PropTypes.node.isRequired,
  properties: PropTypes.arrayOf(PropTypes.shape()),
};

ProductProperties.defaultProps = {
  properties: null,
};

export default withPropertiesByProductId(memo(ProductProperties));
