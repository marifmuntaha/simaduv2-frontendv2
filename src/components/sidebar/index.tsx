import React from "react";
import SimpleBar from "simplebar-react";

interface SidebarProps {
    toggleState?: boolean;
    children?: React.ReactNode;
    [key: string]: any;
}

const Sidebar: React.FC<SidebarProps> = ({ toggleState, children, ...props }) => {
    return (
        <React.Fragment>
            <div
                className={`card-aside card-aside-right user-aside toggle-slide toggle-slide-right toggle-break-xxl ${toggleState && "content-active"
                    }`}
                data-content="userAside"
                data-toggle-screen="xxl"
                data-toggle-overlay="true"
                data-toggle-body="true"
                id="sidePanel_01"
                {...props}
            >
                <SimpleBar className="card-inner-group">{children}</SimpleBar>
            </div>
        </React.Fragment>
    );
};
export default Sidebar;
