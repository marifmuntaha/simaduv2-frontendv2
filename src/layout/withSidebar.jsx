import React from "react";
import {Outlet} from "react-router-dom";
import {RootMenu, DefaultMenu, OperatorMenu} from "./sidebar/MenuData";
import Sidebar from "./sidebar";
import Head from "./head";
import Header from "./header";
import Footer from "./footer";
import AppRoot from "./global/AppRoot";
import AppMain from "./global/AppMain";
import AppWrap from "./global/AppWrap";
import {APICore} from "@/api/APICore";

const WithSidebar = ({title, ...props}) => {
    const api = new APICore()
    const user = api.getLoggedInUser();
    const menu = () => {
        switch (user.role) {
            case '1':
                return RootMenu
            case  '2':
                return OperatorMenu
            default:
                return DefaultMenu;
        }
    }
    return (
        <React.Fragment>
            <Head title={!title && 'Loading'}/>
            <AppRoot>
                <AppMain>
                    <Sidebar menuData={menu()} user={user} fixed/>
                    <AppWrap>
                        <Header fixed/>
                        <Outlet context={{user: user}}/>
                        <Footer/>
                    </AppWrap>
                </AppMain>
            </AppRoot>
        </React.Fragment>
    );
};
export default WithSidebar;
