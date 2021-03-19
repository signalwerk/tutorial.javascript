/// <reference types="react-scripts" />
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    PUBLIC_URL: string;
    REACT_APP_BUILD_TIME: string;
    REACT_APP_DEV: string;
  }
}
interface Window {
  //   Stripe: any;
}
