import React, {useState} from "react";
import {Link, useParams} from "react-router-dom";
import {Spinner} from "reactstrap";
import {useForm} from "react-hook-form";
import Logo from "@/images/logo.png";
import LogoDark from "@/images/logo-dark.png";
import Head from "@/layout/head";
import {Block, BlockContent, BlockDes, BlockHead, BlockTitle, Button, Icon, PreviewCard} from "@/components";
import AuthFooter from "@/layout/footer/auth";
import {resetPassword} from "@/api/auth"

const ForgotPassword = () => {
    const {token} = useParams();
    const [loading, setLoading] = useState(false);
    const [passState, setPassState] = useState(false);
    const [rePassState, setRePassState] = useState(false);
    const {register, formState: {errors}, handleSubmit} = useForm();
    const onSubmit = (data) => {
        setLoading(true);
        data.token = token;
        resetPassword(data).then(() => setLoading(false)).catch(() => setLoading(false))
    }

    return (
        <>
            <Head title="Atur Ulang Kata Sandi" />
            <Block className="nk-block-middle nk-auth-body  wide-xs">
                <div className="brand-logo pb-4 text-center">
                    <Link to={import.meta.env.BASE_URL} className="logo-link">
                        <img className="logo-light logo-img logo-img-lg" src={String(Logo)} alt="logo" />
                        <img className="logo-dark logo-img logo-img-lg" src={String(LogoDark)} alt="logo-dark" />
                    </Link>
                </div>
                <PreviewCard bodyClass="card-inner-lg">
                    <BlockHead>
                        <BlockContent>
                            <BlockTitle tag="h5">ATUR ULANG SANDI</BlockTitle>
                            <BlockDes>
                                <p>Masukkan Kata Sandi baru anda</p>
                            </BlockDes>
                        </BlockContent>
                    </BlockHead>
                    <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <div className="form-label-group">
                                <label className="form-label" htmlFor="email">Alamat Email</label>
                            </div>
                            <input
                                type="email"
                                className="form-control form-control-lg"
                                id="email"
                                placeholder="Masukkan alamat email anda."
                                {...register("email", {required: 'Alamat Email tidak boleh kosong.'})}
                            />
                            {errors.email && <span className="invalid">{errors.email.message}</span>}
                        </div>
                        <div className="form-group">
                            <div className="form-label-group">
                                <label className="form-label" htmlFor="password">
                                    Kata Sandi
                                </label>
                            </div>
                            <div className="form-control-wrap">
                                <a
                                    href={"#password"}
                                    onClick={(ev) => {
                                        ev.preventDefault();
                                        setPassState(!passState);
                                    }}
                                    className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                                >
                                    <Icon name="eye" className="passcode-icon icon-show"></Icon>
                                    <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                                </a>
                                <input
                                    type={passState ? "text" : "password"}
                                    id="password"
                                    {...register('password', { required: "Kata Sandi tidak boleh kosong" })}
                                    placeholder="Masukkan kata sandi anda"
                                    className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`} />
                                {errors.password && <span className="invalid">{errors.password.message}</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="form-label-group">
                                <label className="form-label" htmlFor="password_confirmation">
                                    Ulangi Sandi
                                </label>
                            </div>
                            <div className="form-control-wrap">
                                <a
                                    href={"#password"}
                                    onClick={(ev) => {
                                        ev.preventDefault();
                                        setRePassState(!rePassState);
                                    }}
                                    className={`form-icon lg form-icon-right passcode-switch ${rePassState ? "is-hidden" : "is-shown"}`}
                                >
                                    <Icon name="eye" className="passcode-icon icon-show"></Icon>
                                    <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                                </a>
                                <input
                                    type={rePassState ? "text" : "password"}
                                    id="password_confirmation"
                                    {...register('password_confirmation', { required: "Ulangi Sandi tidak boleh kosong" })}
                                    placeholder="Ulangi sandi anda"
                                    className={`form-control-lg form-control ${rePassState ? "is-hidden" : "is-shown"}`} />
                                {errors.password_confirmation && <span className="invalid">{errors.password_confirmation.message}</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <Button color="primary" size="lg" className="btn-block">
                                {loading ? <Spinner size="sm"/> : 'ATUR ULANG SANDI'}
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