import React from "react";
import LogoLight2x from "@/images/logo2x.png";
import LogoDark2x from "@/images/logo-dark2x.png";
import LogoSmall from "@/images/logo-small.png";
import {Link} from "react-router-dom";

const Logo = () => {
    return (
        <Link to={`/`} className="logo-link">
            <img className="logo-light logo-img" src={String(LogoLight2x)} alt="logo" />
            <img className="logo-dark logo-img" src={String(LogoDark2x)} alt="logo" />
            <img className="logo-small logo-img logo-img-small" src={String(LogoSmall)} alt="logo" />
        </Link>
    );
};

export default Logo;
