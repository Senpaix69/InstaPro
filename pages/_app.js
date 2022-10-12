import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
import { StrictMode } from "react";
import { ToastContainer, Slide } from "react-toastify";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <StrictMode>
      <SessionProvider session={session}>
        <RecoilRoot>
          <Component {...pageProps} />
          <ToastContainer
            autoClose={2500}
            position={"top-left"}
            transition={Slide}
            limit={2}
            theme="dark"
            pauseOnFocusLoss={false}
          />
        </RecoilRoot>
      </SessionProvider>
    </StrictMode>
  );
}

export default MyApp;
