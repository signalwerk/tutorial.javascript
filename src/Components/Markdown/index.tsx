import React from "react";
import { md2obj, mdToken, mdTypes } from "./md";
export type markdownProps = {
  text: string;
};

const obj2jsx = (token: mdToken, key: number) => {
  switch (token.type) {
    case mdTypes.INLINE_CODE:
      return <code key={key}>{token.text}</code>;
      break;
    case mdTypes.EMPHASIZE:
      return (
        <em key={key}>
          {token.content.map((item, index) => obj2jsx(item, index))}
        </em>
      );
      break;
    case mdTypes.LINK:
      return (
        <a key={key} href={token.href} target="_blank" rel="noreferrer">
          {token?.content.map((item, index) => obj2jsx(item, index))}
        </a>
      );
      break;
    case mdTypes.TEXT:
      return <span key={key}>{token.text}</span>;
      break;
    default:
      return <span>⚠️ no handling</span>;
      break;
  }
};

const Markdown = ({ text }: markdownProps) => {
  const tokens = md2obj(text);
  return (
    <span className="markdown">
      {tokens.map((token, index) => obj2jsx(token, index))}
    </span>
  );
};
export default Markdown;
