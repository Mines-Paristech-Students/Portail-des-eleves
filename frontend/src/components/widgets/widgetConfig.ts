import { api, useBetterQuery } from "../../services/apiService";
import { queryCache, useMutation } from "react-query";
import { useContext } from "react";
import { ToastContext } from "../utils/Toast";

export const useWidgetConfig = (widgetName) => {
  const { sendSuccessToast, sendInfoToast, sendErrorToast } = useContext(
    ToastContext
  );

  const { data: config } = useBetterQuery<any>(
    ["subscriptions.config.get"],
    api.subscriptions.config.get
  );

  const [setConfig] = useMutation(api.subscriptions.config.set, {
    onMutate: () => sendInfoToast("Modification en cours…"),
    onSuccess: () => {
      sendSuccessToast("Préférences enregistrées !");
      queryCache.invalidateQueries("subscriptions.config.get");
    },
    onError: () => sendErrorToast("Une erreur est survenue."),
  });

  return {
    config:
      config && config.hasOwnProperty(widgetName) ? config[widgetName] : {},
    setConfig: (newConfig) => {
      console.log(newConfig);
      setConfig({ ...config, [widgetName]: newConfig });
    },
  };
};
