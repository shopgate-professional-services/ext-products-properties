import { connect } from 'react-redux';
import { getPropertiesByCartItemId, makeGetPropertiesByProductId } from './selectors';

/**
 * Connector to get properties by product Id
 */
export const withPropertiesByProductId = connect((state, props) => {
  const getPropertiesByProductId = makeGetPropertiesByProductId();

  return {
    properties: getPropertiesByProductId(state, props),
  };
});

/**
 * Connector to get properties by cart Item Id
 */
export const withPropertiesByCartItemId = connect((state, props) => ({
  properties: getPropertiesByCartItemId(state, props),
}));
