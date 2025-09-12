import React, {useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {useForm} from "react-hook-form";
import {Icon, RSelect} from "@/components";
import {store as storeYear, update as updateYear} from "@/api/master/year"

const Partial = ({modal, setModal, year, setYear, setRefreshData}) => {
    const [loading, setLoading] = useState(false);
    const activeOptions = [
        {value: 1, label: "Ya"},
        {value: 0, label: "Tidak"},
    ]
    const {
        reset,
        handleSubmit,
        register,
        formState: {errors},
        setValue
    } = useForm();
    const handleChange = (e) => {
        setYear({...year, [e.target.name] : e.target.value});
    }
    const onSubmit = () => {
        year.id === '' ? onStore() : onUpdate();
    }
    const onStore = () => {
        setLoading(true);
        storeYear(year).then(() => {
            setLoading(false)
            setRefreshData(true)
            toggle()
        }).catch(() => setLoading(false));
    }
    const onUpdate = () => {
        setLoading(true)
        updateYear(year).then(() => {
            setLoading(false)
            setRefreshData(true)
            toggle()
        }).catch(() => setLoading(false));
    }

    const handleReset = () => {
        setYear({
            id: '',
            name: '',
            description: '',
            active: false
        });
        reset();
    }
    const toggle = () => {
        setModal(false);
        handleReset();
    };
    useEffect(() => {
        setValue('id', year.id)
        setValue('name', year.name)
        setValue('description', year.description)
        setValue('active', year.active)
    }, [year, setValue])

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross"/>
                </button>
            }>
                {year.id !== '' ? 'UBAH' : 'TAMBAH'}
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">Nama Tahun</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                placeholder="Ex. 2024/2025"
                                {...register("name", {
                                    required: true,
                                    onChange: (e) => handleChange(e)
                                })}
                            />
                            {errors.name && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="description">Diskripsi</label>
                        <div className="form-control-wrap">
                            <textarea
                                className="form-control"
                                name="description"
                                placeholder="Ex. Tahun Pelajaran 2024/2025"
                                {...register("description", {
                                    required: false,
                                    onChange: (e) => handleChange(e)
                                })}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="active">Pilih Aktif</label>
                        <div className="form-control-wrap">
                            <RSelect
                                options={activeOptions}
                                value={activeOptions?.find((c) => c.value === year.active)}
                                onChange={(e) => {
                                    setYear({...year, active: e.value});
                                    setValue('active', e.value);
                                }}
                                placeholder="Pilih Aktif"
                            />
                            <input type="hidden" name="active" className="form-control" {...register("active", {required: true})} />
                            {errors.active && <span className="invalid">Kolom tidak boleh kosong.</span>}
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