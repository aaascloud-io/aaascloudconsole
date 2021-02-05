// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// WARNING - Values under "firebase" and value of "googleApiKey" needs to be replaced from your own accounts
// If left as is, it firbase and google map related functionality will not work on LIVE instance.
export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyCSG-EGU2RLITgpjf_ogf1w47edC_DXlWc',
    authDomain: 'evolvision-rnd.firebaseapp.com',
    databaseURL: 'https://evolvision-rnd.firebaseio.com',
    projectId: 'evolvision-rnd',
    storageBucket: 'evolvision-rnd.appspot.com',
    messagingSenderId: '890895206035',
    appId: '1:890895206035:web:a6d0e1574d59ffe40bef66'
  },
  googleApiKey: 'AIzaSyAIIYOxA7qeetFz6TuR1Qewc0Rrjhzx7ZU',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
