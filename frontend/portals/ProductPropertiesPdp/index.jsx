import { withCurrentProduct } from '@shopgate/engage/core';
import { withPropertiesByProductId } from '../../properties/connectors';
import ProductPropertiesList from '../../components/ProductPropertiesList';

export default withCurrentProduct(
  withPropertiesByProductId(ProductPropertiesList)
);
