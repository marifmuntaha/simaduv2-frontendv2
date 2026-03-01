import React from 'react'
import classNames from "classnames"

interface AppMainProps {
    className?: string;
    children?: React.ReactNode;
    [key: string]: any;
}

const AppMain: React.FC<AppMainProps> = ({ className, children, ...props }) => {
    const compClass = classNames({
        "nk-main": true,
        [`${className}`]: className,
    });
    return (
        <div className={compClass} {...props}>
            {children}
        </div>
    )
}

export default AppMain