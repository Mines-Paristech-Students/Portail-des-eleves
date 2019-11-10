import React from 'react';
import {Link} from "react-router-dom";
import {LinkData} from "../utils/link_data";
import BreadcrumbItem from "react-bootstrap/BreadcrumbItem";
import Breadcrumb from "react-bootstrap/Breadcrumb";

type Props = {
    breadcrumbs: Array<LinkData>
};

/**
 * Return a <Breadcrumb> filled with <Link> components using the content of `props.breadcrumbs`.
 */
export function BreadcrumbBar(props: Props) {
    function getBreadcrumbItem(breadcrumbData: LinkData, index: number): React.ReactElement {
        if (index === props.breadcrumbs.length - 1) {
            // Last element of the array. It is thus active.
            return (
                <BreadcrumbItem active key={breadcrumbData.name}>
                    {breadcrumbData.name}
                </BreadcrumbItem>
            )
        } else {
            // Give the link.
            return (
                <BreadcrumbItem key={breadcrumbData.name}>
                    <Link to={breadcrumbData.to}>
                        {breadcrumbData.name}
                    </Link>
                </BreadcrumbItem>
            )
        }
    }

    return (
        <Breadcrumb>
            {
                props.breadcrumbs.map(
                    (breadcrumbData, index) => getBreadcrumbItem(breadcrumbData, index)
                )
            }
        </Breadcrumb>
    );
}
