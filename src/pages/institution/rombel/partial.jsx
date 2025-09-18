import React, {useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {useForm} from "react-hook-form";
import {Icon, Row, RSelect} from "@/components";
import {store as storeRombel, update as updateRombel} from "@/api/institution/rombel"
import {get as getYear} from "@/api/master/year"
import {get as getInstitution} from "@/api/institution"
import {get as getLevel} from "@/api/master/level"
import {get as getMajor} from "@/api/master/major"
import {get as getTeacher} from "@/api/teacher"

const Partial = ({modal, setModal, rombel, setRombel, setLoadData}) => {
    const [loading, setLoading] = useState(false);
    const [yearOptions, setYearOptions] = useState([]);
    const [institutionOptions, setInstitutionOptions] = useState([]);
    const [ladder, setLadder] = useState(0);
    const [levelOptions, setLevelOptions] = useState([]);
    const [majorOptions, setMajorOptions] = useState([]);
    const [teacherOptions, setTeacherOptions] = useState([]);
    const {
        reset,
        handleSubmit,
        register,
        formState: {errors},
        setValue
    } = useForm();
    const handleChange = (e) => {
        setRombel({...rombel, [e.target.name]: e.target.value});
    }
    const onSubmit = () => {
        rombel.id === '' ? onStore() : onUpdate();
    }
    const onStore = async () => {
        setLoading(true);
        await storeRombel(rombel).then(() => {
            setLoading(false)
            setLoadData(true)
            toggle()
        }).catch(() => setLoading(false));
    }
    const onUpdate = async () => {
        setLoading(true)
        await updateRombel(rombel).then(() => {
            setLoading(false)
            setLoadData(true)
            toggle()
        }).catch(() => setLoading(false));
    }
    const handleReset = () => {
        setRombel({
            id: "",
            yearId: "",
            institutionId: "",
            teacherId: "",
            levelId: "",
            majorId: "",
            name: "",
            alias: ""
        });
        reset();
    }
    const toggle = () => {
        setModal(false);
        handleReset();
    };

    useEffect(() => {
        getYear({type: 'select'}).then((resp) => setYearOptions(resp));
        getInstitution({type: 'select', ladder: 'alias'}).then((resp) => setInstitutionOptions(resp));
    }, [])

    useEffect(() => {
        getLevel({type: 'select', ladderId: ladder}).then((resp) => {
            setLevelOptions(resp)
        });
        getMajor({type: 'select', ladderId: ladder}).then((resp) => setMajorOptions(resp));
        getTeacher({type: 'select', institutionId: rombel.institutionId}).then((resp) => setTeacherOptions(resp));
    }, [rombel, ladder])

    useEffect(() => {
        setValue('id', rombel.id)
        setValue('yearId', rombel.yearId)
        setValue('institutionId', rombel.institutionId)
        setValue('levelId', rombel.levelId)
        setValue('majorId', rombel.majorId)
        setValue('name', rombel.name)
        setValue('alias', rombel.alias)
        setValue('teacherId', rombel.teacherId)
    }, [rombel, setValue])

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross"/>
                </button>
            }>
                {rombel.id !== '' ? 'UBAH' : 'TAMBAH'}
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <Row className="gy-0">
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="yearId">Tahun Pelajaran</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={yearOptions}
                                    value={yearOptions?.find((c) => c.value === rombel.yearId)}
                                    onChange={(e) => {
                                        setRombel({...rombel, yearId: e.value});
                                        setValue('yearId', e.value)
                                    }}
                                    placeholder="Pilih Tahun Pelajaran"
                                />
                                <input type="hidden" id="yearId" className="form-control" {...register("yearId", {required: true})} />
                                {errors.yearId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="institutionId">Lembaga</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={institutionOptions}
                                    value={institutionOptions?.find((c) => c.value === rombel.institutionId)}
                                    onChange={(e) => {
                                        setRombel({...rombel, institutionId: e.value});
                                        setValue('institutionId', e.value);
                                        setLadder(e.ladderId)
                                    }}
                                    placeholder="Pilih Lembaga"
                                />
                                <input type="hidden" id="institutionId" className="form-control" {...register("institutionId", {required: true})}/>
                                {errors.institutionId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                            </div>
                        </div>
                    </Row>
                    <Row className="gy-0">
                        <div className="form-group col-md-4">
                            <label className="form-label" htmlFor="levelId">Tingkat</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={levelOptions}
                                    value={levelOptions?.find((c) => c.value === rombel.levelId)}
                                    onChange={(e) => {
                                        setRombel({...rombel, levelId: e.value});
                                        setValue('levelId', e.value)
                                    }}
                                    placeholder="Pilih Tingkat"
                                />
                                <input type="hidden" id="levelId" className="form-control" {...register('levelId', {required: true})} />
                                {errors.levelId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-4">
                            <label className="form-label" htmlFor="majorId">Jurusan</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={majorOptions}
                                    value={majorOptions?.find((c) => c.value === rombel.majorId)}
                                    onChange={(e) => {
                                        setRombel({...rombel, majorId: e.value});
                                        setValue('majorId', e.value)
                                    }}
                                    placeholder="Pilih Jurusan"
                                />
                                <input type="hidden" id="majorId" className="form-control" {...register("majorId", {required: true})} />
                                {errors.majorId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-4">
                            <label className="form-label" htmlFor="name">Nama</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder="Ex. A, 1, B, 2"
                                    {...register("name", {
                                        required: true,
                                        onChange: (e) => handleChange(e)
                                    })}
                                />
                                {errors.name && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                    </Row>
                    <div className="form-group">
                        <label className="form-label" htmlFor="alias">Alias</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                className="form-control"
                                id="alias"
                                placeholder="Ex. XII.IPA.2"
                                {...register("alias", {
                                    required: true,
                                    onChange: (e) => handleChange(e)
                                })}
                            />
                            {errors.alias && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="teacherId">Walikelas</label>
                        <div className="form-control-wrap">
                            <RSelect
                                options={teacherOptions}
                                value={teacherOptions?.find((c) => c.value === rombel.teacherId)}
                                onChange={(e) => {
                                    setRombel({...rombel, teacherId: e.value});
                                    setValue('teacherId', e.value)
                                }}
                                placeholder="Pilih Walikelas"
                            />
                            <input type="hidden" id="teacherId" className="form-control" {...register("teacherId", {required: true})} />
                            {errors.teacherId && <span className="invalid">Kolom tidak boleh kosong.</span>}
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
