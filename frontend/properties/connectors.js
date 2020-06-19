import { connect } from 'react-redux';
import { getPropertiesByProductId } from './selectors';

/**
 * Connector to get properties by product Id
 */
export const withPropertiesByProductId = connect((state, props) => ({
  properties: getPropertiesByProductId(state, props),
}));
