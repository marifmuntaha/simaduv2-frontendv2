import React from "react";
import classnames from "classnames";

interface ColProps {
    sm?: string | number;
    lg?: string | number;
    md?: string | number;
    xxl?: string | number;
    size?: string | number;
    className?: string;
    children?: React.ReactNode;
    [key: string]: any;
}

export const Col: React.FC<ColProps> = ({ sm, lg, md, xxl, size, className, children, ...props }) => {
    let classNames = classnames({
        [`col-sm-${sm}`]: sm,
        [`col-lg-${lg}`]: lg,
        [`col-md-${md}`]: md,
        [`col-xxl-${xxl}`]: xxl,
        [`col-${size}`]: size,
        [`${className}`]: className,
    });
    return <div className={classNames} {...props}>{children}</div>;
};

interface RowProps {
    className?: string;
    children?: React.ReactNode;
    [key: string]: any;
}

export const Row: React.FC<RowProps> = ({ className, children, ...props }) => {
    const rowClass = classnames({
        row: true,
        [`${className}`]: className,
    });
    return <div className={rowClass} {...props}>{children}</div>;
};
