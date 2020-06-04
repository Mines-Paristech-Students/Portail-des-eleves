import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

/**
 * Like useState (https://reactjs.org/docs/hooks-state.html), but saves the
 * value of the hook in the get parameters.
 * @param paramToWatch
 * @param defaultValue
 */
export function useURLState<T>(
    paramToWatch: string,
    defaultValue: T
): [T, (T) => void] {
    const location = useLocation();
    const history = useHistory();

    const [paramValue, setParamValue] = useState<T | null>();
    const stateIsString = typeof defaultValue === "string";

    const changeParam = (value) => {
        if (value === paramValue) {
            return;
        }

        setParamValue(value);

        const params = new URL(window.location.href).searchParams;
        value === defaultValue
            ? params.delete(paramToWatch)
            : params.set(
                  paramToWatch,
                  stateIsString ? value : JSON.stringify(value)
              );

        history.push(location.pathname + "?" + params.toString());
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);

        // Convert the object to a string using JSON because we don't know
        // what type of data we're working with in advance. Also helps to
        // cast non string value. For instance, "2" will become the number 2
        const urlParamValue = params.get(paramToWatch);
        if (urlParamValue !== null) {
            // TS isn't able to see that stateIsString true implies urlParamValue is a string
            setParamValue(
                // @ts-ignore
                stateIsString ? urlParamValue : (JSON.parse(urlParamValue) as T)
            );
        }

        // The param value must be taken from the URL only when the component
        // is loaded, that's why we don't set location.search as a dependency
        // eslint-disable-next-line
    }, [paramToWatch]);

    return [paramValue || defaultValue, changeParam];
}
