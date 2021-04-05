import React, { useContext, useEffect } from "react";
import WorkSpace from "../WorkSpace";
import Callout from "../Callout";
import StatusIcon from "../StatusIcon";
import Markdown from "../Markdown";
import useFetch from "../../util/useFetch";
import { RouterParams } from "../../index";
import { useParams } from "react-router-dom";

import "./styles.css";
import {
  Context as SessionContext,
  Action as SessionAction,
} from "../../context/session";
import { Context as CourseContext } from "../../context/course";

import { Step, Chapter } from "../../context/course";
import { URL, ROUTE } from "../../util/api";

import CapterMenu from "../CapterMenu";
import StepMenu from "../StepMenu";
import Player from "../Player";
import Editor from "../Editor";
import Content from "../Content";

export function findNextIndex<T>(
  array: Array<T>,
  predicate: (value: T, index: number, obj: T[]) => boolean
): number {
  let l = array.length;

  const index = array.findIndex(predicate);

  if (index >= 0 && index < l - 1) {
    return index + 1;
  }

  return -1;
}

function Viewer() {
  const {
    state: appState,
    state: { lang },
  } = useContext(CourseContext);
  const { state, dispatch } = useContext(SessionContext);
  let { chapter, step } = useParams<RouterParams>();

  const { response: steps, loading, hasError } = useFetch<Step[]>(
    URL.chapter({ chapter })
  );

  const currentStepData = steps?.find((item) => item.id === step);

  const currentStepProgress =
    state.progress && state.progress[chapter]?.steps[step];

  const isSolved = currentStepProgress?.done;

  const content =
    (state.progress && state.progress[chapter]?.steps[step]?.editor?.content) ||
    "";

  // find next step
  let next = "";
  const nextStepIndex =
    (steps && findNextIndex<Step>(steps, (item) => item.id === step)) || 0;
  if (steps && nextStepIndex > 0) {
    next = ROUTE.step({ chapter, step: steps[nextStepIndex].id });
  } else if (steps && chapter) {
    const nextChapterIndex =
      (appState.chapters &&
        findNextIndex<Chapter>(
          appState.chapters,
          (item) => item.id === chapter
        )) ||
      0;

    if (appState.chapters && nextChapterIndex > 0) {
      next = ROUTE.chapterFirstStep({
        chapter: appState.chapters[nextChapterIndex].id,
      });
    }
  }

  useEffect(() => {
    const match = currentStepData?.tasks[0].match;
    if (match) {
      const regexParts = match.match(new RegExp("^/(.*?)/([gimy]*)$"));
      if (regexParts?.length === 3) {
        const regex = new RegExp(regexParts[1], regexParts[2]);

        const finished = regex.test(content);

        if (isSolved !== finished) {
          dispatch({
            type: SessionAction.SET_CURRENT_STEP_PROGRESS,
            payload: {
              chapter,
              step,
              value: finished,
            },
          });

          const completeSteps = steps?.filter((item) => {
            if (item.id === step) {
              return finished;
            }
            return (
              state.progress &&
              state.progress[chapter]?.steps[item.id] &&
              state.progress[chapter]?.steps[item.id].done
            );
          });

          const isChapterComplete = completeSteps?.length === steps?.length;

          dispatch({
            type: SessionAction.SET_CURRENT_CHAPTER_PROGRESS,
            payload: {
              chapter,
              value: isChapterComplete,
            },
          });
        }
      }
    }
  }, [content]);

  return (
    <div className="viewer">
      <div className="viewer__chapter-menu">
        <CapterMenu />
      </div>
      <div className="viewer__content">
        <div className="viewer__step-menu">
          <div className="viewer__step-menu-inner">
            {steps && <StepMenu steps={steps} />}
            {loading && <span> {lang["step.loading"]}</span>}
            {hasError && <span> {lang["step.error"]}</span>}
          </div>
        </div>
        <div className="viewer__step">
          <div className="viewer__teach">
            <Content className="viewer__teach-inner">
              <Player />
            </Content>
          </div>
          <div className="viewer__task">
            <Content>
              <Callout done={isSolved || false} next={next}>
                <div className="viewer__task-text">
                  <h2>
                    {isSolved && <StatusIcon />}
                    {lang["step.task"]}
                  </h2>
                  <p>
                    {currentStepData && (
                      <Markdown text={currentStepData.tasks[0].instruction} />
                    )}
                  </p>
                </div>
              </Callout>
            </Content>
          </div>
          <div className="viewer__learn">
            <Content>
              <WorkSpace
                preview={currentStepProgress?.editor?.content || ""}
                focus={state.current.editor.focus}
              >
                <Editor content={content} />
              </WorkSpace>
            </Content>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Viewer;
