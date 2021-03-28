import React from "react";
import { md2obj, mdToken, mdTypes } from "./md";
export type markdownProps = {
  text: string;
};

const obj2jsx = (token: mdToken) => {
  switch (token.type) {
    case mdTypes.INLINE_CODE:
      return <code>{token.text}</code>;
      break;
    case mdTypes.EMPHASIZE:
      return <em>{token.content.map((item) => obj2jsx(item))}</em>;
      break;
    case mdTypes.LINK:
      return (
        <a href={token.href}>{token?.content.map((item) => obj2jsx(item))}</a>
      );
      break;
    case mdTypes.TEXT:
      return <span>{token.text}</span>;
      break;
    default:
      return <span>⚠️ no handling</span>;
      break;
  }
};

const Markdown = ({ text }: markdownProps) => {
  const tokens = md2obj(text);
  return (
    <div className="markdown">{tokens.map((token) => obj2jsx(token))}</div>
  );
};
export default Markdown;
