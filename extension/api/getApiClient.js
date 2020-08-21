const { ExternalBigAPI, TokenHandler } = require('@shopgate/bigapi-requester')
const config = require('../config.json')

const bigApi = new ExternalBigAPI(
  new TokenHandler(
    {
      api: `https://{serviceName}.${config.apiCredentials.baseDomain}`,
      clientId: config.apiCredentials.clientId,
      clientSecret: config.apiCredentials.clientSecret,
      grantType: 'refresh_token',
      refreshToken: config.apiCredentials.refreshToken
    }
  )
)

module.exports = () => bigApi
