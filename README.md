# Shopgate Connect - Additional Product Properties Extension

[![GitHub license](http://dmlc.github.io/img/apache2.svg)](LICENSE)
[![Build Status](https://travis-ci.org/shopgate/ext-products-add-properties.svg?branch=master)](https://travis-ci.org/shopgate/ext-magento-favorites)
[![Coverage Status](https://coveralls.io/repos/github/shopgate/ext-products-add-properties/badge.svg?branch=master)](https://coveralls.io/github/shopgate/ext-products-add-properties?branch=master)

Adds custom properties to products.

## Configuration

Set the following values in your Shopgate Connect Admin:
* `addProperties` - (csv string) Comma-separated list of properties to add

### Example of configuration

```json
{
    "addProperties":"Weight,Width,Height,ISBN"
}
```

### Example of product data with custom properties

```
{
  "id": "Product id",
  ...
  "additionalProperties": [
    {
      "label": "Weight",
      "value": "0.2kg"
    },
    {
      "label": "Width",
      "value": "120 cm"
    },
    {
      "label": "Height",
      "value": "100 cm"
    },
    {
      "label": "ISBN",
      "value": "978-3-16-148410-0"
    }
  ]
}
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md) file for more information.

## Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) file for more information.

## About Shopgate

Shopgate is the leading mobile commerce platform.

Shopgate offers everything online retailers need to be successful in mobile. Our leading
software-as-a-service (SaaS) enables online stores to easily create, maintain and optimize native
apps and mobile websites for the iPhone, iPad, Android smartphones and tablets.

## License

This extension is available under the Apache License, Version 2.0.

See the [LICENSE](./LICENSE) file for more information.
