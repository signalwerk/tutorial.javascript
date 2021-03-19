import React, { Reducer, createContext, useReducer, Dispatch } from "react";
import { ActionMap } from "./ActionMap";
import { data } from "./content/js-basics";

enum Action {
  NEXT_CHAPTER = "NEXT_CHAPTER",
  LAST_CHAPTER = "LAST_CHAPTER",
  SET_CHAPTER = "SET_CHAPTER",
  SET_STEP = "SET_STEP",
  SET_EDITOR_CONTENT = "SET_EDITOR_CONTENT",
  SET_EDITOR_SELECTION = "SET_EDITOR_SELECTION",
}

export type Selection = {
  start: number;
  end: number;
};

type ActionPayload = {
  [Action.NEXT_CHAPTER]: {};
  [Action.LAST_CHAPTER]: {};
  [Action.SET_CHAPTER]: {
    id: string;
  };
  [Action.SET_STEP]: {
    id: string;
  };
  [Action.SET_EDITOR_CONTENT]: {
    value: string;
  };
  [Action.SET_EDITOR_SELECTION]: {
    value: Selection;
  };
};

export type Actions = ActionMap<ActionPayload>[keyof ActionMap<ActionPayload>];

type Chapter = {
  id: string;
  title: string;
  steps?: Step[];
};

type Step = {
  id: string;
  title: string;
  intro: Intro;
  tasks: Task[];
};

type Intro = {
  editor: EditorFrame[];
  video: string;
};
type Task = {
  instruction: string;
  match: RegExp;
};

type Done = {
  chapter: string[];
  step: string[];
};

type EditorFrame = {
  time: number;
  editor: Editor;
};

type Editor = {
  selection: Selection;
  content: string;
};

type Current = {
  chapter: string;
  step: string;
  editor: Editor;
};

type State = {
  chapters: Chapter[];
  current: Current;
  done: Done;
};

const initialState: State = {
  ...data,
  current: {
    chapter: "functions",
    step: "functions.call",
    editor: {
      selection: { start: 0, end: 0 },
      content: "",
    },
  },
  done: {
    chapter: ["intro", "comments", "variables", "types", "operators"],
    step: ["functions.intro"],
  },
};

const reducer: Reducer<State, Actions> = (state, action) => {
  switch (action.type) {
    case Action.SET_CHAPTER:
      return {
        ...state,
        current: {
          ...state.current,
          chapter: action.payload.id,
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
    case Action.SET_STEP:
      return {
        ...state,
        current: {
          ...state.current,
          step: action.payload.id,
        },
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
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
