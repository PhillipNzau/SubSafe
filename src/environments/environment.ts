// const url = 'http://localhost:8080/';
const url = 'https://go-vault.onrender.com/';

const authBaseUrl = url + 'auth/';
const credentialsBaseUrl = url + 'credentials';
const subscriptionsBaseUrl = url + 'subscriptions';
const hubsBaseUrl = url + 'hubs';
const exportBaseUrl = url + 'export';
const importBaseUrl = url + 'import';

export const environment = {
  production: true,

  ///////////////** USER URLS **///////////////////
  loginUser: authBaseUrl + 'login',
  registerUser: authBaseUrl + 'register',
  refreshToken: authBaseUrl + 'refresh',
  verifyOtp: authBaseUrl + 'verify-otp',
  ///////////////** CREDENTIALS URLS **///////////////////
  listCredentials: credentialsBaseUrl,
  listSingleCredential: credentialsBaseUrl + '/',
  deleteCredential: credentialsBaseUrl + '/',
  createCredential: credentialsBaseUrl,
  updateCredential: credentialsBaseUrl + '/',
  ///////////////** SUBSCRIPTION URLS **///////////////////
  listSubscriptions: subscriptionsBaseUrl,
  listSingleSubscription: subscriptionsBaseUrl + '/',
  deleteSubscription: subscriptionsBaseUrl + '/',
  createSubscription: subscriptionsBaseUrl,
  updateSubscription: subscriptionsBaseUrl + '/',

  ///////////////** EXPORT IMPORT URLS **///////////////////
  exportCredentials: exportBaseUrl + '/credentials/excel',
  exportSubscriptions: exportBaseUrl + '/subscriptions/excel',
  exportResources: exportBaseUrl + '/resources/excel',

  importCredentials: importBaseUrl + '/credentials/excel',
  importSubscriptions: importBaseUrl + '/subscriptions/excel',
  importResources: importBaseUrl + '/resources/excel',

  ///////////////** HUBS URLS **///////////////////
  listHubs: hubsBaseUrl,
  listSingleHub: hubsBaseUrl + '/',
  deleteHub: hubsBaseUrl + '/delete/',
  createHub: hubsBaseUrl,
  updateHub: hubsBaseUrl + '/update/',
};
