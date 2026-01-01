"use client";

import { useEffect } from "react";

type Props = {
  url: string;
};

export default function FacebookPost({ url }: Props) {
  useEffect(() => {
    if (window.FB) {
      window.FB.XFBML.parse();
      return;
    }

    if (document.getElementById("facebook-jssdk")) return;

    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.src =
      "https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v19.0";
    script.async = true;
    document.body.appendChild(script);
  }, [url]);

  return (
    <div
      className="fb-post w-full flex justify-center"
      data-href={url}
      data-width="500"
    />
  );
}
