import { useContext, useEffect, useState } from "react";
import { useMultiUserSelector } from "../../../utils/MultiUserSelector";
import { api } from "../../../../services/apiService";
import { ToastContext } from "../../../utils/Toast";

export const RegistrationList = ({ election }) => {
  const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);
  const [initialized, setInitialized] = useState(false);

  const sendToast = (promise) => {
    promise
      .then(() => {
        sendSuccessToast("Liste des électeurs sauvegardée");
      })
      .catch((err) => {
        sendErrorToast(
          "Erreur lors de la sauvegarde de la liste des electeurs " +
            err.toString()
        );
      });
  };

  const onAddVoter = (userId) => {
    sendToast(api.elections.voters.add(election, userId));
  };

  const onRemoveVoter = (userId) => {
    sendToast(api.elections.voters.remove(election, userId));
  };

  const { setUsers, MultiUserSelector } = useMultiUserSelector(
    onAddVoter,
    onRemoveVoter
  );

  useEffect(() => {
    if (election.voters !== undefined && !initialized) {
      setUsers(election.voters.map((v) => v.user));
      setInitialized(true);
    }
  }, [election.voters, setUsers, initialized]);

  return MultiUserSelector;
};
