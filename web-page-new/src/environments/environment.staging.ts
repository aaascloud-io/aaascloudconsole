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
    accUrl: {
        server: 'http://localhost:8080',
        bsServer: 'https://demo.trackun.jp/bs',
    },
    keycloak: {
        server: 'https://auth.aaascloud.io/auth/realms/trackun/',
        clientId: 'trackun',
    },
    targetUser: {
        id: 'targetuserid',
        companyId: 'targetuserCompanyid',
    },
    httpEnv: {
        protocol: 'https',
        host: 'console.aaascloud.io',
        port: '443',
        root: 'aaascloud',
    },

};
