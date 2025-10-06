import React, {useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {useForm} from "react-hook-form";
import {Icon, Row, RSelect} from "@/components";
import {store as storeProgram, update as updateProgram} from "@/api/institution/program";

const Partial = ({user, modal, setModal, program, setProgram, setLoadData, yearOptions, institutionOptions}) => {
    const [loading, setLoading] = useState(false);
    const {
        reset,
        handleSubmit,
        register,
        formState: {errors},
        setValue
    } = useForm();
    const handleChange = (e) => {
        setProgram({...program, [e.target.name]: e.target.value});
    }
    const onSubmit = () => {
        program.id === null ? onStore() : onUpdate();
    }
    const onStore = async () => {
        setLoading(true);
        const store = await storeProgram(program);
        if (store) {
            setLoading(false);
            setLoadData(true);
            toggle();
        } else {
            setLoading(false);
        }
    }
    const onUpdate = async () => {
        setLoading(true)
        const update = await updateProgram(program);
        if (update) {
            setLoading(false);
            setLoadData(true);
            toggle();
        } else {
            setLoading(false);
        }
    }
    const handleReset = () => {
        setProgram({
            id: null,
            yearId: user.yearId,
            institutionId: user.role === '1' ? null : user.institutionId,
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
        setValue('id', program.id);
        setValue('yearId', program.yearId);
        setValue('institutionId', program.institutionId);
        setValue('name', program.name);
        setValue('alias', program.alias);
    }, [program, setValue]);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross"/>
                </button>
            }>
                {program.id === null ? 'TAMBAH' : 'UBAH'}
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <Row className="gy-0">
                        <div className={`form-group col-md-${user.role === '1' ? '6' : '12'}`}>
                            <label className="form-label" htmlFor="yearId">Tahun Pelajaran</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={yearOptions}
                                    value={yearOptions?.find((c) => c.value === program.yearId)}
                                    onChange={(e) => {
                                        setProgram({...program, yearId: e.value});
                                        setValue('yearId', e.value);
                                    }}
                                    placeholder="Pilih Tahun Pelajaran"
                                />
                                <input type="hidden" id="yearId" className="form-control" {...register("yearId", {required: true})} />
                                {errors.yearId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                            </div>
                        </div>
                        {user.role === '1' && (
                            <div className="form-group col-md-6">
                                <label className="form-label" htmlFor="institutionId">Pilih Lembaga</label>
                                <div className="form-control-wrap">
                                    <RSelect
                                        options={institutionOptions}
                                        value={institutionOptions?.find((c) => c.value === program.institutionId)}
                                        onChange={(e) => {
                                            setProgram({...program, institutionId: e.value});
                                            setValue('institutionId', e.value);
                                        }}
                                        placeholder="Pilih Lembaga"
                                    />
                                    <input type="hidden" id="institutionId" className="form-control" {...register("institutionId", {required: true})} />
                                    {errors.institutionId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                                </div>
                            </div>
                        )}
                        <div className="form-group">
                            <label className="form-label" htmlFor="name">Nama Program</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder="Ex. Tahfid"
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
                                    placeholder="Ex. TFZ"
                                    {...register("alias", {
                                        required: true,
                                        onChange: (e) => handleChange(e)
                                    })}
                                />
                                {errors.alias && <span className="invalid">Kolom tidak boleh kosong</span>}
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
