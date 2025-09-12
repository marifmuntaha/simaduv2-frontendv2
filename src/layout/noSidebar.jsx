import React from "react";
import { Outlet } from "react-router-dom";
import Head from "./head";

const NoSidebar = ({title, ...props}) => {

    return (
        <>
            <Head title={!title && 'Loading'} />
            <div className="nk-app-root">
                <div className="nk-wrap nk-wrap-nosidebar">
                    <div className="nk-content">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
};
export default NoSidebar;
