import React, {useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {useForm} from "react-hook-form";
import {Icon, RSelect} from "@/components";
import {store as storeMajor, update as updateMajor} from "@/api/master/major"
import {get as getLadder} from "@/api/master/ladder"

const Partial = ({modal, setModal, major, setMajor, setLoadData}) => {
    const [loading, setLoading] = useState(false);
    const [ladderOptions, setLadderOptions] = useState([]);
    const {
        reset,
        handleSubmit,
        register,
        formState: {errors},
        setValue
    } = useForm();
    const handleChange = (e) => {
        setMajor({...major, [e.target.name]: e.target.value});
    }
    const onSubmit = () => {
        major.id === '' ? onStore() : onUpdate();
    }
    const onStore = async () => {
        setLoading(true);
        const store = await storeMajor(major)
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
        const update = await updateMajor(major);
        if (update) {
            setLoading(false);
            setLoadData(true);
            toggle();
        } else {
            setLoading(false);
        }
    }
    const handleReset = () => {
        setMajor({
            id: '',
            ladderId: '',
            name: '',
            alias: '',
            description: '',
        });
        reset();
    }
    const toggle = () => {
        setModal(false);
        handleReset();
    };

    useEffect(() => {
        setValue('id', major.id);
        setValue('ladderId', major.ladderId);
        setValue('name', major.name);
        setValue('alias', major.alias);
        setValue('description', major.description);
    }, [major, setValue]);

    useEffect(() => {
        getLadder({type: 'select'}).then(data => {
            setLadderOptions(data)
        });
    }, []);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross"/>
                </button>
            }>
                {major.id !== '' ? 'UBAH' : 'TAMBAH'}
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="ladderId">Pilih Jenjang</label>
                        <div className="form-control-wrap">
                            <RSelect
                                options={ladderOptions}
                                value={ladderOptions?.find((c) => c.value === major.ladderId)}
                                onChange={(e) => {
                                    setMajor({...major, ladderId: e.value});
                                    setValue('ladderId', e.value);
                                }}
                                placeholder="Pilih Jenjang"
                            />
                            <input type="hidden" className="form-control" id="ladderId" {...register('ladderId', {required: true})} />
                            {errors.ladderId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">Nama Jurusan</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                placeholder="Ex. Ilmu Pengetahuan Alam"
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
                                name="alias"
                                placeholder="Ex. IPA"
                                {...register("alias", {
                                    required: true,
                                    onChange: (e) => handleChange(e)
                                })}
                            />
                            {errors.alias && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="description">Diskripsi</label>
                        <div className="form-control-wrap">
                            <textarea
                                className="form-control"
                                name="description"
                                placeholder="Ex. Jurusan Ilmu Pengetahuan Alam"
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
