import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import css from 'glamor';
import { i18n, bin2hex } from '@shopgate/engage/core';
import { HtmlSanitizer } from '@shopgate/engage/components';

/**
 * @param {Object} props Props
 * @return {JSX}
 */
const ProductProperties = ({
  format, isHtml, styles, properties,
}) => {
  const className = css(styles).toString();

  if (isHtml) {
    return (
      <Fragment>
        {properties.map(property => (
          <HtmlSanitizer
            key={property.label}
            className={className}
          >
            {property.value}
          </HtmlSanitizer>
        ))}
      </Fragment>
    );
  }

  return (
    <Fragment>
      {properties.map(property => (
        <div
          key={property.label}
          className={className}
        >
          {i18n.text(
            `product_properties.${bin2hex(format)}`,
            property
          )}
        </div>
      ))}
    </Fragment>
  );
};

ProductProperties.propTypes = {
  format: PropTypes.string,
  isHtml: PropTypes.bool,
  properties: PropTypes.arrayOf(PropTypes.shape()),
  styles: PropTypes.shape(),
};

ProductProperties.defaultProps = {
  format: null,
  isHtml: false,
  properties: null,
  styles: null,
};

export default ProductProperties;
