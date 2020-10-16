import IntlMessageFormat from 'intl-messageformat';
import { appConfig } from '@shopgate/engage';

const messageCache = {};

/**
 * @param {string} format .
 * @returns {IntlMessageFormat}
 */
export const getIntlMessage = (format) => {
  if (!messageCache[format]) {
    try {
      messageCache[format] = new IntlMessageFormat(format, appConfig.language);
    } catch (err) {
      messageCache[format] = {
        format: () => format,
      };
    }
  }
  return messageCache[format];
};
