import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
import { StrictMode } from "react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <StrictMode>
      <SessionProvider session={session}>
        <RecoilRoot>
          <Component {...pageProps} />
        </RecoilRoot>
      </SessionProvider>
    </StrictMode>
  );
}

export default MyApp;
