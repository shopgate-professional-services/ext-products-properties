# Shopgate Connect - Additional Product Properties Extension

[![GitHub license](http://dmlc.github.io/img/apache2.svg)](LICENSE)
[![Build Status](https://travis-ci.org/shopgate/ext-products-add-properties.svg?branch=master)](https://travis-ci.org/shopgate/ext-magento-favorites)
[![Coverage Status](https://coveralls.io/repos/github/shopgate/ext-products-add-properties/badge.svg?branch=master)](https://coveralls.io/github/shopgate/ext-products-add-properties?branch=master)

Adds custom properties to products.

This extension replaces [@shopgate/products-add-properties](https://github.com/shopgate/ext-products-add-properties) and adds additional functionality to show properties in frontend.

## Configuration

Set the following values in your Shopgate Connect Admin:

* `addProperties` - (csv string) Comma-separated list of properties to add to pipeline output
* `addPropertiesWithPrefix` - (string[]) Comma-separated list of properties with prefix to add to pipeline output
* `productsProperties` - (object[]) Configuration to show properties at given portal positions
    * `target` (string[]) the list of target portals
    * `properties` (string[]) the list of product properties to show in target(s)
    * `include_values` (string[]) whitelist of properties values (to show only given)
    * `exclude_values` (string[]) blacklist of properties values (to show all except given)
    * `use_default_layout` (boolean) use default (product details) layout for properties. When this options is active, `format` and `html` options are ignored 
    * `styles` (json) the extra styling in css (glamor) format
    * `format` (string) (optional when `html` is true) format of presentation `"{label}: {value}"`
        - `label` property label
        - `value` property value
    * `formats` (json) the extra formats for `format` (numbers, currency, dates, etc)
    * `html` (bool) show property value as html (html sanitizer will be used, same as html widgets)

### available target positions

Also see [PDP portals set](./demo/PDPportals.jpg) how portals are layout

```json
"product-item.name.before",
"product-item.name.after",
"product-item.price.before",
"product-item.price.after"

"product.header.before",
"product.header.after",
"product.name.before",
"product.name.after",
"product.info.before",
"product.info.after",
"product.shipping.before",
"product.shipping.after",
"product.availability.before",
"product.availability.after",
"product.stock-info.before",
"product.stock-info.after",
"product.price-info.before",
"product.price-info.after",
"product.description.before"

"favorites.product-name.before",
"favorites.product-name.after",
"favorites.product-price.before",
"favorites.product-price.after",

"cart.item.name.before",
"cart.item.name.after",
"cart.item.price.before",
"cart.item.price.after"
```

### Example of configuration

```json
{
  "addProperties": [
    "Weight",
    "Width",
    "Height",
    "ISBN"
  ],
  "productsProperties": [
    {
      "target": ["product-item.name.after"],
      "properties": ["ISBN"],
      "styles": {
        "color": "#f00"
      },
      "format": "{label}: {value}"
    },
    {
      "target": ["product.priceInfo.after"],
      "properties": ["Bonus points"],
      "format": "Bonuses for order: {value} 💰 "
    },
    {
      "target": ["product.name.after"],
      "properties": ["Long name"],
      "html": true
    },
    {
      "target": ["product.name.after"],
      "properties": ["Hint"],
      "include_values": ["Important hint"],
      "styles": {
        "color": "red"
      }
    },
    {
      "target": ["product.name.after"],
      "properties": ["Hint"],
      "exclude_values": ["Important hint"],
      "styles": {
        "color": "grey"
      }
    },
    {
      "target": ["product.description.before"],
      "properties": ["Hersteller"],
      "use_default_layout": true
    },
    {
      "format": "Additional fee: {value, number, decimal}€",
      "formats": {
        "number": {
          "decimal": {
            "style": "decimal",
            "maximumFractionDigits": 2,
            "minimumFractionDigits": 2
          }
        }
      },
      "target": [
        "product.info.after"
      ],
      "properties": [
        "addFee"
      ]
    }
  ]
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
