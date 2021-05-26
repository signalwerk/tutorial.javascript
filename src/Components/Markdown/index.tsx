import fromMarkdown, { mdToken, mdTypes } from "mdast-util-from-span-markdown";
import React from "react";
import "./styles.css";

export type markdownProps = {
  text: string;
};

const obj2jsx = (token: mdToken, key: number) => {
  switch (token.type) {
    case mdTypes.INLINE_CODE:
      return <code key={key}>{token.value}</code>;
    case mdTypes.EMPHASIS:
    case mdTypes.STRONG:
      return (
        <em key={key}>
          {token.children.map((item, index) => obj2jsx(item, index))}
        </em>
      );
    case mdTypes.LINK:
      return (
        <a key={key} href={token.url} target="_blank" rel="noreferrer">
          {token?.children.map((item, index) => obj2jsx(item, index))}
        </a>
      );
    case mdTypes.TEXT:
      return (
        <span className="markdown__text" key={key}>
          {token.value}
        </span>
      );
    default:
      return <span>⚠️ no handling</span>;
  }
};

const Markdown = ({ text }: markdownProps) => {
  const tokens = fromMarkdown(text);
  return (
    <span className="markdown">
      {tokens && tokens.map((token, index) => obj2jsx(token, index))}
    </span>
  );
};
export default Markdown;
