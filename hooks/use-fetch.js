"use client";

import { useState, useCallback } from "react";

export default function useFetch(url) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchFn = useCallback(
    async (body) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const result = await response.json();
        setData(result);
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [url]
  );

  return { loading, data, error, fn: fetchFn };
}