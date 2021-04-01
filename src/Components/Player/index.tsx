import React, { useContext, useState } from "react";
import "./styles.css";
import WorkSpace from "../WorkSpace";
import VideoPlayer from "../VideoPlayer";
import Preview from "../Preview";
import TextPlayer from "../TextPlayer";
import useFetch from "../../util/useFetch";
import { useParams } from "react-router-dom";
import { RouterParams } from "../../index";

import {
  Context as SessionContext,
  Action as SessionAction,
  Editor,
  Selection,
  Step,
  EditorFrame,
} from "../../context/session";

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

/**
 * Returns the index of the last element in the array where predicate is true, and -1
 * otherwise.
 * @param array The source array to search in
 * @param predicate find calls predicate once for each element of the array, in descending
 * order, until it finds one where predicate returns true. If such an element is found,
 * findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
 */
export function findLastIndex<T>(
  array: Array<T>,
  predicate: (value: T, index: number, obj: T[]) => boolean
): number {
  let l = array.length;
  while (l--) {
    if (predicate(array[l], l, array)) return l;
  }
  return -1;
}

function Player() {
  const { state, dispatch } = useContext(SessionContext);
  let { chapter, step } = useParams<RouterParams>();

  const [pos, setPos] = useState(0);

  // const pos = state.current.playPosition;

  const { response: editorFrames, loading, hasError } = useFetch<EditorFrame[]>(
    `/api/course/js/basic/chapter/${chapter}/${step}.json`
  );

  const editorFramePosPos = editorFrames
    ? findLastIndex(editorFrames, (item) => item.time <= pos * 1000)
    : 0;

  const editorFramePos = editorFrames ? editorFrames[editorFramePosPos] : false;

  return (
    <div className="player">
      <div className="player__content">
        <div className="player__video">
          <VideoPlayer
            onTimeUpdate={(t: number) => setPos(t)}
            src={`./movies/${chapter}/${step}.mp4`}
          />
        </div>
        <div className="player__code">
          {(!hasError && editorFramePos && (
            <TextPlayer editor={editorFramePos.editor} />
          )) || <span>Error beim laden des Editor-Players</span>}
        </div>
        <div className="player__preview">
          {!hasError && editorFramePos && (
            <Preview code={editorFramePos.editor.content} hideErrors={true} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Player;
