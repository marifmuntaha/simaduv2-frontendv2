import React from "react";
import { Helmet } from "react-helmet";

const Head = ({ ...props }) => {
    return (
        <Helmet>
            <title>{props.title ? props.title + " | " : null} {import.meta.env.VITE_APP_NAME}</title>
        </Helmet>
    );
};
export default Head;
