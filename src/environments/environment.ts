// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  chainName: 'Juno Mainnet',
  chainId: 'juno-1',
  rpcEndpoint: 'https://rpc-juno.itastakers.com/',
  restEndpoint: 'https://lcd-juno.itastakers.com/',
  faucetEndpoint: '',
  addressPrefix: 'juno',
  denom: 'JUNO',
  microDenom: 'ujuno',
  coinDecimals: '6',
  gasPrice: 0.025,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
