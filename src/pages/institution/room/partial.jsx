import React, {useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {useForm} from "react-hook-form";
import {Icon, Row, RSelect} from "@/components";
import {store as storeRoom, update as updateRoom} from "@/api/institution/room";

const Partial = ({modal, setModal, room, setRoom, setLoadData, yearOptions}) => {
    const [loading, setLoading] = useState(false);
    const {
        reset,
        handleSubmit,
        register,
        formState: {errors},
        setValue
    } = useForm();
    const handleChange = (e) => {
        setRoom({...room, [e.target.name]: e.target.value});
    }
    const onSubmit = () => {
        room.id === null ? onStore() : onUpdate();
    }
    const onStore = async () => {
        setLoading(true);
        const store = await storeRoom(room);
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
        const update = await updateRoom(room);
        if (update) {
            setLoading(false);
            setLoadData(true);
            toggle();
        } else {
            setLoading(false);
        }
    }
    const handleReset = () => {
        setRoom({
            id: null,
            yearId: null,
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
        setValue('id', room.id);
        setValue('yearId', room.yearId);
        setValue('name', room.name);
        setValue('alias', room.alias);
    }, [room, setValue]);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross"/>
                </button>
            }>
                {room.id === null ? 'TAMBAH' : 'UBAH'}
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <Row className="gy-0">
                        <div className="form-group col-md-12">
                            <label className="form-label" htmlFor="yearId">Tahun Pelajaran</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={yearOptions}
                                    value={yearOptions?.find((c) => c.value === room.yearId)}
                                    onChange={(e) => {
                                        setRoom({...room, yearId: e.value});
                                        setValue('yearId', e.value);
                                    }}
                                    placeholder="Pilih Tahun Pelajaran"
                                />
                                <input type="hidden" id="yearId" className="form-control" {...register("yearId", {required: true})} />
                                {errors.yearId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="name">Nama Kamar</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder="Ex. Abdullah"
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
                                    placeholder="Ex. ABD"
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
