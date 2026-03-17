import "styles/globals.css";
import { Header } from "@/components/Header";
import { Sparkles } from "lucide-react";

function MyApp({ Component, pageProps }) {
  const title = Component.title || "Clube Depil";
  const subtitle = Component.subtitle || "";
  const icon = Component.icon || Sparkles;
  const hideHeader = Component.hideHeader || false;

  console.log(Component);
  return (
    <>
      <Header
        title={title}
        subtitle={subtitle}
        Icon={icon}
        hideHeader={hideHeader}
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
