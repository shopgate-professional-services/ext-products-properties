import { connect } from 'react-redux';
import { getPropertiesByCartItemId, makeGetPropertiesByProductId } from './selectors';

/**
 * Creates the mapStateToProps for a single connected component instance, so that the memoization
 * of the underlying selector is not shared between instances.
 * @returns {Function}
 */
function makeMapStateToProps() {
  const getPropertiesByProductId = makeGetPropertiesByProductId();

  return (state, props) => {
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
  };
}

/**
 * Connector to get properties by product Id
 */
export const withPropertiesByProductId = connect(makeMapStateToProps);

/**
 * Connector to get properties by cart Item Id
 */
export const withPropertiesByCartItemId = connect((state, props) => ({
  properties: getPropertiesByCartItemId(state, props),
}));
