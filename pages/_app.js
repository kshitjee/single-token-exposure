import React from "react";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <title>My App</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
