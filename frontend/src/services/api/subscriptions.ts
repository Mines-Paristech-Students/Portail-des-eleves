import { apiService, unwrap } from "../apiService";
import { toUrlParams } from "../../utils/urlParam";

export const subscriptions = {
  config: {
    get: () =>
      unwrap<any>(
        apiService.get("/subscriptions/subscriptions/get/")
      ).then((content) => JSON.parse(content["payload"])),
    set: (config) =>
      unwrap<any>(
        apiService.post("/subscriptions/subscriptions/set/", {
          payload: JSON.stringify(config),
        })
      ),
  },

  birthdays: () =>
    unwrap<any>(apiService.get("/subscriptions/birthday/")).then(
      (res) => res.birthdays
    ),

  timeline: () =>
    unwrap<any>(apiService.get("/subscriptions/timeline/")).then(
      (res) => res.timeline
    ),

  polls: (params) =>
    unwrap<any>(
      apiService.get(`/subscriptions/poll/${toUrlParams(params)}`)
    ).then((res) => res.polls),

  balances: () =>
    unwrap<any>(apiService.get(`/subscriptions/balance/`)).then(
      (res) => res.balances
    ),

  calendar: () =>
    unwrap<any>(apiService.get(`/subscriptions/calendar/`)).then(
      (res) => res.events
    ),
};
