export const OAuthSettings =
{
  clientId: 'e242d4d4-8831-4107-a2de-fe03469a13b3',
  authority: 'https://login.microsoftonline.com/common/',

  validateAuthority: true,
  redirectUri: 'http://localhost:4200/verify',
  scopes: [ 'user.read','openid','profile'],
  postLogoutRedirectUri: "http://localhost:4200/"

};


