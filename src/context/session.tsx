import React, { Reducer, createContext, useReducer, Dispatch } from "react";
import { ActionMap } from "./ActionMap";

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

export type Chapter = {
  id: string;
  title: string;
};

export type Step = {
  id: string;
  title: string;
  tasks: Task[];
};

type Task = {
  instruction: string;
  match: string;
};

type ChapterProgress = {
  done: boolean;
  steps: string[];
};
type Progress = {
  // intro?: ChapterProgress;
  // comments?: ChapterProgress;
  // variables?: ChapterProgress;
  // types?: ChapterProgress;
  // operators?: ChapterProgress;
  // functions?: ChapterProgress;
  // itterations?: ChapterProgress;
  // conditions?: ChapterProgress;
  // "advanced-types"?: ChapterProgress;
  [key: string]: ChapterProgress; //is indexable; not a new property
};

export type EditorFrame = {
  time: number;
  editor: Editor;
};

export type Editor = {
  selection: Selection;
  content: string;
  focus: boolean;
};

type Current = {
  editor: Editor;
};

type State = {
  current: Current;
  progress?: Progress;
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

    intro: { done: true, steps: ["overview", "function"] },
    comments: { done: true, steps: [] },
    variables: { done: true, steps: [] },
    types: { done: true, steps: [] },
    operators: { done: true, steps: [] },
    functions: { done: false, steps: ["overview"] },
    itterations: { done: false, steps: [] },
    conditions: { done: false, steps: [] },
    "advanced-types": { done: false, steps: [] },
  },
};

const reducer: Reducer<State, Actions> = (state, action) => {
  switch (action.type) {
    case Action.SET_CURRENT_STEP_FINISHED:
      const { chapter, step } = action.payload;

      const newPorgress = state.progress || {};
      newPorgress[chapter] = newPorgress[chapter] || { done: false, steps: [] };
      newPorgress[chapter].steps = [...newPorgress[chapter].steps, step];

      return {
        ...state,
        progress: {
          ...newPorgress,
        },
      };

    case Action.SET_EDITOR_CONTENT:
      return {
        ...state,
        current: {
          ...state.current,
          editor: {
            ...state.current.editor,
            content: action.payload.value,
          },
        },
      };

    case Action.SET_EDITOR_SELECTION:
      return {
        ...state,
        current: {
          ...state.current,
          editor: {
            ...state.current.editor,
            selection: action.payload.value,
          },
        },
      };

    case Action.SET_EDITOR_FOCUS:
      return {
        ...state,
        current: {
          ...state.current,
          editor: {
            ...state.current.editor,
            focus: action.payload.value,
          },
        },
      };

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
