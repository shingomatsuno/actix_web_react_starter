import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.title = "ホーム";
  }, []);
  return (
    <div>
      <h2>HOME</h2>
    </div>
  );
}
