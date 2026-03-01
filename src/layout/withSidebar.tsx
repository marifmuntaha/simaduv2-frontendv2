import React from "react";
import { Outlet } from "react-router-dom";
import { RootMenu, DefaultMenu, OperatorMenu, HeadMenu } from "./sidebar/MenuData";
import Sidebar from "./sidebar";
import Head from "./head";
import Header from "./header";
import Footer from "./footer";
import AppRoot from "./global/AppRoot";
import AppMain from "./global/AppMain";
import AppWrap from "./global/AppWrap";
import { useAuthContext } from "@/common/hooks/useAuthContext";

interface WithSidebarProps {
    title?: string;
}

const WithSidebar: React.FC<WithSidebarProps> = ({ title }) => {
    const { user } = useAuthContext();
    const menu = () => {
        switch (user?.role) {
            case 1:
                return RootMenu
            case 2:
                return OperatorMenu
            case 6:
                return HeadMenu
            default:
                return DefaultMenu;
        }
    }
    return (
        <React.Fragment>
            <Head title={title || 'Loading'} />
            <AppRoot>
                <AppMain>
                    <Sidebar menuData={menu()} user={user} fixed />
                    <AppWrap>
                        <Header fixed />
                        <Outlet context={{ user: user }} />
                        <Footer />
                    </AppWrap>
                </AppMain>
            </AppRoot>
        </React.Fragment>
    );
};
export default WithSidebar;
