"use client";

type Props = {
  url: string;
};

function buildFacebookIframeUrl(postUrl: string) {
  const encoded = encodeURIComponent(postUrl);
  return `https://www.facebook.com/plugins/post.php?href=${encoded}&show_text=true&width=350`;
}

export default function FacebookPost({ url }: Props) {
  const iframeSrc = buildFacebookIframeUrl(url);

  return (
    <div className="w-full flex justify-center">
      <div className="w-[350px]">
        <iframe
          src={iframeSrc}
          width="350"
          height="470"
          style={{ border: "none", overflow: "hidden" }}
          scrolling="no"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}
