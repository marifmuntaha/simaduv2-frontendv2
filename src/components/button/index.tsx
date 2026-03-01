import React from "react";
import classNames from "classnames";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    color?: string;
    size?: string;
    className?: string;
    outline?: boolean;
    disabled?: boolean;
}

const Button = ({ color, size, className, outline, disabled, ...props }: ButtonProps) => {
    const buttonClass = classNames({
        btn: true,
        [`btn-${color}`]: !outline && color,
        [`btn-outline-${color}`]: outline && color,
        [`btn-${size}`]: size,
        disabled: disabled,
        [`${className}`]: className,
    });
    return (
        <button className={buttonClass} disabled={disabled} {...props}>
            {props.children}
        </button>
    );
};
export default Button;

