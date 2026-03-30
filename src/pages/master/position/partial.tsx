import React, {useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {useForm} from "react-hook-form";
import {Icon} from "@/components";
import {store as storePosition, update as updatePosition} from "@/common/api/master/position";
import {PartialModalProps, PositionType} from "@/common/types";


const Partial = ({
                     modal,
                     setModal,
                     data,
                     setData,
                     setReloadData
} : PartialModalProps<PositionType>) => {
    const [loading, setLoading] = useState(false);
    const {
        reset,
        handleSubmit,
        register,
        formState: {errors},
        setValue
    } = useForm<PositionType>();

    const onSubmit = (values: PositionType) => {
        data.id === undefined ? onStore(values) : onUpdate(values);
    }
    const onStore = async (formData: PositionType) => {
        setLoading(true);
        const store = await storePosition(formData).then((resp) => resp);
        if (store) {
            setLoading(false);
            setReloadData(true);
            toggle();
        } else {
            setLoading(false);
        }
    }
    const onUpdate = async (formData: PositionType) => {
        setLoading(true)
        const update = await updatePosition(formData).then((resp) => resp);
        if (update) {
            setLoading(false);
            setReloadData(true);
            toggle();
        } else {
            setLoading(false);
        }
    }
    const handleReset = () => {
        setData({
            id: undefined,
            name: '',
            description: '',
            alias: ''
        });
        reset();
    }
    const toggle = () => {
        setModal(false);
        handleReset();
    };
    useEffect(() => {
        setValue('id', data.id)
        setValue('name', data.name);
        setValue('description', data.description);
        setValue('alias', data.alias);
    }, [data, setValue]);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross"/>
                </button>
            }>
                {data.id === undefined ? 'TAMBAH' : 'UBAH'}
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">Nama Posisi</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Ex. Kepala Madrasah"
                                {...register("name", {
                                    required: true,
                                })}
                            />
                            {errors.name && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="description">Deskripsi</label>
                        <div className="form-control-wrap">
                            <textarea
                                className="form-control"
                                placeholder="Ex. Jabatan Struktural Kepala Madrasah"
                                {...register("description", {
                                    required: false,
                                })}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">Singkatan</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Ex. Kamad"
                                {...register("alias", {
                                    required: true,
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
                </form>
            </ModalBody>
        </Modal>
    )
}

export default Partial;
