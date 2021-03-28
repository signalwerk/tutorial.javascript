import React, { Reducer, createContext, useReducer, Dispatch } from "react";
import { ActionMap } from "./ActionMap";

enum Action {
  SET_CURRENT_STEP_FINISHED = "SET_CURRENT_STEP_FINISHED",
  SET_EDITOR_CONTENT = "SET_EDITOR_CONTENT",
  SET_EDITOR_SELECTION = "SET_EDITOR_SELECTION",
}

export type Selection = {
  start: number;
  end: number;
};

type ActionPayload = {
  [Action.SET_CURRENT_STEP_FINISHED]: {};
  [Action.SET_EDITOR_CONTENT]: {
    value: string;
  };
  [Action.SET_EDITOR_SELECTION]: {
    value: Selection;
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
  // intro: Intro;
  tasks: Task[];
};

type Task = {
  instruction: string;
  match: string;
};

type Done = {
  chapter: string[];
  step: string[];
};

export type EditorFrame = {
  time: number;
  editor: Editor;
};

export type Editor = {
  selection: Selection;
  content: string;
};

type Current = {
  editor: Editor;
};

type State = {
  current: Current;
  done: Done;
};

const initialState: State = {
  current: {
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
    // case Action.SET_CURRENT_STEP_FINISHED:
    //   let step = [];

    //   if (!state.done.step.includes(state.current.step)) {
    //     return {
    //       ...state,
    //       done: {
    //         ...state.done,
    //         step: [...state.done.step, state.current.step],
    //       },
    //     };
    //   } else {
    //     return state;
    //   }

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
