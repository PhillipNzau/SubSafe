const url = 'http://localhost:8080/';

const authBaseUrl = url + 'auth/';
const credentialsBaseUrl = url + 'credentials';
const subscriptionsBaseUrl = url + 'subscriptions';

export const environment = {
  production: false,

  ///////////////** USER URLS **///////////////////
  loginUser: authBaseUrl + 'login',
  registerUser: authBaseUrl + 'register',
  ///////////////** CREDENTIALS URLS **///////////////////
  listCredentials: credentialsBaseUrl,
  listSingleCredential: credentialsBaseUrl + '/',
  deleteCredential: credentialsBaseUrl,
  createCredential: credentialsBaseUrl,
  updateCredential: credentialsBaseUrl + '/',
  ///////////////** SUBSCRIPTION URLS **///////////////////
  listSubscriptions: subscriptionsBaseUrl,
  listSingleSubscription: subscriptionsBaseUrl + '/',
  deleteSubscription: subscriptionsBaseUrl,
  createSubscription: subscriptionsBaseUrl,
  updateSubscription: subscriptionsBaseUrl + '/',
};
