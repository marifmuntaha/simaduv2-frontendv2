import React, {useEffect, useState} from "react"
import {Controller, UseFormReturn, useWatch} from "react-hook-form";
import {OptionsType, UserType} from "@/common/types";
import {Icon, Row, RSelect} from "@/components";
import {useAuthContext} from "@/common/hooks/useAuthContext";
import {ROLE_OPTIONS} from "@/lib";
import {get as getInstitution} from "@/common/api/institution";

interface UserForm {
    methods: UseFormReturn<UserType>
}
const UserForm = ({methods} : UserForm) => {
    const { user } = useAuthContext()
    const {control, formState: {errors}, register} = methods;
    const [passState, setPassState] = useState(true);
    const [confmState, setConfmState] = useState(true);
    const [institutionOptions, setInstitutionOptions] = useState<OptionsType[]>();
    const id = useWatch({ control, name: 'id' });
    const role = useWatch({control, name: 'role'});

    useEffect(() => {
        const fetchData = async () => {
            const institution = await getInstitution<OptionsType>({type: 'select', with: 'ladder'})
            setInstitutionOptions(institution)
        }

        fetchData();
    }, [])
    return (
        <Row className="gy-0">
            <div className="form-group">
                <label className="form-label" htmlFor="name">Nama Lengkap</label>
                <div className="form-control-wrap">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ex. Muhammad Arif Muntaha"
                        {...register("name", {
                            required: true,
                        })}
                    />
                    {errors.name && <span className="invalid">Kolom tidak boleh kosong</span>}
                </div>
            </div>
            <div className="form-group col-md-6">
                <label className="form-label" htmlFor="email">Alamat Email</label>
                <div className="form-control-wrap">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ex. marifmuntaha@gmail.com"
                        {...register("email", {
                            required: true,
                        })}
                    />
                    {errors.email && <span className="invalid">Kolom tidak boleh kosong</span>}
                </div>
            </div>
            <div className="form-group col-md-6">
                <label className="form-label" htmlFor="username">Nama Pengguna</label>
                <div className="form-control-wrap">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ex. wikramawardhana"
                        {...register("username", {
                            required: true,
                        })}
                    />
                    {errors.email && <span className="invalid">Kolom tidak boleh kosong</span>}
                </div>
            </div>
            <div className="form-group col-md-6">
                <label className="form-label" htmlFor="password">Kata Sandi</label>
                <div className="form-control-wrap">
                    <a
                        href={"#password"}
                        onClick={(ev) => {
                            ev.preventDefault();
                            setPassState(!passState);
                        }}
                        className={`form-icon form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                    >
                        <Icon name="eye" className="passcode-icon icon-show"></Icon>
                        <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                    </a>
                    <input
                        type={passState ? "text" : "password"}
                        className={`form-control ${passState ? "is-hidden" : "is-shown"}`}
                        id="password"
                        placeholder="Ex. *************"
                        {...register("password", { required: id === undefined })}
                    />
                    {errors.password && <span className="invalid">Kolom tidak boleh kosong</span>}
                </div>
            </div>
            <div className="form-group col-md-6">
                <label className="form-label" htmlFor="password_confirmation">Ulangi Sandi</label>
                <div className="form-control-wrap">
                    <a
                        href={"#password"}
                        onClick={(ev) => {
                            ev.preventDefault();
                            setConfmState(!confmState);
                        }}
                        className={`form-icon form-icon-right passcode-switch ${confmState ? "is-hidden" : "is-shown"}`}
                    >
                        <Icon name="eye" className="passcode-icon icon-show"></Icon>
                        <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                    </a>
                    <input
                        type={confmState ? "text" : "password"}
                        className={`form-control ${confmState ? "is-hidden" : "is-shown"}`}
                        id="password_confirmation"
                        placeholder="Ex. *************"
                        {...register("password_confirmation", { required: id === undefined })}
                    />
                    {errors.password_confirmation && <span className="invalid">Kolom tidak boleh kosong</span>}
                </div>
            </div>
            <div className="form-group col-md-6">
                <label className="form-label" htmlFor="phone">No. Telepon</label>
                <div className="form-control-wrap">
                    <input
                        type="text"
                        className="form-control"
                        id="phone"
                        placeholder="082229366506"
                        {...register("phone", { required: true })}
                    />
                    {errors.password && <span className="invalid">Kolom tidak boleh kosong</span>}
                </div>
            </div>
            {user?.role === 1 && (
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="role">Hak Akses</label>
                    <div className="form-control-wrap">
                        <Controller
                            control={control}
                            name="role"
                            rules={{ required: "Pilih Hak Akses" }}
                            render={({ field: { value, onChange } }) => (
                                <React.Fragment>
                                    <RSelect
                                        options={ROLE_OPTIONS}
                                        value={ROLE_OPTIONS.find((item) => item.value === value)}
                                        onChange={(val) => onChange(val?.value)}
                                        placeholder="Pilih Hak Akses"
                                    />
                                    <input type="hidden" id="role" className="form-control" />
                                    {errors.role && <span className="invalid">Kolom tidak boleh kosong.</span>}
                                </React.Fragment>
                            )
                            } />
                    </div>
                </div>
            )}
            {role === 2 || role === 3 && (
                <div className="form-group">
                    <label className="form-label" htmlFor="role">Hak Akses</label>
                    <div className="form-control-wrap">
                        <Controller
                            control={control}
                            name="role"
                            rules={{ required: "Pilih Hak Akses" }}
                            render={({ field: { value, onChange } }) => (
                                <React.Fragment>
                                    <RSelect
                                        options={ROLE_OPTIONS}
                                        value={ROLE_OPTIONS.find((item) => item.value === value)}
                                        onChange={(val) => onChange(val?.value)}
                                        placeholder="Pilih Hak Akses"
                                    />
                                    <input type="hidden" id="role" className="form-control" />
                                    {errors.role && <span className="invalid">Kolom tidak boleh kosong.</span>}
                                </React.Fragment>
                            )
                            } />
                    </div>
                </div>
            )}
        </Row>
    )
}

export default UserForm