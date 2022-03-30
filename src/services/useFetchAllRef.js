import { useState, useEffect, useRef } from "react";

/** 
 * Everytime the Cart component is rendered the urls are getting generated and if we add it to our useEffect dependency array it will cause an infinite loop of calls.
 * So to avoid that we kept the dependency array of useEffect empty and we have to disable the ESlint warning forcefully.
 * But actually this useEffect should be dependent on the urls and it should run whenever the urls are chnged.
 * So to avoid this problem we have to use useRef as it will not cause rerender of the component when its value is changed.
 * We can store the previous set of urls, and if the currentl urls are not same as previous then only we will execute the call.
 * 
*/
export default function useFetchAll(urls) {
  const prevUrls = useRef([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only runs if the array of URLs passed in, differs form the previous
    if(areEqual(prevUrls.current, urls)) {
      setLoading(false);
      return;
    }
    prevUrls.current = urls;

    const promises = urls.map((url) =>
      fetch(process.env.REACT_APP_API_BASE_URL + url).then((response) => {
        if (response.ok) return response.json();
        throw response;
      })
    );

    Promise.all(promises)
      .then((json) => setData(json))
      .catch((e) => {
        console.error(e);
        setError(e);
      })
      .finally(() => setLoading(false));
  }, [urls]);

  return { data, loading, error };
}

function areEqual(array1, array2) {
  return (
    array1.length === array2.length &&
    array1.every((value, index) => value === array2[index])
  );
}
