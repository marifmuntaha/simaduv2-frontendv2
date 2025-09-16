import React, {useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {useForm} from "react-hook-form";
import {Icon, RSelect} from "@/components";
import {get as getMutation, store as storeMutation, update as updateMutation} from "@/api/student/mutation";
import {get as getYear} from "@/api/master/year";
import {get as getInstitution} from "@/api/institution";
import {get as getStudent} from "@/api/student";
import {generateSecureToken, zeroPad} from "@/utils";

const Partial = ({modal, setModal, mutation, setMutation, setReloadData}) => {
    const [loading, setLoading] = useState(false);
    const [yearOptions, setYearOptions] = useState([]);
    const [yearSelected, setYearSelected] = useState([]);
    const [institutionOptions, setInstitutionOptions] = useState([]);
    const [institutionSelected, setInstitutionSelected] = useState([]);
    const [studentOptions, setStudentOptions] = useState([]);
    const [studentSelected, setStudentSelected] = useState([]);
    const {
        handleSubmit,
        reset,
        register,
        formState: {errors},
        setValue
    } = useForm();
    const handleChange = (e) => {
        setMutation({...mutation, [e.target.name]: e.target.value});
    }
    const onSubmit = () => {
        mutation.id === "" ? onStore() : onUpdate();
    }
    const onStore = () => {
        setLoading(true);
        getMutation({latest: 'number'}).then((resp) => {
            const formData = {
                yearId: mutation.yearId,
                institutionId: mutation.institutionId,
                studentId: mutation.studentId,
                type: 1,
                token: generateSecureToken(),
                numberLetter: zeroPad(resp[0]?.numberLetter + 1, 3),
            }
            storeMutation(formData).then(() => {
                setLoading(false)
                setReloadData(true)
                toggle()
            }).catch(() => setLoading(false));
        });
    }
    const onUpdate = () => {
        setLoading(true);
        updateMutation(mutation).then(() => {
            setLoading(false)
            setReloadData(true)
            toggle();
        }).catch(() => setLoading(false));
    }
    const handleReset = () => {
        setMutation({
            id: "",
            yearId: "",
            institutionId: "",
            studentId: "",
            type: 1,
            token: '',
            numberLetter: '',
            description: "",
        });
        reset();
    }
    const toggle = () => {
        setModal(false);
        handleReset();
    };

    useEffect(() => {
        getYear({type: 'select'}).then(data => setYearOptions(data));
        getInstitution({type: 'select', ladder: 'alias'}).then(data => setInstitutionOptions(data));
    }, []);

    useEffect(() => {
        yearSelected.value !== undefined && institutionSelected.value !== undefined && getStudent({
            type: 'select',
            yearSelected: yearSelected.value,
            institutionSelected: institutionSelected.value,
        }).then(data => setStudentOptions(data));
    }, [yearSelected, institutionSelected]);

    useEffect(() => {
        setValue('id', mutation.id);
        setValue('yearId', mutation.yearId);
        setValue('institutionId', mutation.institutionId);
        setValue('studentId', mutation.studentId);
        setValue('description', mutation.description);
    }, [mutation, setValue])

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross"/>
                </button>
            }>
                {mutation.id !== "" ? 'UBAH' : 'TAMBAH'}
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="yearId">Pilih Tahun Pelajaran</label>
                        <div className="form-control-wrap">
                            <RSelect
                                options={yearOptions}
                                value={yearSelected}
                                onChange={(e) => {
                                    setMutation({...mutation, yearId: e.value})
                                    setYearSelected(e);
                                    setValue('yearId', e.value);
                                }}
                                placeholder="Pilih Tahun Pelajaran"
                            />
                            <input type="hidden" className="form-control" id="yearId" {...register('yearId', {required: true})} />
                            {errors.yearId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="institutionId">Pilih Lembaga</label>
                        <div className="form-control-wrap">
                            <RSelect
                                options={institutionOptions}
                                value={institutionSelected}
                                onChange={(e) => {
                                    setMutation({...mutation, institutionId: e.value})
                                    setInstitutionSelected(e);
                                    setValue('institutionId', e.value);
                                }}
                                placeholder="Pilih Lembaga"
                            />
                            <input type="hidden" className="form-control" id="institutionId" {...register('institutionId', {required: true})} />
                            {errors.institutionId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="studentId">Pilih Siswa</label>
                        <div className="form-control-wrap">
                            <RSelect
                                options={studentOptions}
                                value={studentSelected}
                                onChange={(e) => {
                                    setMutation({...mutation, studentId: e.value})
                                    setStudentSelected(e);
                                    setValue('studentId', e.value);
                                }}
                                placeholder="Pilih Siswa"
                            />
                            <input type="hidden" className="form-control" id="studentId" {...register('studentId', {required: true})} />
                            {errors.studentId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="description">Diskripsi</label>
                        <div className="form-control-wrap">
                            <textarea
                                className="form-control"
                                id="description"
                                placeholder="Ex. Madrasah Aliyah"
                                {...register("description", {
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
