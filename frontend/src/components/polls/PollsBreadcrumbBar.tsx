import React from 'react';
import {LinkData} from "../../utils/link_data";
import {BreadcrumbBar} from "../BreadcrumbBar";

type Props = {
    breadcrumbs?: Array<LinkData>,
};

/**
 * Display a <BreadcrumbBar> with "Sondages" as the first breadcrumb.
 */
export function PollsBreadcrumbBar(props: Props) {
    // Add "Sondages" as the first breadcrumb.
    const defaultPollBreadcrumb: LinkData = {
        name: "Sondages",
        to: "/sondages/",
    };

    const breadcrumbs = props.breadcrumbs === undefined
        ? [defaultPollBreadcrumb]
        : [defaultPollBreadcrumb, ...props.breadcrumbs];

    return (
        <BreadcrumbBar breadcrumbs={breadcrumbs}/>
    );
}
