import "styles/globals.css";
import { Header } from "@/components/Header";
import { useState } from "react";

function MyApp({ Component, pageProps }) {
  const [updateHeader, setUpdateHeader] = useState(false);
  function notifyHeader() {
    setUpdateHeader((state) => !state);
  }

  const headerProps = { ...Component.headerProps, updateHeader };
  if (headerProps.name === "ManageStores") {
    pageProps = { ...pageProps, notifyHeader };
  }

  return (
    <>
      <Header {...headerProps} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
