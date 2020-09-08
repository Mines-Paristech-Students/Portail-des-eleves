import { api, useBetterQuery } from "../../services/apiService";
import { Widget } from "./Widget";
import { TablerColor } from "../../utils/colors";
import { useWidgetConfig } from "./widgetConfig";
import { Loading } from "../utils/Loading";
import { ErrorMessage } from "../utils/ErrorPage";
import React from "react";
import { formatPrice } from "../../utils/format";
import "./widget_balance.css";

export const BalanceWidget = ({ ...props }) => {
  const { data, error, status } = useBetterQuery<any>(
    ["subsriptions.balance.get"],
    api.subscriptions.balances,
    { refetchOnWindowFocus: false }
  );

  const allBalancePostive =
    data && data.every((balance) => balance.balance >= 0);

  return (
    <Widget
      name={"Soldes associatifs"}
      color={allBalancePostive ? TablerColor.Green : TablerColor.Red}
      bodyWrapped={false}
      {...useWidgetConfig("balance")}
      {...props}
    >
      {status === "loading" ? (
        <Loading />
      ) : status === "error" ? (
        <ErrorMessage>`Une erreur est apparue: ${error}`</ErrorMessage>
      ) : status === "success" && data ? (
        <>
          {data.every((balance) => balance.balance >= 0) ? (
            <img
              className={"m-auto balance-gif"}
              src="/assets/balance/balance-positive.gif"
              alt="All balances are positive"
            />
          ) : (
            <img
              className={"m-auto balance-gif"}
              src="/assets/balance/balance-negative.gif"
              alt="Not all balance are positive"
            />
          )}
          <table className="table card-table border-top">
            <tbody>
              {data.map((balance) => (
                <tr>
                  <td>{balance.association.name}</td>
                  <td className="text-right">
                    <span
                      className={
                        balance.balance >= 0 ? "text-muted" : "text-danger"
                      }
                    >
                      {formatPrice(balance.balance)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}
    </Widget>
  );
};
