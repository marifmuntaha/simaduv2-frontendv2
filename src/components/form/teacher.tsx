import React, {useEffect, useState} from "react";
import DatePicker, {registerLocale} from "react-datepicker";
import {Controller, UseFormReturn} from "react-hook-form";
import {Row, RSelect} from "@/components";
import {useAuthContext} from "@/common/hooks/useAuthContext";
import {TeacherFormType} from "@/pages/teacher/partial";
import {get as getInstitution} from "@/common/api/institution"
import {OptionsType} from "@/common/types";
import {id} from "date-fns/locale/id";

registerLocale("id", id);

interface TeacherFormProps {
    methods: UseFormReturn<TeacherFormType>
}
const TeacherForm = ({methods} : TeacherFormProps) => {
    const {user} = useAuthContext();
    const {control, formState: {errors}, register} = methods;
    const [institutionOptions, setInstitutionOptions] = useState<OptionsType[]>()

    useEffect(() => {
        const fetchData = async () => {
            const institution = await getInstitution<OptionsType>({type: 'select', ladder: 'alias'})
            setInstitutionOptions(institution)
        }
        fetchData();
    }, [])
    return (
        <Row className="gy-0">
            {user?.role === 1 && (
                <div className="form-group">
                    <label className="form-label" htmlFor="institution">Pilih Lembaga</label>
                    <div className="form-control-wrap">
                        <Controller
                            control={control}
                            name="institutionSelected"
                            rules={{required: 'Silahkan Pilih Lembaga'}}
                            render={({field: {value, onChange}}) => (
                                <React.Fragment>
                                    <RSelect
                                        isMulti
                                        options={institutionOptions}
                                        value={value}
                                        onChange={(val) => onChange(val)}
                                        placeholder="Pilih Lembaga"
                                    />
                                    <input type="hidden" id="institution" className="form-control" />
                                    {errors.institutionSelected && <span className="invalid">Kolom tidak boleh kosong.</span>}
                                </React.Fragment>
                            )}
                        />
                    </div>
                </div>
            )}
            <Row className="gy-0">
                <div className="form-group col-md-3">
                    <label className="form-label" htmlFor="frontTitle">Gelar Depan</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            id="frontTitle"
                            placeholder="Ex. Drs,"
                            {...register("frontTitle", {required: false,})}
                        />
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="name">Nama Lengkap</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder="Ex. Muhammad Arif Muntaha"
                            {...register("name", {required: true})}
                        />
                        {errors.name && <span className="invalid">Kolom tidak boleh kosong</span>}
                    </div>
                </div>
                <div className="form-group col-md-3">
                    <label className="form-label" htmlFor="backTitle">Gelar Belakang</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            id="backTitle"
                            placeholder="Ex. S.Pd."
                            {...register("backTitle", {required: false})}
                        />
                        {errors.backTitle && <span className="invalid">Kolom tidak boleh kosong</span>}
                    </div>
                </div>
            </Row>
            <Row className="gy-0">
                <div className="form-group col-md-4">
                    <label className="form-label" htmlFor="pegId">PegID</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            id="pegId"
                            placeholder="Ex. 1235647876"
                            {...register("pegId", {required: true})}
                        />
                        {errors.pegId && <span className="invalid">Kolom tidak boleh kosong</span>}
                    </div>
                </div>
                <div className="form-group col-md-4">
                    <label className="form-label" htmlFor="birthplace">Tempat Lahir</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            id="birthplace"
                            placeholder="Ex. Jepara"
                            {...register("birthplace", {required: true})}
                        />
                        {errors.birthplace && <span className="invalid">Kolom tidak boleh kosong</span>}
                    </div>
                </div>
                <div className="form-group col-md-4">
                    <label className="form-label" htmlFor="birthdateSelected">Tanggal Lahir</label>
                    <div className="form-control-wrap">
                        <Controller
                            control={control}
                            name="birthdateSelected"
                            rules={{required: 'Silahkan pilih tanggal lahir'}}
                            render={({field: {value, onChange}}) => (
                                <React.Fragment>
                                    <DatePicker
                                        locale="id"
                                        selected={value}
                                        onChange={(e) => onChange(e)}
                                        dateFormat={"dd/MM/yyyy"}
                                        className="form-control date-picker"
                                        showMonthYearDropdown
                                    />{" "}
                                </React.Fragment>
                            )}
                        />
                    </div>
                </div>
            </Row>
            {/*<Row className="gy-0">*/}
            {/*    <div className="form-group col-md-4">*/}
            {/*        <label className="form-label" htmlFor="gender">Jenis Kelamin</label>*/}
            {/*        <div className="form-control-wrap">*/}
            {/*            <RSelect*/}
            {/*                options={genderOptions}*/}
            {/*                value={genderOptions?.find((c) => c.value === teacher.gender)}*/}
            {/*                onChange={(e) => {*/}
            {/*                    setTeacher({...teacher, gender: e.value});*/}
            {/*                    setValue('gender', e.value);*/}
            {/*                }}*/}
            {/*                placeholder="Pilih Jenis Kelamin"*/}
            {/*            />*/}
            {/*            <input type="hidden" id="gender" className="form-control" {...register('gender', {required: true})} />*/}
            {/*            {errors.gender && <span className="invalid">Kolom tidak boleh kosong.</span>}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className="form-group col-md-4">*/}
            {/*        <label className="form-label" htmlFor="phone">Nomor HP</label>*/}
            {/*        <div className="form-control-wrap">*/}
            {/*            <input*/}
            {/*                type="text"*/}
            {/*                className="form-control"*/}
            {/*                id="phone"*/}
            {/*                placeholder="Ex. 082229366500"*/}
            {/*                {...register("phone", {*/}
            {/*                    required: true,*/}
            {/*                    onChange: (e) => handleChange(e)*/}
            {/*                })}*/}
            {/*            />*/}
            {/*            {errors.phone && <span className="invalid">Kolom tidak boleh kosong</span>}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className="form-group col-md-4">*/}
            {/*        <label className="form-label" htmlFor="email">Alamat Email</label>*/}
            {/*        <div className="form-control-wrap">*/}
            {/*            <input*/}
            {/*                type="text"*/}
            {/*                className="form-control"*/}
            {/*                id="email"*/}
            {/*                placeholder="Ex. info@darul-hikmah.sch.id"*/}
            {/*                {...register("email", {*/}
            {/*                    required: true,*/}
            {/*                    onChange: (e) => handleChange(e)*/}
            {/*                })}*/}
            {/*            />*/}
            {/*            {errors.email && <span className="invalid">Kolom tidak boleh kosong</span>}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</Row>*/}
            {/*<div className="form-group">*/}
            {/*    <label className="form-label" htmlFor="address">Alamat</label>*/}
            {/*    <div className="form-control-wrap">*/}
            {/*                <textarea*/}
            {/*                    className="form-control"*/}
            {/*                    id="address"*/}
            {/*                    placeholder="Ex. Jl. Raya Jepara - Bugel KM 07 Menganti Kedung Jepara"*/}
            {/*                    {...register("address", {*/}
            {/*                        required: false,*/}
            {/*                        onChange: (e) => handleChange(e)*/}
            {/*                    })}*/}
            {/*                />*/}
            {/*    </div>*/}
            {/*</div>*/}
        </Row>
    )
}

export default TeacherForm;