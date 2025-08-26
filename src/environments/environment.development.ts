// const url = 'http://localhost:8080/';
const url = 'https://go-vault.onrender.com/';

const authBaseUrl = url + 'auth/';
const credentialsBaseUrl = url + 'credentials';
const subscriptionsBaseUrl = url + 'subscriptions';

export const environment = {
  production: false,

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
};
