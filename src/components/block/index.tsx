import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/icon";
import classNames from "classnames";

interface BlockProps {
    className?: string;
    size?: string;
    children?: ReactNode;
}

export const Block = ({ className, size, ...props }: BlockProps) => {
    const blockClass = classNames({
        "nk-block": true,
        [`nk-block-${size}`]: size,
        [`${className}`]: className,
    });
    return <div className={blockClass}>{props.children}</div>;
};

interface BlockContentProps {
    className?: string;
    children?: ReactNode;
}

export const BlockContent = ({ className, ...props }: BlockContentProps) => {
    const blockContentClass = classNames({
        "nk-block-content": true,
        [`${className}`]: className,
    });
    return <div className={blockContentClass}>{props.children}</div>;
};

interface BlockBetweenProps {
    className?: string;
    children?: ReactNode;
}

export const BlockBetween = ({ className, ...props }: BlockBetweenProps) => {
    return <div className={`nk-block-between ${className ? className : ""}`}>{props.children}</div>;
};

interface BlockHeadProps {
    className?: string;
    size?: string;
    wide?: string;
    children?: ReactNode;
}

export const BlockHead = ({ className, size, wide, ...props }: BlockHeadProps) => {
    const blockHeadClass = classNames({
        "nk-block-head": true,
        [`nk-block-head-${size}`]: size,
        [`wide-${wide}`]: wide,
        [`${className}`]: className,
    });
    return <div className={blockHeadClass}>{props.children}</div>;
};

interface BlockHeadContentProps {
    className?: string;
    children?: ReactNode;
}

export const BlockHeadContent = ({ className, ...props }: BlockHeadContentProps) => {
    const blockHeadContentClass = classNames({
        "nk-block-head-content": true,
        [`${className}`]: className,
    });
    return <div className={blockHeadContentClass}>{props.children}</div>;
};

interface BlockTitleProps {
    className?: string;
    page?: boolean;
    tag?: React.ElementType;
    children?: ReactNode;
}

export const BlockTitle = ({ className, page, tag: Tag = "h3", ...props }: BlockTitleProps) => {
    const classes = classNames({
        "nk-block-title": true,
        "page-title": page,
        title: !page,
        [`${className}`]: className,
    });
    return (
        <React.Fragment>
            <Tag className={classes}>{props.children}</Tag>
        </React.Fragment>
    );
};

interface BlockDesProps {
    className?: string;
    page?: boolean;
    children?: ReactNode;
}

export const BlockDes = ({ className, page, ...props }: BlockDesProps) => {
    const classes = classNames({
        "nk-block-des": true,
        [`${className}`]: className,
    });
    return <div className={classes}>{props.children}</div>;
};

interface BackToProps {
    className?: string;
    link: string;
    icon: string;
    children?: ReactNode;
}

export const BackTo = ({ className, link, icon, ...props }: BackToProps) => {
    const classes = classNames({
        "back-to": true,
        [`${className}`]: className,
    });
    return (
        <div className="nk-block-head-sub">
            <Link className={classes} to={link}>
                <Icon name={icon} />
                <span>{props.children}</span>
            </Link>
        </div>
    );
};

