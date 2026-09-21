import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@shopgate/engage/styles';
import { HtmlSanitizer } from '@shopgate/engage/components';
import DefaultPropertiesCmp from '@shopgate/engage/product/components/ProductProperties/Content';
import { getIntlMessage } from '../../helpers';

/**
 * @param {Object} props Props
 * @return {JSX}
 */
const ProductProperties = ({
  format, formats, isHtml, useDefaultLayout, styles, properties,
}) => {
  if (!format && !isHtml && !useDefaultLayout) {
    return null;
  }

  const className = css(styles);

  if (useDefaultLayout) {
    return (
      <div className={className}>
        <DefaultPropertiesCmp properties={properties} />
      </div>
    );
  }

  if (isHtml) {
    return (
      <>
        {properties.map(property => (
          <HtmlSanitizer
            key={property.label}
            className={className}
          >
            {property.value}
          </HtmlSanitizer>
        ))}
      </>
    );
  }

  return (
    <>
      {properties.map(property => (
        <div
          key={property.label}
          className={className}
        >
          {getIntlMessage(format, formats).format(property)}
        </div>
      ))}
    </>
  );
};

ProductProperties.propTypes = {
  format: PropTypes.string,
  formats: PropTypes.shape(),
  isHtml: PropTypes.bool,
  properties: PropTypes.arrayOf(PropTypes.shape()),
  styles: PropTypes.shape(),
  useDefaultLayout: PropTypes.bool,
};

ProductProperties.defaultProps = {
  format: null,
  formats: null,
  isHtml: false,
  properties: null,
  styles: null,
  useDefaultLayout: false,
};

export default ProductProperties;
