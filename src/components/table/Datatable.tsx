import classNames from "classnames";
import React from "react";
import { Card } from "reactstrap";

interface DataTableProps {
    className?: string;
    bodyClassName?: string;
    title?: string;
    children?: React.ReactNode;
}

export const DataTable: React.FC<DataTableProps> = ({ className, bodyClassName, title, ...props }) => {
    return (
        <Card className={`${className ? className : ""}`} {...props}>
            <div className="card-inner-group">{props.children}</div>
        </Card>
    );
};

interface DataTableTitleProps {
    children?: React.ReactNode;
}

export const DataTableTitle: React.FC<DataTableTitleProps> = ({ ...props }) => {
    return (
        <div className="card-inner position-relative card-tools-toggle">
            <div className="card-title-group">{props.children}</div>
        </div>
    );
};

interface DataTableBodyProps {
    compact?: boolean;
    seperate?: boolean;
    className?: string;
    bodyclass?: string;
    children?: React.ReactNode;
}

export const DataTableBody: React.FC<DataTableBodyProps> = ({ compact, seperate, className, bodyclass, ...props }) => {
    const innerclass = classNames({
        "nk-tb-list nk-tb-ulist": true,
        [`${bodyclass}`]: bodyclass,
        "is-compact": compact,
        "is-separate": seperate,
    });
    return (
        <div className={`card-inner p-0 ${className ? className : ""}`} {...props}>
            <div className={innerclass}>{props.children}</div>
        </div>
    );
};

interface DataTableHeadProps {
    children?: React.ReactNode;
}

export const DataTableHead: React.FC<DataTableHeadProps> = ({ ...props }) => {
    return <div className="nk-tb-item nk-tb-head">{props.children}</div>;
};

interface DataTableRowProps {
    className?: string;
    size?: string;
    children?: React.ReactNode;
}

export const DataTableRow: React.FC<DataTableRowProps> = ({ className, size, ...props }) => {
    const rowClass = classNames({
        "nk-tb-col": true,
        [`${className}`]: className,
        [`tb-col-${size}`]: size,
    });
    return <div className={rowClass} {...props}>{props.children}</div>;
};

interface DataTableItemProps {
    className?: string;
    children?: React.ReactNode;
}

export const DataTableItem: React.FC<DataTableItemProps> = ({ className, ...props }) => {
    return <div className={`nk-tb-item ${className ? className : ""}`} {...props}>{props.children}</div>;
};
