import React, {useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {useForm} from "react-hook-form";
import {Icon, Row, RSelect, RToast} from "@/components";
import {store as storeRombel, update as updateRombel} from "@/common/api/institution/rombel";
import {get as getLevel} from "@/common/api/master/level";
import {get as getMajor} from "@/common/api/master/major";
import {get as getTeacher} from "@/common/api/teacher";
import {store as storeActivity, update as updateActivity} from "@/common/api/teacher/activity";
import {OptionsType, PartialModalProps} from "@/common/types";
import {RombelType} from "@/common/types/model/institution/rombel";

interface PartialProps extends PartialModalProps<RombelType> {
    yearOptions: OptionsType[],
    institutionOptions: OptionsType[],
}
const Partial: React.FC<PartialProps> = ({ modal, setModal, data, setData, setReloadData, yearOptions, institutionOptions}) => {
    const [loading, setLoading] = useState(false);
    const [levelOptions, setLevelOptions] = useState<OptionsType[]>([]);
    const [majorOptions, setMajorOptions] = useState<OptionsType[]>([]);
    const [teacherOptions, setTeacherOptions] = useState<OptionsType[]>([]);
    const [institutionSelected, setInstitutionSelected] = useState([]);
    const {
        reset,
        handleSubmit,
        register,
        formState: {errors},
        setValue
    } = useForm<RombelType>();
    const onSubmit = (values: RombelType) => {
        setLoading(true);
        data.id === undefined ? onStore(values) : onUpdate(values);
    }
    const onStore = (formData: RombelType) => {
        storeRombel(formData).then((resp) => {
            storeActivity({
                yearId: resp.yearId,
                institutionId: resp.institutionId,
                teacherId: resp.teacherId,
                statusCode: 4,
                status: true
            }, false).then(() => {
                setReloadData(true)
                toggle()
            });
        }).finally(() => setLoading(false));
    }
    const onUpdate = (formData: RombelType) => {
        updateRombel(formData).then((resp) => {
            setLoading(false)
            setLoadData(true)
            toggle()
        }).catch(() => setLoading(false));
    }
    const handleReset = () => {
        setRombel({
            id: null,
            yearId: user.yearId,
            institutionId: user.role === '1' ? null : user.institutionId,
            levelId: null,
            majorId: null,
            teacherId: null,
            name: "",
            alias: ""
        });
        setInstitutionSelected([]);
        reset();
    }
    const toggle = () => {
        setModal(false);
        handleReset();
    };

    useEffect(() => {
        const {value, ladder} = institutionSelected !== undefined ? institutionSelected : false;
        modal && value !== undefined && getLevel({type: 'select', ladderId: ladder.id})
            .then((resp) => setLevelOptions(resp));
        modal && value !== undefined && getMajor({type: 'select', ladderId: ladder.id})
            .then((resp) => setMajorOptions(resp));
        modal && value !== undefined && getTeacher({type: 'select', yearId: user.yearId, institutionId: value})
            .then((resp) => setTeacherOptions(resp));
    }, [modal, institutionSelected, user]);

    useEffect(() => {
        setValue('id', rombel.id)
        setValue('yearId', rombel.yearId)
        setValue('institutionId', rombel.institutionId)
        setValue('levelId', rombel.levelId)
        setValue('majorId', rombel.majorId)
        setValue('name', rombel.name)
        setValue('alias', rombel.alias)
        setValue('teacherId', rombel.teacherId)
        setInstitutionSelected(institutionOptions.find((item) => item.value === rombel.institutionId));
    }, [institutionOptions, rombel, setValue]);

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
                        <div className={`form-group col-md-${user.role === '1' ? '6' : '12'}`}>
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
                        {user.role === '1' && (
                            <div className="form-group col-md-6">
                                <label className="form-label" htmlFor="institutionId">Lembaga</label>
                                <div className="form-control-wrap">
                                    <RSelect
                                        options={institutionOptions}
                                        value={institutionOptions?.find((c) => c.value === rombel.institutionId)}
                                        onChange={(e) => {
                                            setRombel({...rombel, institutionId: e.value});
                                            setInstitutionSelected(e);
                                            setValue('institutionId', e.value);
                                        }}
                                        placeholder="Pilih Lembaga"
                                    />
                                    <input type="hidden" id="institutionId" className="form-control" {...register("institutionId", {required: true})}/>
                                    {errors.institutionId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                                </div>
                            </div>
                        )}
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
                    </Row>
                </form>
            </ModalBody>
        </Modal>
    )
}

export default Partial;
