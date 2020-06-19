const { ExternalBigAPI, TokenHandler } = require('@shopgate/bigapi-requester')

module.exports = (context) =>
  new ExternalBigAPI(
    new TokenHandler(
      {
        api: `https://{serviceName}.${context.config.apiCredentials.baseDomain}`,
        clientId: context.config.apiCredentials.clientId,
        clientSecret: context.config.apiCredentials.clientSecret,
        grantType: 'refresh_token',
        refreshToken: context.config.apiCredentials.refreshToken
      }
    )
  )
