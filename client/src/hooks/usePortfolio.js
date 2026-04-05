import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export function usePortfolio() {
  const [data, setData] = useState(null);
  const [source, setSource] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPortfolio() {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/portfolio`);

        if (!response.ok) {
          throw new Error("Unable to load portfolio content.");
        }

        const payload = await response.json();

        if (!isMounted) {
          return;
        }

        setData(payload.data);
        setSource(payload.source);
        setMessage(payload.message || "");
        setError("");
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }

        setError(fetchError.message || "Something went wrong while loading the portfolio.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPortfolio();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    data,
    source,
    message,
    isLoading,
    error
  };
}

