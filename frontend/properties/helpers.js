/**
 * Filter product properties by given config
 * @param {Object[]} properties .
 * @param {Object} config .
 * @returns {Object[]}
 */
export const filterProperties = (properties, config) => {
  let props = properties.filter(prop => config.properties.includes(prop.label.normalize()));
  if (props.length && config.include_values) {
    props = props.filter(prop => config.include_values.includes(prop.value.normalize()));
  }
  if (props.length && config.exclude_values) {
    props = props.filter(prop => !config.exclude_values.includes(prop.value.normalize()));
  }
  return props;
};
