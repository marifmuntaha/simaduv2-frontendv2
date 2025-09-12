import React, {useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import moment from "moment/moment";
import "moment/locale/id"
import {Button, Spinner} from "reactstrap";
import {Col, Icon, Row, RSelect, RToast} from "@/components";
import {get as getParent} from "@/api/student/parent"

const FormParent = ({formData, setFormData, methods, ...props}) => {
    const [loading, setLoading] = useState(false);
    const [fatherBirthdate, setFatherBirthdate] = useState(new Date());
    const [motherBirthDate, setMotherBirthDate] = useState(new Date());
    const [guardBirthDate, setGuardBirthDate] = useState(new Date());
    const {register, handleSubmit, formState: {errors}, setValue} = methods;
    const statusParentOptions = [
        {value: '1', label: "Masih Hidup"},
        {value: '2', label: "Meninggal"},
        {value: '3', label: "Tidak Diketahui"},
    ]
    const statusGuardOptions = [
        {value: '1', label: "Sama dengan Ayah"},
        {value: '2', label: "Sama dengan Ibu"},
        {value: '3', label: "Lainnya"},
    ]
    const onInputChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };
    const onSubmit = () => {
        if (formData.guardStatus === 1) {
            setFormData({
                ...formData,
                guardName: formData.fatherName,
                guardNIK: formData.fatherNIK,
                guardBirthplace: formData.fatherBirthplace,
                guardBirthdate: formData.fatherBirthdate,
                guardEmail: formData.fatherEmail,
                guardPhone: formData.fatherPhone
            })
        } else if (formData.guardStatus === 2) {
            setFormData({
                ...formData,
                guardName: formData.motherName,
                guardNIK: formData.motherNIK,
                guardBirthplace: formData.motherBirthplace,
                guardBirthdate: formData.motherBirthdate,
                guardEmail: formData.motherEmail,
                guardPhone: formData.motherPhone
            })
        }
        props.next()
    }

    const checkParent = (e) => {
        e.preventDefault()
        setLoading(true);
        if (formData.numberKk !== '') {
            getParent({numberKk: formData.numberKk}).then(resp => {
                const parent = resp[0]
                setValue('headFamily', parent.headFamily)
                setValue('fatherStatus', parent.fatherStatus)
                setValue('fatherName', parent.fatherName)
                setValue('fatherNIK', parent.fatherNIK)
                setValue('fatherBirthplace', parent.fatherBirthplace)
                setGuardBirthDate(moment(parent.fatherBirthdate, 'YYYY-MM-DD').toDate())
                setValue('fatherEmail', parent.fatherEmail)
                setValue('fatherPhone', parent.fatherPhone)
                setValue('motherStatus', parent.motherStatus)
                setValue('motherName', parent.motherName)
                setValue('motherNIK', parent.motherNIK)
                setValue('motherBirthplace', parent.motherBirthplace)
                setGuardBirthDate(moment(parent.motherBirthdate, 'YYYY-MM-DD').toDate())
                setValue('motherEmail', parent.motherEmail)
                setValue('motherPhone', parent.motherPhone)
                setValue('guardStatus', parent.guardStatus)
                setValue('guardName', parent.guardName)
                setValue('guardNIK', parent.guardNIK)
                setValue('guardBirthplace', parent.guardBirthplace)
                setGuardBirthDate(moment(parent.guardBirthdate, 'YYYY-MM-DD').toDate())
                setValue('guardEmail', parent.guardEmail)
                setValue('guardPhone', parent.guardPhone)
                setFormData({
                    ...formData,
                    parentId: parent.id,
                    headFamily: parent.headFamily,
                    fatherStatus: parent.fatherStatus,
                    fatherName: parent.fatherName,
                    fatherNIK: parent.fatherNIK,
                    fatherBirthplace: parent.fatherBirthplace,
                    fatherBirthdate: parent.fatherBirthdate,
                    fatherEmail: parent.fatherEmail,
                    fatherPhone: parent.fatherPhone,
                    motherStatus: parent.motherStatus,
                    motherName: parent.motherName,
                    motherNIK: parent.motherNIK,
                    motherBirthplace: parent.motherBirthplace,
                    motherBirthdate: parent.motherBirthdate,
                    motherEmail: parent.motherEmail,
                    motherPhone: parent.motherPhone,
                    guardStatus: parent.guardStatus,
                    guardName: parent.guardName,
                    guardNIK: parent.guardNIK,
                    guardBirthplace: parent.guardBirthplace,
                    guardBirthdate: parent.guardBirthdate,
                    guardEmail: parent.guardEmail,
                    guardPhone: parent.guardPhone
                })
                setLoading(false);
                RToast('Data orangtua ditemukan', 'success');
            }).catch(() => {
                RToast('Data orangtua tidak ditemukan', 'info');
                setLoading(false);
            })
        } else {
            RToast('Kolom Nomor Kartu Keluarga tidak boleh kosong');
            setLoading(false);
        }
    }

    useEffect(() => {
        if (formData.guardStatus === '1') {
            setValue('guardName', formData.fatherName)
            setValue('guardNIK', formData.fatherNIK)
            setValue('guardBirthplace', formData.fatherBirthplace)
            setGuardBirthDate(moment(formData.fatherBirthdate).toDate())
            setValue('guardEmail', formData.fatherEmail)
            setValue('guardPhone', formData.fatherPhone)
        } else if (formData.guardStatus === '2') {
            setValue('guardName', formData.motherName)
            setValue('guardNIK', formData.motherNIK)
            setValue('guardBirthplace', formData.motherBirthplace)
            setGuardBirthDate(moment(formData.motherBirthdate).toDate())
            setValue('guardEmail', formData.motherEmail)
            setValue('guardPhone', formData.motherPhone)
        }
    }, [setValue, formData]);
    return (
        <React.Fragment>
            <form className="content clearfix" onSubmit={handleSubmit(onSubmit)}>
                <Row className="gy-0">
                    <div className="form-group col-md-6">
                        <label className="form-label" htmlFor="numberKk">Nomor Kartu Keluarga</label>
                        <div className="form-control-wrap">
                            <div className="input-group input-group-sm">
                                <input
                                    type="number"
                                    name="numberKk"
                                    className="form-control"
                                    placeholder="Ex. 3320011103937776"
                                    {...register('numberKk', {
                                        required: true,
                                        onChange: (e) => onInputChange(e)
                                    })}
                                />
                                <div className="input-group-append">
                                    <Button color="primary" type="button" onClick={(e) => checkParent(e)}>
                                        {loading ? <Spinner size="sm"/> : <Icon name="search"/>}
                                    </Button>
                                </div>
                            </div>
                            {errors.numberKk && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group col-md-6">
                        <label className="form-label" htmlFor="headFamily">Nama Kepala Keluarga</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                name="headFamily"
                                className="form-control"
                                placeholder="Ex. headFamily"
                                {...register('headFamily', {
                                    required: true,
                                    onChange: (e) => onInputChange(e)
                                })}
                            />
                            {errors.headFamily && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <Col md="6">
                        <div className="form-group">
                            <label className="form-label" htmlFor="fatherStatus">Status Ayah</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    id="fatherStatus"
                                    options={statusParentOptions}
                                    value={statusParentOptions?.find((e) => e.value === formData.fatherStatus)}
                                    onChange={(val) => {
                                        setFormData({...formData, fatherStatus: val.value});
                                        setValue('fatherStatus', val.value);
                                    }}
                                    placeholder="Pilih Status Ayah"
                                />
                                <input type="hidden" id="fatherStatus" className="form-control" {...register('fatherStatus', {required: true})} />
                                {errors.fatherStatus && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                    </Col>
                    <div className="form-group col-md-6">
                        <label className="form-label" htmlFor="motherStatus">Status Ibu</label>
                        <div className="form-control-wrap">
                            <RSelect
                                id="motherStatus"
                                options={statusParentOptions}
                                value={statusParentOptions?.find((e) => e.value === formData.motherStatus)}
                                onChange={(val) => {
                                    setFormData({...formData, motherStatus: val.value});
                                    setValue('motherStatus', val.value);
                                }}
                                placeholder="Pilih Status Ibu"
                            />
                            <input type="hidden" id="motherStatus" className="form-control" {...register('motherStatus', {required: true})} />
                            {errors.motherStatus && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group col-md-6">
                        <label className="form-label" htmlFor="fatherName">Nama Ayah</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                name="fatherName"
                                className="form-control"
                                placeholder="Ex. Muhammad Arif Muntaha"
                                {...register('fatherName', {
                                    required: true,
                                    onChange: (e) => onInputChange(e)
                                })}
                            />
                            {errors.fatherName && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group col-md-6">
                        <label className="form-label" htmlFor="motherName">Nama Ibu</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                name="motherName"
                                className="form-control"
                                placeholder="Ex. Eka Maftukhatul Khoeryah"
                                {...register('motherName', {
                                    required: true,
                                    onChange: (e) => onInputChange(e)
                                })}
                            />
                            {errors.motherName && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group col-md-6">
                        <label className="form-label" htmlFor="fatherNIK">NIK Ayah</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                name="fatherNIK"
                                className="form-control"
                                placeholder="Ex. 3320011103940007"
                                {...register('fatherNIK', {
                                    required: formData.fatherStatus === '1',
                                    onChange: (e) => onInputChange(e),
                                    disabled: formData.fatherStatus !== '1'
                                })}
                            />
                            {errors.fatherNIK && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group col-md-6">
                        <label className="form-label" htmlFor="motherNIK">NIK Ibu</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                name="motherNIK"
                                className="form-control"
                                placeholder="Ex. 3320011103940007"
                                {...register('motherNIK', {
                                    required: formData.motherStatus === '1',
                                    onChange: (e) => onInputChange(e),
                                    disabled: formData.motherStatus !== '1'
                                })}
                            />
                            {errors.motherNIK && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group col-md-3">
                        <label className="form-label" htmlFor="fatherBirthplace">Tempat Lahir Ayah</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                name="fatherBirthplace"
                                className="form-control"
                                placeholder="Ex. Jepara"
                                {...register('fatherBirthplace', {
                                    required: formData.fatherStatus === '1',
                                    disabled: formData.fatherStatus !== '1',
                                    onChange: (e) => onInputChange(e)
                                })}
                            />
                            {errors.fatherBirthplace && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group col-md-3">
                        <label className="form-label" htmlFor="fatherBirthdate">Tanggal Lahir Ayah</label>
                        <div className="form-control-wrap">
                            <DatePicker
                                locale="id"
                                selected={fatherBirthdate}
                                onChange={(e) => {
                                    setFormData({...formData, fatherBirthdate: moment(e).format('YYYY-MM-DD')});
                                    setFatherBirthdate(e)
                                }}
                                disabled={formData.fatherStatus !== '1'}
                                dateFormat={"dd/MM/yyyy"}
                                className="form-control date-picker"
                                showMonthYearDropdown
                            />{" "}
                        </div>
                    </div>
                    <div className="form-group col-md-3">
                        <label className="form-label" htmlFor="motherBirthplace">Tempat Lahir Ibu</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                name="motherBirthplace"
                                className="form-control"
                                placeholder="Ex. Kebumen"
                                {...register('motherBirthplace', {
                                    required: formData.motherStatus === '1',
                                    disabled: formData.motherStatus !== '1',
                                    onChange: (e) => onInputChange(e)
                                })}
                            />
                            {errors.motherBirthplace && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group col-md-3">
                        <label className="form-label" htmlFor="motherBirthdate">Tanggal Lahir Ibu</label>
                        <div className="form-control-wrap">
                            <DatePicker
                                locale="id"
                                selected={motherBirthDate}
                                onChange={(e) => {
                                    setFormData({...formData, motherBirthdate: moment(e).format('YYYY-MM-DD')});
                                    setMotherBirthDate(e)
                                }}
                                disabled={formData.motherStatus !== '1'}
                                dateFormat={"dd/MM/yyyy"}
                                className="form-control date-picker"
                                showMonthYearDropdown
                            />{" "}
                        </div>
                    </div>
                    <div className="form-group col-md-3">
                        <label className="form-label" htmlFor="fatherEmail">Alamat Email Ayah</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                name="fatherEmail"
                                className="form-control"
                                placeholder="Ex. marifmuntaha@gmail.com"
                                {...register('fatherEmail', {
                                    required: formData.fatherStatus === '1',
                                    disabled: formData.fatherStatus !== '1',
                                    onChange: (e) => onInputChange(e)
                                })}
                            />
                            {errors.fatherEmail && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group col-md-3">
                        <label className="form-label" htmlFor="fatherPhone">Nomor HP Ayah</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                name="fatherPhone"
                                className="form-control"
                                placeholder="Ex. 6282229366500"
                                {...register('fatherPhone', {
                                    required: formData.fatherStatus === '1',
                                    disabled: formData.fatherStatus !== '1',
                                    onChange: (e) => onInputChange(e)
                                })}
                            />
                            {errors.fatherPhone && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group col-md-3">
                        <label className="form-label" htmlFor="motherEmail">Alamat Email Ibu</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                name="motherEmail"
                                className="form-control"
                                placeholder="Ex. marifmuntaha@gmail.com"
                                {...register('motherEmail', {
                                    required: formData.motherStatus === '1',
                                    disabled: formData.motherStatus !== '1',
                                    onChange: (e) => onInputChange(e)
                                })}
                            />
                            {errors.motherEmail && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group col-md-3">
                        <label className="form-label" htmlFor="motherPhone">Nomor HP Ibu</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                name="motherPhone"
                                className="form-control"
                                placeholder="Ex. 6282229366500"
                                {...register('motherPhone', {
                                    required: formData.motherStatus === '1',
                                    disabled: formData.motherStatus !== '1',
                                    onChange: (e) => onInputChange(e)
                                })}
                            />
                            {errors.motherPhone && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group col-md-12">
                        <label className="form-label" htmlFor="guardStatus">Status Wali</label>
                        <div className="form-control-wrap">
                            <RSelect
                                id="guardStatus"
                                options={statusGuardOptions}
                                value={statusGuardOptions?.find((e) => e.value === formData.guardStatus)}
                                onChange={(val) => {
                                    setFormData({...formData, guardStatus: val.value});
                                    setValue('guardStatus', val.value);
                                }}
                                placeholder="Pilih Status Wali"
                            />
                            <input type="hidden" id="guardStatus" className="form-control" {...register('guardStatus', {required: true})}/>
                            {errors.guardStatus && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group col-md-6">
                        <label className="form-label" htmlFor="guardName">Nama Wali</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                name="guardName"
                                className="form-control"
                                placeholder="Ex. Muhammad Arif Muntaha"
                                {...register('guardName', {
                                    required: true,
                                    disabled: formData.guardStatus !== '3',
                                    onChange: (e) => onInputChange(e)
                                })}
                            />
                            {errors.guardName && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group col-md-6">
                        <label className="form-label" htmlFor="guardNIK">NIK Wali</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                name="guardNIK"
                                className="form-control"
                                placeholder="Ex. 3320011103940007"
                                {...register('guardNIK', {required: true})}
                                disabled={formData.guardStatus !== '3'}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        {errors.guardNIK && <span className="invalid">Kolom tidak boleh kosong</span>}
                    </div>
                    <div className="form-group col-md-3">
                        <label className="form-label" htmlFor="guardBirthplace">Tempat Lahir Wali</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                name="guardBirthplace"
                                className="form-control"
                                placeholder="Ex. Jepara"
                                {...register('guardBirthplace', {
                                    required: true,
                                    onChange: (e) => onInputChange(e),
                                    disabled: formData.guardStatus !== '3'
                                })}
                            />
                            {errors.guardBirthplace && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group col-md-3">
                        <label className="form-label" htmlFor="guardBirthDate">Tanggal Lahir Wali</label>
                        <div className="form-control-wrap">
                            <DatePicker
                                locale="id"
                                selected={guardBirthDate}
                                onChange={(e) => {
                                    setFormData({...formData, guardBirthdate: moment(e).format('YYYY-MM-DD')});
                                    setGuardBirthDate(e)
                                }}
                                disabled={formData.guardStatus !== '3'}
                                dateFormat={"dd/MM/yyyy"}
                                className="form-control date-picker"
                                showMonthYearDropdown
                            />{" "}
                        </div>
                    </div>
                    <div className="form-group col-md-3">
                        <label className="form-label" htmlFor="guardEmail">Alamat Email Wali</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                name="guardEmail"
                                className="form-control"
                                placeholder="Ex. marifmuntaha@gmail.com"
                                {...register('guardEmail', {
                                    required: true,
                                    disabled: formData.guardStatus !== '3',
                                    onChange: (e) => onInputChange(e)
                                })}
                            />
                            {errors.guardEmail && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group col-md-3">
                        <label className="form-label" htmlFor="guardPhone">Nomor HP Wali</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                name="guardPhone"
                                className="form-control"
                                placeholder="Ex. 6282229366500"
                                {...register('guardPhone', {
                                    required: true,
                                    disabled: formData.guardStatus !== '3',
                                    onChange: (e) => onInputChange(e)
                                })}
                            />
                            {errors.guardPhone && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                </Row>
                <div className="actions clearfix">
                    <ul>
                        <li><Button color="primary" type="submit">Lanjut</Button></li>
                        <li><Button color="primary" type="button" onClick={props.prev}>Kembali</Button></li>
                    </ul>
                </div>
            </form>
        </React.Fragment>
    )
}

export default FormParent;