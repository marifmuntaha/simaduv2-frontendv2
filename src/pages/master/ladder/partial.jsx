import React, {useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {useForm} from "react-hook-form";
import {Icon} from "@/components";
import {store as storeLadder, update as updateLadder} from "@/api/master/ladder"

const Partial = ({modal, setModal, ladder, setLadder, setRefreshData}) => {
    const [loading, setLoading] = useState(false);
    const {handleSubmit, reset, register, formState: {errors}, setValue} = useForm();
    const handleChange = (e) => {
        setLadder({...ladder, [e.target.name]: e.target.value});
    }
    const onSubmit = () => {
        ladder.id === "" ? onStore() : onUpdate();
    }
    const onStore = () => {
        setLoading(true);
        storeLadder(ladder).then(() => {
            setLoading(false)
            setRefreshData(true)
            toggle()
        }).catch(() => setLoading(false));
    }
    const onUpdate = () => {
        setLoading(true);
        updateLadder(ladder).then(() => {
            setLoading(false)
            setRefreshData(true)
            toggle();
        }).catch(() => setLoading(false));
    }
    const handleReset = () => {
        setLadder({
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
        setValue('id', ladder.id);
        setValue('name', ladder.name);
        setValue('alias', ladder.alias);
        setValue('description', ladder.description);
    }, [ladder, setValue])

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross"/>
                </button>
            }>
                {ladder.id !== "" ? 'UBAH' : 'TAMBAH'}
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">Nama Jenjang</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                placeholder="Ex. Madrasah Aliyah"
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
                                placeholder="Ex. Madrasah Aliyah"
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