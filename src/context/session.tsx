import React, { Reducer, createContext, useReducer, Dispatch } from "react";
import { ActionMap } from "./ActionMap";
import { data } from "./content/js-basics";

enum Action {
  NEXT_CHAPTER = "NEXT_CHAPTER",
  LAST_CHAPTER = "LAST_CHAPTER",
  SET_CHAPTER = "SET_CHAPTER",
}

type ActionPayload = {
  [Action.NEXT_CHAPTER]: {};
  [Action.LAST_CHAPTER]: {};
  [Action.SET_CHAPTER]: {
    id: string;
  };
};

export type Actions = ActionMap<ActionPayload>[keyof ActionMap<ActionPayload>];

type Chapter = {
  id: string;
  title: string;
};

type Step = {
  id: string;
  title: string;
  intro: Intro;
  tasks: Task[];
};

type Intro = {
  editor: string;
  video: string;
};
type Task = {
  instruction: string;
  match: RegExp;
};

type Current = {
  chapter: string;
  step: string;
};

type State = {
  chapters: Chapter[];
  current: Current;
  done: string[];
};

const initialState: State = {
  ...data,
  current: {
    chapter: "functions",
    step: "functions.intro",
  },
  done: ["intro", "comments", "variables", "types", "operators"],
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
