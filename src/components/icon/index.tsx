import classNames from "classnames";
import React from "react";

interface IconProps extends React.HTMLAttributes<HTMLElement> {
    name: string;
    id?: string;
    className?: string;
    style?: React.CSSProperties;
}

const Icon = ({ name, id, className, style, ...props }: IconProps) => {
    const iconClass = classNames({
        [`${className}`]: className,
        icon: true,
        ni: true,
        [`ni-${name}`]: true,
    });
    return <em className={iconClass} id={id} style={style} {...props}></em>;
};
export default Icon;

