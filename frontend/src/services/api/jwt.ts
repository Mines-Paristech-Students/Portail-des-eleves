import { AxiosResponse } from "axios";
import { apiService } from "../apiService";

export const jwt = {
    getToken: () =>
        apiService.get("/auth/jwt").then((response: AxiosResponse) => {
            return response.data.jwtToken;
        }),
};
