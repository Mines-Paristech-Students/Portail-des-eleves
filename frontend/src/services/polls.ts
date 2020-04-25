import axios from "axios";

import { Poll } from "../models/polls";
import { useEffect, useState } from "react";
import { APIService, APIServiceStatus, baseEndpoint } from "./api_service";
import { polls } from "../fixtures/polls";

export function useListPollsService() {
    const [result, setResult] = useState<APIService<Poll[]>>({
        status: APIServiceStatus.Loading
    });

    /*useEffect(() => {
        axios
            .get(baseEndpoint + "/polls/")
            .then(response => setResult({status: APIServiceStatus.Loaded, payload: response.data}))
            .catch(error => setResult({status: APIServiceStatus.Error, error: error}));
    }, []);

    return result;*/
    return { status: APIServiceStatus.Loaded, payload: polls } as APIService<
        Poll[]
    >;
}

export function useListUserPollsService() {
    return { status: APIServiceStatus.Loaded, payload: polls } as APIService<
        Poll[]
    >;
}

export function useListPollsServiceAdmin() {
    return { status: APIServiceStatus.Loaded, payload: polls } as APIService<
        Poll[]
    >;
}
