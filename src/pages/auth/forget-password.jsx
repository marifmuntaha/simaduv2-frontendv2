import React, {useState} from "react";
import Logo from "@/images/logo.png";
import LogoDark from "@/images/logo-dark.png";
import Head from "@/layout/head";
import AuthFooter from "@/layout/footer/auth";
import { Block, BlockContent, BlockDes, BlockHead, BlockTitle, Button, PreviewCard } from "@/components";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {forgotPassword} from "@/api/auth";
import {Spinner} from "reactstrap";

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const {register, formState: {errors}, handleSubmit} = useForm();
    const onSubmit = (data) => {
        setLoading(true);
        forgotPassword(data).then(() => setLoading(false)).catch(() => setLoading(false))
    }
    return (
        <>
            <Head title="Lupa Kata Sandi" />
            <Block className="nk-block-middle nk-auth-body  wide-xs">
                <div className="brand-logo pb-4 text-center">
                    <Link to={"/"} className="logo-link">
                        <img className="logo-light logo-img logo-img-lg" src={String(Logo)} alt="logo" />
                        <img className="logo-dark logo-img logo-img-lg" src={String(LogoDark)} alt="logo-dark" />
                    </Link>
                </div>
                <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
                    <BlockHead>
                        <BlockContent>
                            <BlockTitle tag="h5">LUPA SANDI</BlockTitle>
                            <BlockDes>
                                <p>Jika Anda lupa kata sandi, kami akan mengirimkan pesan berisi petunjuk untuk mengatur ulang kata sandi Anda.</p>
                            </BlockDes>
                        </BlockContent>
                    </BlockHead>
                    <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <div className="form-label-group">
                                <label className="form-label" htmlFor="username">Nama Pengguna</label>
                            </div>
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                id="username"
                                placeholder="Masukkan Nama Pengguna anda."
                                {...register("username", {required: 'Nama Pengguna tidak boleh kosong.'})}
                            />
                            {errors.username && <span className="invalid">{errors.username.message}</span>}
                        </div>
                        <div className="form-group">
                            <Button color="primary" size="lg" className="btn-block">
                                {loading ? <Spinner size="sm"/> : 'KIRIM LINK RESET'}
                            </Button>
                        </div>
                    </form>
                    <div className="form-note-s2 text-center pt-4">
                        <Link to={import.meta.env.BASE_URL + 'auth/masuk'}>
                            <strong>Kembali Kehalaman Masuk</strong>
                        </Link>
                    </div>
                </PreviewCard>
            </Block>
            <AuthFooter />
        </>
    );
};
export default ForgotPassword;
