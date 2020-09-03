import { useURLState } from "../../utils/useURLState";
import dayjs from "dayjs";
import DayPickerInput from "react-day-picker/DayPickerInput";
import React, { useEffect } from "react";
import { SidebarSection } from "./sidebar/SidebarSection";
dayjs.extend(require("dayjs/plugin/customParseFormat"));

export const DateSearch = ({ setDateParams }) => {
  const [date, setDate] = useURLState<Date | null>(
    "date",
    null,
    (data) => (data ? dayjs(data).format("DD-MM-YYYY") : ""),
    (data) =>
      data !== "" ? dayjs(data, "DD-MM-YYYY").hour(0).minute(0).toDate() : null
  );

  const parseFormats = ["DD/MM/YYYY"];
  const displayFormat = "DD/MM/YYYY";
  // Format a date to display in the input.
  const formatDate = (date) => dayjs(date).format(displayFormat);

  // Parse a date from the input.
  const parseDate = (dateString) => {
    // @ts-ignore: the ability to use a `string[]` as `format` was introduced in 1.8.27 and the types have not
    // been updated yet.
    const d = dayjs(dateString, parseFormats);

    // `undefined` is used when there is an invalid date.
    return d.isValid() ? d.toDate() : undefined;
  };

  // Called when the user types into the input field or when a day is clicked on the calendar.
  const handleDayChange = (selectedDay) => {
    if (selectedDay) {
      setDate(selectedDay);
    } else {
      setDate(null);
    }
  };

  useEffect(() => {
    if (date) {
      const selectedDate = dayjs(date);
      console.log(selectedDate);
      setDateParams({
        uploaded_on__year: selectedDate.year(),
        uploaded_on__month: selectedDate.month() + 1,
        uploaded_on__day: selectedDate.date(),
      });
    } else {
      setDateParams({});
    }
  }, [date]);

  return (
    <SidebarSection
      key={"date"}
      title={"Date"}
      retractable={false}
      retractedByDefault={false}
    >
      <DayPickerInput
        value={date ?? ""}
        formatDate={formatDate}
        parseDate={parseDate}
        onDayChange={handleDayChange}
        inputProps={{
          className: `form-control w-100`,
          placeholder: "JJ/MM/YYYY",
        }}
        style={{ display: "block" }}
      />
    </SidebarSection>
  );
};
