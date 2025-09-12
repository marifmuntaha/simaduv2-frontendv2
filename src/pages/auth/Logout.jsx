import React from "react";
import { Link } from "react-router-dom";
import Logo from "@/images/logo.png";
import LogoDark from "@/images/logo-dark.png";
import Head from "@/layout/head";
import AuthFooter from "@/layout/footer/auth";
import { Block, BlockContent, BlockDes, BlockHead, BlockTitle, Button } from "@/components";

const Logout = () => {
    return (
        <>
            <Head title="Keluar" />
            <Block className="nk-block-middle nk-auth-body">
                <div className="brand-logo pb-5">
                    <Link to={`${import.meta.env.BASE_URL}`} className="logo-link">
                        <img className="logo-light logo-img logo-img-lg" src={String(Logo)} alt="logo" />
                        <img className="logo-dark logo-img logo-img-lg" src={String(LogoDark)} alt="logo-dark" />
                    </Link>
                </div>
                <BlockHead>
                    <BlockContent>
                        <BlockTitle tag="h4">Anda berhasil keluar.</BlockTitle>
                        <BlockDes className="text-success">
                            <p>Silahkan masuk kembali untuk mengakses SIMADU App</p>
                            <Link to={`${import.meta.env.BASE_URL}auth/masuk`}>
                                <Button color="primary" size="md">
                                    Kembali Masuk
                                </Button>
                            </Link>
                        </BlockDes>
                    </BlockContent>
                </BlockHead>
            </Block>
            <AuthFooter />
        </>
    );
};
export default Logout;
