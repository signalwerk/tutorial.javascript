// https://usehooks-typescript.com/react-hook/use-fetch

import React, {
  useState,
  useEffect,
  useReducer,
  useCallback,
  Reducer,
  useRef,
} from "react";

import usePrevious from "./usePrevious";

interface InitialState<T = any> {
  data: T;
  isLoading: boolean;
  error: unknown;
}

type ActionTypes<T> =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: InitialState<T>["data"] }
  | { type: "FETCH_ERROR"; payload: InitialState<T>["error"] };

const initialState: InitialState = {
  data: null,
  isLoading: false,
  error: null,
};

type FetchReducer<T = any> = Reducer<InitialState<T>, ActionTypes<T>>;

const fetchReducer: FetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START": {
      return { data: null, isLoading: true, error: null };
    }
    case "FETCH_SUCCESS": {
      return { data: action.payload, isLoading: false, error: null };
    }

    case "FETCH_ERROR": {
      return { data: null, isLoading: false, error: action.payload };
    }
    default:
      return state;
  }
};

function useFetch<T = unknown>(url: string, options?: object) {
  const previousUrl = usePrevious(url);

  // const [response, setResponse] = useState<T | null>(null);
  // const [loading, setLoading] = useState<boolean>(false);
  // const [hasError, setHasError] = useState<boolean>(false);

  const [state, dispatch] = useReducer<FetchReducer<T>>(
    fetchReducer,
    initialState
  );

  const getFetchResult = useCallback(async () => {
    dispatch({ type: "FETCH_START" });

    fetch(url, options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      })
      .then((data: T) => {
        dispatch({ type: "FETCH_SUCCESS", payload: (data as unknown) as T });
      })
      .catch(() => {
        dispatch({ type: "FETCH_ERROR", payload: true });
      });
  }, [url]);

  useEffect(() => {
    getFetchResult();
  }, [url]);

  // let's not wait for the lifecycle
  if (previousUrl !== url) {
    return { response: null, loading: true, hasError: false };
  }

  return {
    response: state.data,
    loading: state.isLoading,
    hasError: state.error,
  };
}

export default useFetch;

// import { useReducer, Reducer } from "react";
// import { useCallbackOne } from "use-memo-one";

// import { ApiOptions } from "./types";
// import { fakeApi as api } from "./fakeApi";

// const fetchReducer: FetchReducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_START": {
//       return { data: null, isLoading: true, error: null };
//     }
//     case "FETCH_SUCCESS": {
//       return { data: action.payload, isLoading: false, error: null };
//     }

//     case "FETCH_ERROR": {
//       return { data: null, isLoading: false, error: action.payload };
//     }
//     default:
//       return state;
//   }
// };

// export const useFetch = <T>(
//   initial: ApiOptions
// ): [InitialState<T>, (overrides: ApiOptions) => Promise<void>] => {
//   const [state, dispatch] = useReducer<FetchReducer<T>>(
//     fetchReducer,
//     initialState
//   );

//   const getFetchResult = useCallback(
//     async (overrides: ApiOptions) => {
//       dispatch({ type: "FETCH_START" });
//       try {
//         const result = await api({ ...initial, ...overrides });
//         dispatch({ type: "FETCH_SUCCESS", payload: (result as unknown) as T });
//       } catch (err) {
//         dispatch({ type: "FETCH_ERROR", payload: err });
//       }
//     },
//     [initial]
//   );

//   return [state, getFetchResult];
// };
