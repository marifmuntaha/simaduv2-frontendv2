import React, {useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import {Button, Row} from "reactstrap";
import {RSelect} from "@/components";

const FormPersonal = ({formData, setFormData, methods, ...props}) => {
    const [birthdateSelected, setBirthdateSelected] = useState(new Date());
    const genderOptions = [
        {value: "L", label: "Laki-laki"},
        {value: "P", label: "Perempuan"},
    ]
    const onInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const { register, handleSubmit, setValue, formState: { errors } } = methods;
    const submitForm = () => {
        props.next();
    };
    useEffect(() => {
        setValue('name', formData.name);
        setValue('nisn', formData.nisn);
        setValue('nism', formData.nism);
        setValue('nik', formData.nik);
        setValue('gender', formData.gender);
        setValue('birthplace', formData.birthplace);
        setBirthdateSelected(moment(formData.birthdate, 'YYYY-MM-DD').toDate());
        setValue('email', formData.email);
        setValue('phone', formData.phone);
    }, [formData, setValue]);
    return (
        <form className="content clearfix" onSubmit={handleSubmit(submitForm)}>
            <Row className="gy-0">
                <div className="form-group col-md-12">
                    <label className="form-label" htmlFor="name">
                        Nama Lengkap
                    </label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Ex. Achmad Wikramawardhana"
                            {...register('name', {
                                required: true,
                                onChange: (e) => onInputChange(e)
                            })}
                        />
                        {errors.name && <span className="invalid">Kolom tidak boleh kosong</span>}
                    </div>
                </div>
                <div className="form-group col-md-4">
                    <label className="form-label" htmlFor="nisn">NISN</label>
                    <div className="form-control-wrap">
                        <input
                            type="number"
                            name="nisn"
                            className="form-control"
                            placeholder="Ex. 1234567890"
                            {...register('nisn', {
                                required: true,
                                onChange: (e) => onInputChange(e)
                            })}
                        />
                        {errors.nisn && <span className="invalid">Kolom tidak boleh kosong</span>}
                    </div>
                </div>
                <div className="form-group col-md-4">
                    <label className="form-label" htmlFor="nism">NISM</label>
                    <div className="form-control-wrap">
                        <input
                            type="number"
                            name="nism"
                            className="form-control"
                            placeholder="Ex. 1234567890"
                            {...register('nism', {
                                required: true,
                                onChange: (e) => onInputChange(e)
                            })}
                        />
                        {errors.nism && <span className="invalid">Kolom tidak boleh kosong</span>}
                    </div>
                </div>
                <div className="form-group col-md-4">
                    <label className="form-label" htmlFor="nik">NIK</label>
                    <div className="form-control-wrap">
                        <input
                            type="number"
                            name="nik"
                            className="form-control"
                            placeholder="Ex. 1234567890"
                            {...register('nik', {
                                required: true,
                                onChange: (e) => onInputChange(e)
                            })}
                        />
                        {errors.nik && <span className="invalid">Kolom tidak boleh kosong</span>}
                    </div>
                </div>
                <div className="form-group col-md-4">
                    <label className="form-label" htmlFor="gender">Jenis Kelamin</label>
                    <div className="form-control-wrap">
                        <RSelect
                            id="gender"
                            options={genderOptions}
                            value={genderOptions?.find((e) => e.value === formData.gender)}
                            onChange={(val) => {
                                setFormData({...formData, gender: val.value});
                                setValue('gender', val.value);
                            }}
                            placeholder="Pilih Jenis Kelamin"
                        />
                        <input type="hidden" className="form-control" {...register('gender', { required: true })} />
                        {errors.gender && <span className="invalid">Kolom tidak boleh kosong.</span>}
                    </div>
                </div>
                <div className="form-group col-md-4">
                    <label className="form-label" htmlFor="birthplace">Tempat Lahir</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            name="birthplace"
                            className="form-control"
                            placeholder="Ex. Jepara"
                            {...register('birthplace', {
                                required: true,
                                onChange: (e) => onInputChange(e)
                            })}
                        />
                        {errors.birthplace && <span className="invalid">Kolom tidak boleh kosong.</span>}
                    </div>
                </div>
                <div className="form-group col-md-4">
                    <label className="form-label" htmlFor="birthdate">Tanggal Lahir</label>
                    <div className="form-control-wrap">
                        <DatePicker
                            locale="id"
                            selected={birthdateSelected}
                            onChange={(e) => {
                                setFormData({...formData, birthdate: moment(e).format('YYYY-MM-DD')});
                            }}
                            dateFormat={"dd/MM/yyyy"}
                            className="form-control date-picker"
                            showMonthYearDropdown/>{" "}
                        {errors.birthdate && <span className="invalid">Kolom tidak boleh kosong</span>}
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="email">Email</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            name="email"
                            className="form-control"
                            placeholder="Ex. wikramawardhana@gmail.com"
                            {...register('email', {
                                required: true,
                                onChange: (e) => onInputChange(e)
                            })}
                        />
                        {errors.email && <span className="invalid">Kolom tidak boleh kosong.</span>}
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="phone">Nomor HP</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            name="phone"
                            className="form-control"
                            placeholder="Ex. 6282229366509"
                            {...register('phone', {
                                required: true,
                                onChange: (e) => onInputChange(e)
                            })}
                        />
                        {errors.phone && <span className="invalid">Kolom tidak boleh kosong.</span>}
                    </div>
                </div>
            </Row>
            <div className="actions clearfix">
                <ul>
                    <li>
                        <Button color="primary" type="submit">Lanjut</Button>
                    </li>
                </ul>
            </div>
        </form>
    );
};

export default FormPersonal;