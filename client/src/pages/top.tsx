import { useEffect } from "react";

export default function Top() {
  useEffect(() => {
    document.title = "トップ";
  }, []);
  return <div id="top"></div>;
}
