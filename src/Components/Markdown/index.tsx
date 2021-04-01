import React from "react";

import fromMarkdown, { mdTypes, mdToken } from "mdast-util-from-span-markdown";
const md = "Say **Hello** [World](https://example.com) in `code`! *Thanks!*";

export type markdownProps = {
  text: string;
};

const obj2jsx = (token: mdToken, key: number) => {
  switch (token.type) {
    case mdTypes.INLINE_CODE:
      return <code key={key}>{token.value}</code>;
      break;
    case mdTypes.EMPHASIS:
    // case mdTypes.STRONG:
      return (
        <em key={key}>
          {token.children.map((item, index) => obj2jsx(item, index))}
        </em>
      );
      break;
    case mdTypes.LINK:
      return (
        <a key={key} href={token.url} target="_blank" rel="noreferrer">
          {token?.children.map((item, index) => obj2jsx(item, index))}
        </a>
      );
      break;
    case mdTypes.TEXT:
      return <span key={key}>{token.value}</span>;
      break;
    default:
      return <span>⚠️ no handling</span>;
      break;
  }
};

const Markdown = ({ text }: markdownProps) => {
  const tokens = fromMarkdown(text);
  return (
    <span className="markdown">
      {tokens.map((token, index) => obj2jsx(token, index))}
    </span>
  );
};
export default Markdown;
