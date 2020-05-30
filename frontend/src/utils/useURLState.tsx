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

    const changeParam = (value) => {
        if (value === paramValue) {
            return;
        }

        setParamValue(value);

        const params = new URL(window.location.href).searchParams;
        value === defaultValue
            ? params.delete(paramToWatch)
            : params.set(paramToWatch, value);

        history.push(location.pathname + "?" + params.toString());
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);

        // Convert the object to a string using JSON because we don't know
        // what type of data we're working with in advance. Also helps to
        // cast non string value. For instance, "2" will become the number 2
        const paramJSONValue = params.get(paramToWatch);
        if (paramJSONValue !== null) {
            setParamValue(JSON.parse(paramJSONValue) as T);
        }

        // The param value must be taken from the URL only when the component
        // is loaded, that's why we don't set location.search as a dependency
        // eslint-disable-next-line
    }, [paramToWatch]);

    return [paramValue || defaultValue, changeParam];
}
