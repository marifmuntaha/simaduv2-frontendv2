import React from "react"
import { Outlet } from "react-router-dom";
import Head from "./head";

interface NoSidebarProps {
    title?: string;
    [key: string]: any;
}
const NoSidebar = ({ title, ...props }: NoSidebarProps) => {

    return (
        <React.Fragment>
            <Head title={title || 'Loading'} />
            <div className="nk-app-root">
                <div className="nk-wrap nk-wrap-nosidebar">
                    <div className="nk-content">
                        <Outlet />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
export default NoSidebar;
