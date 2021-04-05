import React, { Reducer, createContext, useReducer, Dispatch } from "react";
import { ActionMap } from "./ActionMap";
import { set } from "lodash";

enum Action {
  SET_CURRENT_STEP_FINISHED = "SET_CURRENT_STEP_FINISHED",
  SET_EDITOR_CONTENT = "SET_EDITOR_CONTENT",
  SET_EDITOR_SELECTION = "SET_EDITOR_SELECTION",
  SET_EDITOR_FOCUS = "SET_EDITOR_FOCUS",
}

export type Selection = {
  start: number;
  end: number;
};

type ActionPayload = {
  [Action.SET_CURRENT_STEP_FINISHED]: {
    chapter: string;
    step: string;
  };
  [Action.SET_EDITOR_CONTENT]: {
    chapter: string;
    step: string;
    value: string;
  };
  [Action.SET_EDITOR_SELECTION]: {
    value: Selection;
  };
  [Action.SET_EDITOR_FOCUS]: {
    value: boolean;
  };
};

export type Actions = ActionMap<ActionPayload>[keyof ActionMap<ActionPayload>];

// type Task = {
//   instruction: string;
//   match: string;
// };

type ChapterProgress = {
  done: boolean;
  steps: {
    [key: string]: StepProgress;
  };
};

type StepProgress = {
  done?: boolean;
  editor?: Editor;
};

export type EditorFrame = {
  time: number;
  editor: EditorState;
};

export type Editor = {
  content: string;
};

export type EditorState = {
  selection: Selection;
  content: string;
  focus: boolean;
};

type Current = {
  editor: EditorState;
};

type State = {
  current: Current;
  progress?: {
    [key: string]: ChapterProgress;
  };
};

const initialState: State = {
  current: {
    editor: {
      selection: { start: 0, end: 0 },
      content: "",
      focus: false,
    },
  },
  progress: {
    // intro: { done: false, steps: [] },
    // comments: { done: false, steps: [] },
    // variables: { done: false, steps: [] },
    // types: { done: false, steps: [] },
    // operators: { done: false, steps: [] },
    // functions: { done: false, steps: [] },
    // itterations: { done: false, steps: [] },
    // conditions: { done: false, steps: [] },
    // "advanced-types": { done: false, steps: [] },

    intro: {
      done: true,
      steps: { overview: { done: true }, function: { done: true } },
    },
    comments: { done: true, steps: {} },
    variables: { done: true, steps: {} },
    types: { done: true, steps: {} },
    operators: { done: true, steps: {} },
    functions: { done: false, steps: { overview: { done: true } } },
    itterations: { done: false, steps: {} },
    conditions: { done: false, steps: {} },
    "advanced-types": { done: false, steps: {} },
  },
};

const reducer: Reducer<State, Actions> = (state, action) => {
  switch (action.type) {
    case Action.SET_CURRENT_STEP_FINISHED:
      return (() => {
        const { chapter, step } = action.payload;
        const newPorgress = set(
          { ...state.progress } || {},
          [chapter, "steps", step, "done"],
          true
        );

        return {
          ...state,
          progress: {
            ...newPorgress,
          },
        };
      })();

    case Action.SET_EDITOR_CONTENT:
      return (() => {
        const { chapter, step, value } = action.payload;
        console.log({ chapter, step, value });
        const newPorgress = set(
          { ...state.progress } || {},
          [chapter, "steps", step, "editor", "content"],
          value
        );

        return {
          ...state,
          current: {
            ...state.current,
            editor: {
              ...state.current.editor,
              content: value,
            },
          },
          progress: {
            ...newPorgress,
          },
        };
      })();

    case Action.SET_EDITOR_SELECTION:
      return (() => {
        const { value } = action.payload;

        return {
          ...state,

          current: {
            ...state.current,
            editor: {
              ...state.current.editor,
              selection: value,
            },
          },
        };
      })();

    case Action.SET_EDITOR_FOCUS:
      return (() => {
        const { value } = action.payload;

        return {
          ...state,
          current: {
            ...state.current,
            editor: {
              ...state.current.editor,
              focus: value,
            },
          },
        };
      })();

    // default:
    //   throw new Error(`Unhandled action type: ${action && action.type}`);
  }
};

const Context = createContext<{
  state: State;
  dispatch: Dispatch<Actions>;
}>({
  state: initialState,
  dispatch: () => null,
});

const Provider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export { Provider, Context, Action };
