import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <div className="nk-footer">
            <div className="container-fluid">
                <div className="nk-footer-wrap">
                    <div className="nk-footer-copyright">
                        {" "}
                        &copy; 2025 SIMADU. Apps by <a href="https://darul-hikmah.sch.id">Yayasan Darul Hikmah Menganti</a>
                    </div>
                    <div className="nk-footer-links">
                        <ul className="nav nav-sm">
                            <li className="nav-item">
                                <Link to={`#`} className="nav-link">
                                    Ketentuan
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={`#`} className="nav-link">
                                    Privasi
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={`#`} className="nav-link">
                                    Bantuan
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Footer;
