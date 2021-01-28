import { connect } from 'react-redux';
import { getPropertiesByCartItemId, makeGetPropertiesByProductId } from './selectors';

/**
 * Connector to get properties by product Id
 */
export const withPropertiesByProductId = connect((state, props) => {
  const getPropertiesByProductId = makeGetPropertiesByProductId();

  let mapProps = props;
  if (!mapProps.productId && mapProps.id) {
    mapProps = {
      productId: mapProps.id,
    };
  }
  if (!mapProps.productId && mapProps.product) {
    mapProps = {
      productId: mapProps.product.id,
    };
  }

  return {
    properties: getPropertiesByProductId(state, mapProps),
  };
});

/**
 * Connector to get properties by cart Item Id
 */
export const withPropertiesByCartItemId = connect((state, props) => ({
  properties: getPropertiesByCartItemId(state, props),
}));
