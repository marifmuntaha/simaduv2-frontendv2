import React, {useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {Controller, useForm} from "react-hook-form";
import {Icon, RSelect} from "@/components";
import {store as storeLevel, update as updateLevel} from "@/common/api/master/level";
import {get as getLadder} from "@/common/api/master/ladder";
import {LevelType, OptionsType, PartialModalProps} from "@/common/types";

const Partial = ({modal, setModal, data, setData, setReloadData}: PartialModalProps<LevelType>) => {
    const [loading, setLoading] = useState(false);
    const [ladderOptions, setLadderOptions] = useState<OptionsType[]>();
    const {
        control,
        reset,
        handleSubmit,
        register,
        formState: {errors},
        setValue
    } = useForm<LevelType>();
    const onSubmit = (values: LevelType) => {
        data.id === undefined ? onStore(values) : onUpdate(values);
    }
    const onStore = async (values: LevelType) => {
        setLoading(true);
        const store = await storeLevel(values);
        if (store) {
            setLoading(false);
            setReloadData(true);
            toggle();
        } else {
            setLoading(false);
        }
    }
    const onUpdate = async (values: LevelType) => {
        setLoading(true)
        const update = await updateLevel(values);
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
            ladderId: undefined,
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
        modal && getLadder<OptionsType>({type: 'select'}).then(data => {
            setLadderOptions(data);
        });
    }, [modal]);

    useEffect(() => {
        setValue('id', data.id ?? undefined)
        setValue('ladderId', data.ladderId);
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
                        <label className="form-label" htmlFor="ladderId">Pilih Jenjang</label>
                        <Controller
                            control={control}
                            name="ladderId"
                            rules={{required: true}}
                            render={({field: {value, onChange}}) => (
                                <React.Fragment>
                                    <div className="form-control-wrap">
                                        <RSelect
                                            options={ladderOptions}
                                            value={ladderOptions?.find((c) => c.value === value)}
                                            onChange={(e) => onChange(e?.value)}
                                            placeholder="Pilih Jenjang"
                                        />
                                        <input type="hidden" className="form-control" id="ladderId"/>
                                        {errors.ladderId && <span className="invalid">Kolom tidak boleh kosong</span>}
                                    </div>
                                </React.Fragment>
                            )}
                            />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">Nama Tingkat</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Ex. 1"
                                {...register("name", {required: true})}
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
                                placeholder="Ex. I"
                                {...register("alias", {required: true})}
                            />
                            {errors.alias && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="description">Deskripsi</label>
                        <div className="form-control-wrap">
                            <textarea
                                className="form-control"
                                placeholder="Ex. Tingkat 1"
                                {...register("description", {required: false})}
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
