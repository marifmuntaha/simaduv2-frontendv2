import React from "react";
import Icon from "@/components/icon";

interface ToggleProps {
    className?: string;
    click: (ev: React.MouseEvent) => void;
    icon: string;
}

const Toggle: React.FC<ToggleProps> = ({ className, click, icon }) => {
    return (
        <a
            href={"#toggle"}
            className={className ? className : ""}
            onClick={(ev) => {
                ev.preventDefault();
                click(ev);
            }}
        >
            <Icon name={icon} />
        </a>
    );
};
export default Toggle;
