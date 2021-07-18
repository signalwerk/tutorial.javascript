import "./styles.css";
import { styles } from "../Editor/editor";

import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css"; //Example style, you can use another

import { EditorState } from "../../context/session";

type TextPlayerProps = {
  editor: EditorState | undefined;
};

enum PartType {
  TEXT = "TEXT",
  MARK = "MARK",
  TEXT_SELECTED = "TEXT_SELECTED",
}

type Part = {
  type: PartType;
  value: string;
};

type Line = Part[];

const showPart = (part: Part) => {
  switch (part.type) {
    case PartType.TEXT:
      return <span className="part part--text">{part.value}</span>;
    case PartType.MARK:
      return <span className="part part--mark">&#x200B;</span>;
    case PartType.TEXT_SELECTED:
      return <span className="part part--selected">{part.value}</span>;
    default:
  }
};

// const splitAt = index => x => [x.slice(0, index), x.slice(index)]

const showLines = (code: string, start: number, end: number) => {
  const hasCursor = start === end;
  let offset = 0;
  const lines: Line[] = code.split("\n").map((line: string) => {
    let parts = null;

    // there is just a cursor
    if (hasCursor) {
      // the cursor is in this line
      if (start >= offset && end <= offset + line.length) {
        parts = [
          {
            type: PartType.TEXT,
            value: line.slice(0, start - offset),
          },
          {
            type: PartType.MARK,
            value: "",
          },
          {
            type: PartType.TEXT,
            value: line.slice(end - offset),
          },
        ];
      }
      // no cursor in this line
      else {
        parts = [
          {
            type: PartType.TEXT,
            value: line,
          },
        ];
      }
    }
    // there is a selection
    else {
      // selection start of line
      if (start <= offset && end > offset) {
        parts = [
          {
            type: PartType.TEXT_SELECTED,
            value: line.slice(0, end - offset),
          },
          {
            type: PartType.TEXT,
            value: line.slice(end - offset),
          },
        ];
      }
      // selection in line
      else if (start >= offset && start < offset + line.length) {
        parts = [
          {
            type: PartType.TEXT,
            value: line.slice(0, start - offset),
          },
          {
            type: PartType.TEXT_SELECTED,
            value: line.slice(start - offset, end - offset),
          },
          {
            type: PartType.TEXT,
            value: line.slice(end - offset, line.length),
          },
        ];
      }
      // selection in other line
      else {
        parts = [
          {
            type: PartType.TEXT,
            value: line,
          },
        ];
      }
    }

    offset += line.length + 1;
    return parts;
  });

  return lines.map((line: Line, lineIndex: number) => (
    <div className="text-player__line" key={`line_${lineIndex}`}>
      <code>
        {line.map((part, partIndex: number) => (
          <span key={`line_${lineIndex}_part_${partIndex}`}>
            {showPart(part)}
          </span>
        ))}
      </code>
    </div>
  ));
};

function TextPlayer({ editor }: TextPlayerProps) {
  return (
    <div className="text-player code">
      <pre
        className="text-player__highlight"
        style={{ ...styles.editor, ...styles.highlight }}
        {...{
          dangerouslySetInnerHTML: {
            __html: highlight(editor.content, languages.js) + "<br />",
          },
        }}
      />
      <pre
        className="text-player__selection"
        style={{ ...styles.editor, ...styles.highlight }}
        aria-hidden="true"
      >
        {editor &&
          showLines(
            editor.content,
            editor.selection.start,
            editor.selection.end
          )}
      </pre>
    </div>
  );
}

export default TextPlayer;
