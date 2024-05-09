import { Appwrite } from "appwrite";

const sdk = new Appwrite();

sdk
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('65dafda408a804a828f0') // Your project ID
;


 export const account = sdk.account;