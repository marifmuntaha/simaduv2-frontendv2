import React from "react";
import { Helmet } from "react-helmet";

interface HeadProps {
    title?: string;
    [key: string]: any;
}

const Head: React.FC<HeadProps> = ({ ...props }) => {
    return (
        <Helmet>
            <title>{props.title ? props.title + " | " : null} {import.meta.env.VITE_APP_NAME}</title>
        </Helmet>
    );
};
export default Head;
