import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Like useState (https://reactjs.org/docs/hooks-state.html), but saves the
 * value of the hook in the url hash.
 * @param paramToWatch
 * @param defaultValue
 * @param toUrlConverter a function to convert the data into string
 * @param fromUrlConverter a function to convert the url string into data
 */
export function useURLState<T>(
  paramToWatch: string,
  defaultValue: T,
  toUrlConverter: (data: T) => string = JSON.stringify,
  fromUrlConverter: (data: string) => T = JSON.parse
): [T, (T) => void] {
  const location = useLocation();
  const [paramValue, setParamValue] = useState<T>(defaultValue);

  const changeParam = (value) => {
    // No change, don't do anything
    if (value === paramValue) {
      return;
    }

    setParamValue(value);

    // Change URL value
    const params = new URLSearchParams(
      // substr removes the hash tag at the beginning
      new URL(window.location.href).hash.substr(1)
    );
    const urlValue = toUrlConverter(value);
    value === defaultValue || urlValue === ""
      ? params.delete(paramToWatch)
      : params.set(paramToWatch, urlValue);

    /* Directly interact with the browser "history" object to bypass
     * react router page reloading on param change. This isn't allowed in
     * TS by default, so we have to disable the es-lint rule for one line */
    /*eslint no-restricted-globals: ["error", "event"]*/
    history.pushState(null, "", "#" + params.toString());
  };

  useEffect(() => {
    // substr removes the hash tag at the beginning
    const params = new URLSearchParams(location.hash.substr(1));
    // Convert the object to a string using JSON because we don't know
    // what type of data we're working with in advance. Also helps to
    // cast non string value. For instance, "2" will become the number 2
    const paramJSONValue = params.get(paramToWatch);
    if (paramJSONValue !== null) {
      setParamValue(fromUrlConverter(paramJSONValue));
    }

    // The param value must be taken from the URL only when the component
    // is loaded, that's why we don't set location.search as a dependency
    // eslint-disable-next-line
  }, [paramToWatch]);

  return [paramValue || defaultValue, changeParam];
}
