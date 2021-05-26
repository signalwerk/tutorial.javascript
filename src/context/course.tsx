import React, {
  Reducer,
  createContext,
  useReducer,
  Dispatch,
  useEffect,
} from "react";
import { ActionMap } from "./ActionMap";
import { URL } from "../util/api";

enum Action {
  ADD_LANG = "ADD_LANG",
  SET_CHAPTERS = "SET_CHAPTERS",
}

type ActionPayload = {
  [Action.ADD_LANG]: {
    lang: {
      [key: string]: string;
    };
  };
  [Action.SET_CHAPTERS]: {
    chapters: Chapter[];
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
  task: Task;
};

type Task = {
  instruction: string;
  match?: string;
  check?: string;
};

type State = {
  chapters: Chapter[];
  lang: {
    [key: string]: string;
  };
};

const initialState: State = {
  chapters: [],
  lang: {},
};

const reducer: Reducer<State, Actions> = (state, action) => {
  switch (action.type) {
    case Action.ADD_LANG:
      return (() => {
        const { lang } = action.payload;

        return {
          ...state,
          lang: {
            ...state.lang,
            ...lang,
          },
        };
      })();
    case Action.SET_CHAPTERS:
      return (() => {
        const { chapters } = action.payload;

        return {
          ...state,
          chapters,
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

  useEffect(() => {
    // setLoading(true);

    fetch(URL.course)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      })
      .then((data: State) => {
        if (data) {
          dispatch({
            type: Action.SET_CHAPTERS,
            payload: {
              chapters: data.chapters,
            },
          });
          dispatch({
            type: Action.ADD_LANG,
            payload: {
              lang: data.lang,
            },
          });
        }
      });
    //   .catch(() => {
    //     setResponse(null);
    //     setHasError(true);
    //     setLoading(false);
    //   });
  }, [URL.course]);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export { Provider, Context, Action };
