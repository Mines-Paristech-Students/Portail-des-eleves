import React from "react";
import Navbar from "../utils/navbar";
import { PageTitle } from "../utils/common";

export const Homepage = () => {
    return (
        <>
            <Navbar />
            <div className={"container"}>
                <PageTitle>Homepage</PageTitle>
            </div>
        </>
    );
};
