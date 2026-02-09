import { useSearchParams } from "react-router-dom";

export function useUrlState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const get = (key: string, defaultValue: string = "") =>
    searchParams.get(key) ?? defaultValue;

  const set = (key: string, value: string | number | boolean | null, { replace = false } = {}) => {
    const next = new URLSearchParams(searchParams as any);

    if (value === "" || value == null) {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }

    // DEBUG: show what we are writing to the URL
    // eslint-disable-next-line no-console
    console.debug("useUrlState.set ->", { key, value, next: next.toString(), replace });

    setSearchParams(next, { replace });
  };

  const setMany = (values: Record<string, string | number | boolean | null>, { replace = false } = {}) => {
    const next = new URLSearchParams(searchParams as any);

    Object.entries(values).forEach(([key, value]) => {
      if (value === "" || value == null) {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });

    // DEBUG: show what we are writing to the URL
    // eslint-disable-next-line no-console
    console.debug("useUrlState.setMany ->", { values, next: next.toString(), replace });

    setSearchParams(next, { replace });
  };

  return { get, set, setMany };
}
