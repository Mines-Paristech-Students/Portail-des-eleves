import React, { useContext, useState } from "react";
import { ToastContext } from "../../../utils/Toast";
import { queryCache, useMutation } from "react-query";
import { api, useBetterQuery } from "../../../../services/apiService";
import { genericMutationErrorHandling } from "../../../../utils/genericMutationErrorHandling";
import { Loading } from "../../../utils/Loading";

export const SubscriptionForm = ({
  customer,
  marketplaceId,
  ...props
}) => {
  const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);
  const [isChecked, setIsChecked] = useState(false);
  const [updated, setUpdated] = useState(false);

  const [save] = useMutation(api.marketplace.subscription.update, {
    onSuccess: (entity) => {
      setUpdated(true);
      setIsChecked(entity.subscriber);
      sendSuccessToast("Compte modifié.");
      return queryCache.invalidateQueries(["marketplace.get", { marketplaceId }]);
    },
    onError: genericMutationErrorHandling(sendErrorToast),
  });

  let {data: subscriber, status, error} = useBetterQuery(
    ["marketplace.subscription", marketplaceId, customer.id],
    api.marketplace.subscription.get
  );

  if(status === "success" && isChecked !== (subscriber as {subscriber: boolean}).subscriber && !updated) {
    setIsChecked((subscriber as {subscriber: boolean}).subscriber);
  }

  console.log(isChecked);

  return status === "loading" ? (
    <Loading />
  ) : status === "error" ? (
    <em>Erreur {error}</em>
  ) : (
    <>
      <label>
          <input
            type="checkbox"
            className="custom-switch-input"
            checked={isChecked}
          />
          <span className="custom-switch-indicator" onClick={() => {
              save({
                marketplaceId: marketplaceId, 
                customerId: customer.id,
                subscriber: !isChecked
              });
          }} />
          <span className="custom-switch-description">
              Cotisant(e)
          </span>
      </label>
      
    </>
  );
};