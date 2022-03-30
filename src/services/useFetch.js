import { useState, useEffect, useRef } from "react";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

/**
 * A Custom hook can reduce the repeatitive work.
 * Here in this example we can use this hook to make API calls in multiple components.
 * Also the loading state and error handling is made easy by using this.
 * At the end we have to return the data in an array format.
 */

export default function useFetch(url) {
  const isMounted = useRef(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    isMounted.current = true;
    const init = async () => {
      try {
        const response = await fetch(baseUrl + url);
        if (response.ok) {
          const jsonResponse = await response.json();
          if (isMounted.current) setData(jsonResponse);
        } else {
          throw response;
        }
      } catch (e) {
        if (isMounted.current) setError(e);
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };
    init();

    // any function that is returned from useEffect is used for cleanup.
    // So when the component will unmount, this function will be called.
    return () => {
      isMounted.current = false;
    };
  }, [url]);
  return { data, error, loading };
}
