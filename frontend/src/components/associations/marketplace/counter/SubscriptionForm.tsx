import React, { useContext, useState } from "react";
import { ToastContext } from "../../../utils/Toast";

export const SubscriptionForm = ({
  subscriber,
  updateSubscription,
  customer,
  marketplaceId,
  ...props
}) => {
  return (
    <>
      <label className="mt-1 mb-5">
          <input
            type="checkbox"
            className="custom-switch-input"
            checked={subscriber}
          />
          <span className="custom-switch-indicator" onClick={() => {
              updateSubscription({
                marketplaceId: marketplaceId, 
                customerId: customer.id,
                subscriber: !subscriber
              });
          }} />
          <span className="custom-switch-description">
              Cotisant(e)
          </span>
      </label>
      
    </>
  );
};