import IntlMessageFormat from 'intl-messageformat';
import { appConfig } from '@shopgate/engage';

const messageCache = {};

/**
 * @param {string} format .
 * @param {Object} formats .
 * @returns {IntlMessageFormat}
 */
export const getIntlMessage = (format, formats) => {
  if (!messageCache[format]) {
    try {
      messageCache[format] = new IntlMessageFormat(
        format,
        appConfig.language,
        formats
      );
    } catch (err) {
      messageCache[format] = {
        format: () => format,
      };
    }
  }
  return messageCache[format];
};
