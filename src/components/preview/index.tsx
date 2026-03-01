import React, { ReactNode } from "react";
import { Card } from "reactstrap";

interface PreviewCardProps {
    className?: string;
    bodyClass?: string;
    children?: ReactNode;
}

export const PreviewCard = ({ className, bodyClass, ...props }: PreviewCardProps) => {
    return (
        <Card className={`card-preview ${className ? className : ""}`}>
            <div className={`card-inner ${bodyClass ? bodyClass : ""}`}>{props.children}</div>
        </Card>
    );
};