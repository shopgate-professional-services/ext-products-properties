import { connect } from 'react-redux';
import { getPropertiesByProductId, getPropertiesByCartItemId } from './selectors';

/**
 * Connector to get properties by product Id
 */
export const withPropertiesByProductId = connect((state, props) => ({
  properties: getPropertiesByProductId(state, props),
}));

/**
 * Connector to get properties by cart Item Id
 */
export const withPropertiesByCartItemId = connect((state, props) => ({
  properties: getPropertiesByCartItemId(state, props),
}));
