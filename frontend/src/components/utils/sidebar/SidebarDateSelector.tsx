import { api, useBetterQuery } from "../../../services/apiService";
import { useURLState } from "../../../utils/useURLState";
import { Loading } from "../Loading";
import { ErrorMessage } from "../ErrorPage";
import { CheckboxField } from "./CheckboxField";
import { SidebarSection } from "./SidebarSection";
import React, { useEffect } from "react";
import { MONTHS, MONTHS_SHORT } from "../../../utils/format";

export const SidebarDateSelector = ({ association, setParams }) => {
    const { data, status, error } = useBetterQuery<{
        min: Date | null;
        max: Date | null;
    }>(["media.upload.bounds", association.id], api.medias.getUploadBounds);

    const [selectedYears, setSelectedYears] = useURLState(
        "year",
        [] as string[],
        (data) => data.join("-"),
        (data) => data.split("-")
    );

    const [selectedMonths, setSelectedMonths] = useURLState(
        "month",
        [] as string[],
        (data) => data.map((m) => MONTHS_SHORT[MONTHS.indexOf(m)]).join("-"),
        (data) => data.split("-").map((m) => MONTHS[MONTHS_SHORT.indexOf(m)])
    );

    const availableYears =
        data && data.min && data.max
            ? Array.from(
                  {
                      length:
                          data.max.getFullYear() + 1 - data.min.getFullYear(),
                  },
                  (_, k) =>
                      (k + (data.min || new Date()).getFullYear()).toString()
              )
            : [];

    const updateYear = (year, checked) => {
        setSelectedYears(
            checked
                ? [...selectedYears, year]
                : selectedYears.filter((v) => v !== year)
        );
    };

    const updateMonth = (month, checked) => {
        setSelectedMonths(
            checked
                ? [...selectedMonths, month]
                : selectedMonths.filter((v) => v !== month)
        );
    };

    useEffect(() => {
        setParams({
            ...(selectedMonths.length > 0
                ? { uploaded_on__month__in: selectedMonths.map(m => MONTHS.indexOf(m) + 1) }
                : {}),
            ...(selectedYears.length > 0
                ? { uploaded_on__year__in: selectedYears }
                : {}),
        });
    }, [selectedYears, selectedMonths]);

    return status === "loading" ? (
        <Loading />
    ) : status === "error" ? (
        <ErrorMessage>{error}</ErrorMessage>
    ) : status === "success" && data ? (
        <>
            <SidebarSection
                retractable={true}
                title="Année"
                retractedByDefault={false}
            >
                {availableYears.map((year) => (
                    <CheckboxField
                        label={year}
                        state={selectedYears.includes(year)}
                        onChange={(checked) => updateYear(year, checked)}
                        key={year}
                    />
                ))}
            </SidebarSection>

            <SidebarSection
                retractable={true}
                title="Mois"
                retractedByDefault={false}
            >
                {MONTHS.map((month) => (
                    <CheckboxField
                        label={month}
                        state={selectedMonths.includes(month)}
                        onChange={(checked) => updateMonth(month, checked)}
                        key={month}
                    />
                ))}
            </SidebarSection>
        </>
    ) : null;
};
