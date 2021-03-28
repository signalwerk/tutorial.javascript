export enum mdTypes {
  INLINE_CODE = "INLINE_CODE",
  EMPHASIZE = "EMPHASIZE",
  LINK = "LINK",
  TEXT = "TEXT",
}

export type emphasize = {
  type: mdTypes.EMPHASIZE;
  content: Array<inlineCode | text>;
};

export type inlineCode = {
  type: mdTypes.INLINE_CODE;
  text: string;
};

export type text = {
  type: mdTypes.TEXT;
  text: string;
};

export type link = {
  type: mdTypes.LINK;
  href: string;
  content: Array<emphasize | inlineCode | text>;
};

export type mdToken = link | emphasize | inlineCode | text;
export type mdTokens = Array<mdToken>;

export type toketPosition = {
  start: number;
  end: number;
};

type intermediateMdToken =
  | toketPosition
  | (link & toketPosition)
  | (emphasize & toketPosition)
  | (inlineCode & toketPosition)
  | (text & toketPosition);

export const md2obj = (md: string, rule = 0): mdTokens => {
  // all the regex rules
  const rules = [
    // link
    {
      match: /\[([^[]*)\]\(([^)]*)\)/g,
      tokenize: (item: RegExpMatchArray) => ({
        type: mdTypes.LINK,
        content: md2obj(item[1]),
        href: item[2],
      }),
    },
    // bold
    {
      match: /(\*{2})(.*?)\1/g,
      tokenize: (item: RegExpMatchArray) => ({
        type: mdTypes.EMPHASIZE,
        content: md2obj(item[2]),
      }),
    },
    // inline code
    {
      match: /(`)(.*?)(\1)/g,
      tokenize: (item: RegExpMatchArray) => ({
        type: mdTypes.INLINE_CODE,
        text: item[2],
      }),
    },
  ];

  if (rule === rules.length) {
    return [
      {
        type: mdTypes.TEXT,
        text: md,
      },
    ];
  }

  // including start and end
  const rawToken: intermediateMdToken[] = [
    {
      start: 0,
      end: 0,
    },
    ...Array.from(md.matchAll(rules[rule].match)).map((item) => ({
      start: item.index || 0,
      end: (item.index || 0) + item[0].length,
      ...rules[rule].tokenize(item),
    })),
    {
      start: md.length,
      end: md.length,
    },
  ];

  const tokens: mdTokens = [];

  rawToken.forEach((item, index) => {
    // we have a gap we need to fill with text
    if (index > 0 && rawToken[index - 1].end < item.start) {
      tokens.push(
        ...md2obj(md.slice(rawToken[index - 1].end, item.start), rule + 1)
      );
    }
    if ("type" in item) {
      const { start, end, ...rest } = item;
      tokens.push(rest);
    }
  });

  return tokens;
};
