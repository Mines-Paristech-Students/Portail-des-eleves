import { apiService, unwrap } from "../apiService";

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

  polls: () =>
    unwrap<any>(apiService.get("/subscriptions/poll/")).then(
      (res) => res.activePolls
    ),
};
