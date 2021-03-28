// https://usehooks-typescript.com/react-hook/use-fetch

import React, { useState, useEffect } from "react";

function useFetch<T = unknown>(url: string, options?: object) {
  const [response, setResponse] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  useEffect(() => {
    setLoading(true);

    fetch(url, options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      })
      .then((data: T) => {
        if (data) {
          setResponse(data);
        }
        setHasError(false);
        setLoading(false);
      })
      .catch(() => {
        setResponse(null);
        setHasError(true);
        setLoading(false);
      });
  }, [url]);
  return { response, loading, hasError };
}

export default useFetch;
