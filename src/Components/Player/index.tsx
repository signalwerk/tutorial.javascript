import React, { useContext, useState } from "react";
import "./styles.css";
import VideoPlayer from "../VideoPlayer";
import Preview from "../Preview";
import TextPlayer from "../TextPlayer";
import useFetch from "../../util/useFetch";
import { useParams } from "react-router-dom";
import { RouterParams } from "../../index";
import { URL } from "../../util/api";

import { EditorFrame } from "../../context/session";
import { Context as CourseContext } from "../../context/course";

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
  const {
    state: { lang },
  } = useContext(CourseContext);
  let { chapter, step } = useParams<RouterParams>();

  const [pos, setPos] = useState(0);

  // const pos = state.current.playPosition;

  const { response: editorFrames, hasError } = useFetch<EditorFrame[]>(
    URL.step({ chapter, step })
  );

  const editorFrameIndex = editorFrames
    ? findLastIndex(editorFrames, (item) => item.time <= pos * 1000)
    : 0;

  const editorFramePos = editorFrames ? editorFrames[editorFrameIndex] : false;

  return (
    <div className="player">
      <div className="player__content">
        <div className="player__video">
          <VideoPlayer
            onTimeUpdate={(t: number) => setPos(t)}
            src={URL.movie({ chapter, step })}
          />
        </div>
        <div className="player__code">
          {(!hasError && editorFramePos && (
            <TextPlayer editor={editorFramePos.editor} />
          )) || <span>{lang["video.error"]}</span>}
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
