import React, {useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {useForm} from "react-hook-form";
import {Icon} from "@/components";
import {store as storeLadder, update as updateLadder} from "@/common/api/master/ladder";
import {LadderType, PartialModalProps} from "@/common/types";


const Partial = ({modal, setModal, data, setData, setReloadData}: PartialModalProps<LadderType>) => {
    const [loading, setLoading] = useState(false);
    const {handleSubmit, reset, register, formState: {errors}, setValue} = useForm<LadderType>();

    const onSubmit = (values: LadderType) => {
        setLoading(true);
        data.id === undefined ? onStore(values) : onUpdate(values);
    }
    const onStore = (formData: LadderType) => {
        storeLadder(formData).then((resp) => {
            if (resp.status === 'success') {
                setReloadData(true)
                toggle()
            }
        })
            .catch((error) => console.log(error))
            .finally(() => setLoading(false))
    }
    const onUpdate = (formData: LadderType) => {
        updateLadder(formData).then((resp) => {
            if (resp.status === 'success') {
                setReloadData(true);
                toggle();
            }
        })
            .catch((error) => console.log(error))
            .finally(() => setLoading(false))
    }
    const handleReset = () => {
        setData({
            id: undefined,
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
        setValue('id', data.id ?? undefined);
        setValue('name', data.name);
        setValue('alias', data.alias);
        setValue('description', data.description);
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
                        <label className="form-label" htmlFor="name">Nama Jenjang</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Ex. Madrasah Aliyah"
                                {...register("name", {
                                    required: true,
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
                                placeholder="Ex. Madrasah Aliyah"
                                {...register("alias", {
                                    required: true,
                                })}
                            />
                            {errors.alias && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="description">Deskripsi</label>
                        <div className="form-control-wrap">
                            <textarea
                                className="form-control"
                                id="description"
                                placeholder="Ex. Madrasah Aliyah"
                                {...register("description", {
                                    required: false,
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
