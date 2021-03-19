import React, { useContext } from "react";
import "./styles.css";
import Window from "../Window";
import WorkSpace from "../WorkSpace";
import VideoPlayer from "../VideoPlayer";
import {
  Context as SessionContext,
  Action as SessionAction,
  Editor,
  Selection,
} from "../../context/session";

type PlayerProps = {
  editor: Editor | undefined;
  filename: string;
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
      break;
    case PartType.MARK:
      return <span className="part part--mark">&#x200B;</span>;
      break;
    case PartType.TEXT_SELECTED:
      return <span className="part part--selected">{part.value}</span>;
      break;
    default:
  }
};

// const splitAt = index => x => [x.slice(0, index), x.slice(index)]

const showLines = (code: string, start: number, end: number) => {
  const hasCursor = start === end;
  let offset = 0;
  const lines: Line[] = code.split("\n").map((line: string) => {
    // length = line.length;
    // const startsWithMark =
    console.log({ offset, start, end });

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
    <div key={`line_${lineIndex}`}>
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

function Player({ editor, filename }: PlayerProps) {
  const { state, dispatch } = useContext(SessionContext);

  const pos = state.current.playPosition;

  // chapter: state.current.chapter,
  // step: state.current.step,

  return (
    <div className="player">
      <div className="player__code">
        <WorkSpace preview={editor?.content || ""} hideErrors={true}>
          <Window filename={filename}>
            <div className="player__editor">
              <div className="player__text">
                <pre>
                  {editor &&
                    showLines(
                      editor.content,
                      editor.selection.start,
                      editor.selection.end
                    )}
                </pre>
              </div>
            </div>
            <VideoPlayer />
          </Window>
        </WorkSpace>
      </div>
      <div className="player__video code"></div>
    </div>
  );
}

export default Player;
