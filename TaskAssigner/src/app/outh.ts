export const OAuthSettings =
{
  clientId: '3599ca5e-4fb2-4996-a807-487c91c8ade3',
  authority: 'https://login.microsoftonline.com/common/',

  validateAuthority: true,
  redirectUri: 'http://localhost:4200/verify',
  scopes: [ 'user.read','openid','profile'],
  postLogoutRedirectUri: "http://localhost:4200/"

};


