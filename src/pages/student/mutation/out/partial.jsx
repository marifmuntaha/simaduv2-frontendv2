import React, {useEffect, useState} from "react";
import moment from "moment/moment";
import {Button, Input, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {useForm} from "react-hook-form";
import {Icon, RSelect} from "@/components";
import {store as storeMutation, update as updateMutation} from "@/api/student/mutation";
import {get as getStudent} from "@/api/student";
import {store as storeLetter} from "@/api/letter";

const Partial = ({user, modal, setModal, mutation, setMutation, setReloadData, yearOptions, institutionOptions}) => {
    const [loading, setLoading] = useState(false);
    const [yearSelected, setYearSelected] = useState([]);
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
        mutation.id === null ? onStore() : onUpdate();
    }
    const onStore = async () => {
        setLoading(true);
        const store = await storeMutation(mutation);
        if (!store) {
            setLoading(false);
        } else {
            const formData = {
                yearId: user.yearId,
                institutionId: user.role === '1' ? null : user.institutionId,
                number: store.numberLetter,
                type: "1.03",
                data: JSON.stringify({
                    name: store.student.name,
                    birthdate: store.student.birthplace + ', ' + moment(store.student.birthdate).format('DD MMMM YYYY'),
                    level: store.student.activity.rombel.level.name,
                    nisn: store.student.nisn,
                    gender: store.student.gender === 'L' ? 'Laki-laki' : 'Perempuan',
                    guardName: store.student.parent.guardName,
                    address: store.student.address,
                    description: store.description,
                }),
                signature: '2',
            }
            const letter = await storeLetter(formData);
            if (!letter) {
                setLoading(false);
            } else {
                setReloadData(true);
                setLoading(false);
            }
        }
    }
    const onUpdate = () => {
        setLoading(true);
        updateMutation(mutation).then(() => {
            setLoading(false);
            setReloadData(true);
            toggle();
        }).catch(() => setLoading(false));
    }
    const handleReset = () => {
        setMutation({
            id: null,
            yearId: user.yearId,
            institutionId: user.role === '1' ? null : user.institutionId,
            studentId: null,
            type: 1,
            token: '',
            numberLetter: '',
            description: "",
            file: "",
        });
        reset();
        setYearSelected([]);
        setInstitutionSelected([]);
        setStudentSelected([]);
    }
    const toggle = () => {
        setModal(false);
        handleReset();
    };

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
    }, [mutation, setValue]);

    useEffect(() => {
        modal && mutation.yearId !== null && mutation.institutionId !== null &&
            getStudent({type: 'select', yearId: mutation.yearId, institutionId: mutation.institutionId})
                .then(resp => {
                    setStudentOptions(resp);
                });
    }, [modal, mutation.yearId, mutation.institutionId]);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross"/>
                </button>
            }>
                {mutation.id !== null ? 'UBAH' : 'TAMBAH'}
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="yearId">Pilih Tahun Pelajaran</label>
                        <div className="form-control-wrap">
                            <RSelect
                                options={yearOptions}
                                value={yearOptions.find((e) => e.value === mutation.yearId)}
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
                    {user.role === '1' && (
                        <div className="form-group">
                            <label className="form-label" htmlFor="institutionId">Pilih Lembaga</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={institutionOptions}
                                    value={institutionOptions?.find((e) => e.value === mutation.institutionId)}
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
                    )}
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
                    <div className="form-group col-md-12">
                        <label className="form-label" htmlFor="file">Surat Keterangan EMIS</label>
                        <div className="form-control-wrap">
                            <div className="form-file">
                                <Input
                                    type="file"
                                    id="file"
                                    onChange={(e) => {
                                        setValue('file', e.target.files[0]);
                                        setMutation({...mutation, file: e.target.files[0]});
                                    }}
                                />
                            </div>
                            {errors.file && <span className="invalid">Kolom tidak boleh kosong</span>}
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
