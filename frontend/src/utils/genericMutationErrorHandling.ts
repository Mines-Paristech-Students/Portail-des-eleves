import { AxiosError } from "axios";

export const genericMutationErrorHandling = (sendErrorToast) => (
  errorAsUnknown
) => {
  const error = errorAsUnknown as AxiosError;

  sendErrorToast(
    `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${
      error.response === undefined
        ? ""
        : "Détails : " + JSON.stringify(error.response.data)
    }`
  );
};
