import React, {useEffect, useState} from "react";
import DatePicker, {registerLocale} from "react-datepicker";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {useForm} from "react-hook-form";
import moment from "moment";
import id from "date-fns/locale/id"
import {Icon, Row, RSelect} from "@/components";
import {store as storeTeacher, update as updateTeacher} from "@/api/teacher"
import {store as storeUser, update as updateUser, destroy as destroyUser} from "@/api/user"
import {get as getInstitution} from "@/api/institution"

registerLocale("id", id)

const Partial = ({modal, setModal, teacher, setTeacher, setRefreshData}) => {
    const [loading, setLoading] = useState(false);
    const [birthdateSelected, setBirthdateSelected] = useState(new Date());
    const [institutionOptions, setInstitutionOptions] = useState([]);
    const [institutionSelected, setInstitutionSelected] = useState([]);
    const genderOptions = [
        {value: 'L', label: 'Laki-laki'},
        {value: 'P', label: 'Perempuan'},
    ]
    const {
        reset,
        handleSubmit,
        register,
        formState: {errors},
        setValue
    } = useForm();
    const handleChange = (e) => {
        setTeacher({...teacher, [e.target.name]: e.target.value});
    }
    const onSubmit = () => {
        teacher.id === '' ? onStore() : onUpdate();
    }
    const onStore = () => {
        setLoading(true);
        storeUser({
            name: teacher.name,
            email: teacher.email,
            username: teacher.pegId,
            password: teacher.birthplace,
            phone: teacher.phone,
            role: '4'
        }).then((resp) => {
            storeTeacher({
                userId: resp.id,
                institution: institutionSelected.map((i) => i.value),
                name: teacher.name,
                pegId: teacher.pegId,
                birthplace: teacher.birthplace,
                birthdate: moment(teacher.birthdate).format('YYYY-MM-DD'),
                gender: teacher.gender,
                frontTitle: teacher.frontTitle,
                backTitle: teacher.backTitle,
                phone: teacher.phone,
                email: teacher.email,
                address: teacher.address,
            }).then(() => {
                setLoading(false);
                setRefreshData(true);
                toggle();
            }).catch(() => {
                destroyUser(resp.id).then(() => {
                    setLoading(false);
                }).catch(() => {
                    setLoading(false)
                })
            })
        }).catch(() => {
            setLoading(false)
        });
    }
    const onUpdate = () => {
        setLoading(true);
        updateUser({
            id: teacher.userId,
            name: teacher.name,
            email: teacher.email,
            username: teacher.pegId,
            password: teacher.birthplace,
            phone: teacher.phone,
            role: '4'
        }).then((resp) => {
            updateTeacher({
                id: teacher.id,
                userId: resp.id,
                institution: institutionSelected.map((i) => i.value),
                name: teacher.name,
                pegId: teacher.pegId,
                birthplace: teacher.birthplace,
                birthdate: moment(teacher.birthdate).format('YYYY-MM-DD'),
                gender: teacher.gender,
                frontTitle: teacher.frontTitle,
                backTitle: teacher.backTitle,
                phone: teacher.phone,
                email: teacher.email,
                address: teacher.address,
            }).then(() => {
                setLoading(false);
                setRefreshData(true);
                toggle();
            }).catch(() => {
                updateUser({
                    id: teacher.userId,
                    name: teacher.name,
                    email: teacher.email,
                    username: teacher.pegId,
                    password: teacher.birthplace,
                    phone: teacher.phone,
                    role: '4'
                }).then(() => {
                    setLoading(false);
                }).catch(() => {
                    setLoading(false)
                })
            })
        }).catch(() => {
            setLoading(false)
        });
    }
    const handleReset = () => {
        setTeacher({
            id: "",
            userId: "",
            institution: [],
            name: "",
            pageId: "",
            birthplace: "",
            birthdate: new Date(),
            gender: "",
            frontTitle: "",
            backTitle: "",
            phone: "",
            email: "",
            address: "",
        });
        setBirthdateSelected(new Date());
        setInstitutionSelected([]);
        reset();
    }
    const toggle = () => {
        setModal({
            partial: false,
            upload: false,
        });
        handleReset();
    };

    useEffect(() => {
        getInstitution({type: "select", ladder: 'alias'}).then((resp) => setInstitutionOptions(resp));
    }, []);

    useEffect(() => {
        setValue('id', teacher?.id)
        setValue('userId', teacher?.userId)
        setValue('name', teacher?.name)
        setValue('pegId', teacher?.pegId)
        setValue('birthplace', teacher?.birthplace)
        setValue('birthdate', teacher?.birthdate)
        setValue('gender', teacher?.gender)
        setValue('frontTitle', teacher?.frontTitle ? teacher.frontTitle : '')
        setValue('backTitle', teacher?.backTitle ? teacher.backTitle : '')
        setValue('phone', teacher?.phone)
        setValue('email', teacher?.email)
        setValue('address', teacher?.address)
        setInstitutionSelected(() => {
            return teacher?.institution?.map((i) => {
                return institutionOptions.find((c) => c.value === i.id);
            })
        })
    }, [teacher, setValue, institutionOptions])

    return (
        <Modal isOpen={modal.partial} toggle={toggle} size="md">
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross"/>
                </button>
            }>
                {teacher ? 'UBAH' : 'TAMBAH'}
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="institution">Pilih Lembaga</label>
                        <div className="form-control-wrap">
                            <RSelect
                                isMulti
                                options={institutionOptions}
                                value={institutionSelected}
                                onChange={(val) => {
                                    setInstitutionSelected(val);
                                    setValue('institution', val);
                                }}
                                placeholder="Pilih Lembaga"
                            />
                            <input type="hidden" id="institution" className="form-control" {...register('institution', {required: true})}/>
                            {errors.institution && <span className="invalid">Kolom tidak boleh kosong.</span>}
                        </div>
                    </div>
                    <Row className="gy-0">
                        <div className="form-group col-md-3">
                            <label className="form-label" htmlFor="frontTitle">Gelar Depan</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="frontTitle"
                                    placeholder="Ex. Drs,"
                                    {...register("frontTitle", {
                                        required: false,
                                        onChange: (e) => handleChange(e)
                                    })}
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
                                    {...register("name", {
                                        required: true,
                                        onChange: (e) => handleChange(e)
                                    })}
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
                                    {...register("backTitle", {
                                        required: false,
                                        onChange: (e) => handleChange(e)
                                    })}
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
                                    {...register("pegId", {
                                        required: true,
                                        onChange: (e) => handleChange(e)
                                    })}
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
                                    {...register("birthplace", {
                                        required: true,
                                        onChange: (e) => handleChange(e)
                                    })}
                                />
                                {errors.birthplace && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-4">
                            <label className="form-label" htmlFor="birthdate">Tanggal Lahir</label>
                            <div className="form-control-wrap">
                                <DatePicker
                                    locale="id"
                                    selected={birthdateSelected}
                                    onChange={(e) => {
                                        setValue('birthdate', e);
                                        setBirthdateSelected(e);
                                        setTeacher({...teacher, birthdate: e});
                                    }}
                                    dateFormat={"dd/MM/yyyy"}
                                    className="form-control date-picker"
                                    showMonthYearDropdown
                                />{" "}
                            </div>
                        </div>
                    </Row>
                    <Row className="gy-0">
                        <div className="form-group col-md-4">
                            <label className="form-label" htmlFor="gender">Jenis Kelamin</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={genderOptions}
                                    value={genderOptions?.find((c) => c.value === teacher.gender)}
                                    onChange={(e) => {
                                        setTeacher({...teacher, gender: e.value});
                                        setValue('gender', e.value);
                                    }}
                                    placeholder="Pilih Jenis Kelamin"
                                />
                                <input type="hidden" id="gender" className="form-control" {...register('gender', {required: true})} />
                                {errors.gender && <span className="invalid">Kolom tidak boleh kosong.</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-4">
                            <label className="form-label" htmlFor="phone">Nomor HP</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="phone"
                                    placeholder="Ex. 082229366500"
                                    {...register("phone", {
                                        required: true,
                                        onChange: (e) => handleChange(e)
                                    })}
                                />
                                {errors.phone && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-4">
                            <label className="form-label" htmlFor="email">Alamat Email</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="email"
                                    placeholder="Ex. info@darul-hikmah.sch.id"
                                    {...register("email", {
                                        required: true,
                                        onChange: (e) => handleChange(e)
                                    })}
                                />
                                {errors.email && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                    </Row>
                    <div className="form-group">
                        <label className="form-label" htmlFor="address">Alamat</label>
                        <div className="form-control-wrap">
                            <textarea
                                className="form-control"
                                id="address"
                                placeholder="Ex. Jl. Raya Jepara - Bugel KM 07 Menganti Kedung Jepara"
                                {...register("address", {
                                    required: false,
                                    onChange: (e) => handleChange(e)
                                })}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Button color="primary" type="submit" size="md">
                            {loading ? <Spinner size="sm"/> : 'SIMPAN'}
                        </Button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    )
}

export default Partial;