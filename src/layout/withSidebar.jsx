import React, {useState} from "react";
import {Outlet} from "react-router-dom";
import {RootMenu, DefaultMenu} from "./sidebar/MenuData";
import Sidebar from "./sidebar";
import Head from "./head";
import Header from "./header";
import Footer from "./footer";
import AppRoot from "./global/AppRoot";
import AppMain from "./global/AppMain";
import AppWrap from "./global/AppWrap";
import {APICore} from "@/api/APICore.jsx";

// import FileManagerProvider from "@/pages/app/file-manager/components/Context";

const WithSidebar = ({title, ...props}) => {
    const api = new APICore()
    const user = api.getLoggedInUser();
    return (
        <React.Fragment>
            <Head title={!title && 'Loading'}/>
            <AppRoot>
                <AppMain>
                    <Sidebar menuData={user.role === '1' ? RootMenu : DefaultMenu} user={user} fixed/>
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
