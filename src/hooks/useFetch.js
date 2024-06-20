// import { handleError } from "@/utils";
import { useEffect, useState } from "react";

const useFetch = (api, params, extra) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      if (typeof api === "function") {
        setLoading(true);
        try {
          const res = await api(params, extra, { signal });
          if (!signal.aborted) {
            setData(res.data);
            setError(null);
          }
        } catch (error) {
          if (!signal.aborted) {
            setError(error);
            // handleError(error);
          }
          console.error(error);
        } finally {
          if (!signal.aborted) {
            setLoading(false);
          }
        }
      }
    };
    fetchData();
    return () => {
      controller.abort();
    };
  }, [api, params, extra]);

  return { data, loading, error, setData };
};

export default useFetch;
