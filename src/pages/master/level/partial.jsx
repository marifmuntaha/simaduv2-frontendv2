import React, {useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {useForm} from "react-hook-form";
import {Icon, RSelect} from "@/components";
import {store as storeLevel, update as updateLevel} from "@/api/master/level"
import {get as getLadder} from "@/api/master/ladder"

const Partial = ({modal, setModal, level, setLevel, setReloadData}) => {
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
        setLevel({...level, [e.target.name]: e.target.value});
    }
    const onSubmit = () => {
        level.id === '' ? onStore() : onUpdate();
    }
    const onStore = async () => {
        setLoading(true);
        const store = await storeLevel(level);
        if (store) {
            setLoading(false);
            setReloadData(true);
            toggle();
        } else {
            setLoading(false);
        }
    }
    const onUpdate = async () => {
        setLoading(true)
        const update = await updateLevel(level);
        if (update) {
            setLoading(false);
            setReloadData(true);
            toggle();
        } else {
            setLoading(false);
        }
    }

    const handleReset = () => {
        setLevel({
            id: "",
            ladderId: "",
            name: "",
            alias: "",
            description: "",
        });
        reset();
    }
    const toggle = () => {
        setModal(false);
        handleReset();
    };

    useEffect(() => {
        getLadder({type: 'select'}).then(data => {
            setLadderOptions(data)
        });
    }, []);

    useEffect(() => {
        setValue('ladderId', level.ladderId);
        setValue('name', level.name);
        setValue('alias', level.alias);
        setValue('description', level.description);
    }, [level, setValue]);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross"/>
                </button>
            }>
                {level.id !== "" ? 'UBAH' : 'TAMBAH'}
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="ladderId">Pilih Jenjang</label>
                        <div className="form-control-wrap">
                            <RSelect
                                options={ladderOptions}
                                value={ladderOptions?.find((c) => c.value === level.ladderId)}
                                onChange={(e) => {
                                    setLevel({...level, ladderId: e.value});
                                    setValue('ladderId', e.value);
                                }}
                                placeholder="Pilih Jenjang"
                            />
                            <input type="hidden" className="form-control" id="ladderId" {...register('ladderId', {required: true})} />
                            {errors.ladderId && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">Nama Tingkat</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                placeholder="Ex. 1"
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
                                placeholder="Ex. I"
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
                                placeholder="Ex. Tingkat 1"
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
