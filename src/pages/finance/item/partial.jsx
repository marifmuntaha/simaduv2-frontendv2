import React, {useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {useForm} from "react-hook-form";
import {Icon, Row, RSelect} from "@/components/index.jsx";
import {store as storeItem, update as updateItem} from "@/api/finance/item.jsx";
import {get as getInstitution} from "@/api/institution.jsx";
import {get as getAccount} from "@/api/finance/account.jsx";

const Partial = ({modal, setModal, item, setItem, setReloadData}) => {
    const [loading, setLoading] = useState(false);
    const [institutionOptions, setInstitutionOptions] = useState([]);
    const [accountOptions, setAccountOptions] = useState([]);
    const {handleSubmit, reset, register, formState: {errors}, setValue} = useForm();
    const handleChange = (e) => {
        setItem({...item, [e.target.name]: e.target.value});
    }
    const onSubmit = () => {
        item.id === "" ? onStore() : onUpdate();
    }
    const onStore = async () => {
        setLoading(true);
        const store = await storeItem(item);
        if (store) {
            setLoading(false);
            setReloadData(true);
            toggle()
        } else {
            setLoading(false);
        }
    }
    const onUpdate = async () => {
        setLoading(true);
        const update = await updateItem(item);
        if (update) {
            setLoading(false);
            setReloadData(true);
            toggle();
        } else {
            setLoading(false);
        }
    }
    const handleReset = () => {
        setItem({
            id: "",
            institutionId: "",
            accountAppId: "",
            accountRevId: "",
            name: "",
            alias: "",
            repeat: "",
        });
        reset();
    }
    const toggle = () => {
        setModal(false);
        handleReset();
    };
    const repeatOptions = [
        {value: '1', label: "Ya"},
        {value: '2', label: "Tidak"},
    ];

    useEffect(() => {
        setValue('id', item.id);
        setValue('yearId', item.yearId);
        setValue('institutionId', item.institutionId);
        setValue('accountId', item.accountId);
        setValue('name', item.name);
        setValue('alias', item.alias);
        setValue('gender', item.gender);
        setValue('programId', item.programId);
        setValue('boardingId', item.boardingId);
        setValue('repeat', item.repeat);
        setValue('price', item.price);
    }, [item, setValue]);

    useEffect(() => {
        getInstitution({type: 'select', ladder: 'alias'}).then(data => setInstitutionOptions(data));
    }, []);

    useEffect(() => {
        getAccount({institutionId: item.institutionId, level: '4', type: 'select'}).then(data => setAccountOptions(data));
    }, [item.institutionId]);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross"/>
                </button>
            }>
                {item.id !== "" ? 'UBAH' : 'TAMBAH'}
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <Row className="gy-0">
                        <div className="form-group col-md-12">
                            <label className="form-label" htmlFor="institutionId">Pilih Lembaga</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={institutionOptions}
                                    value={institutionOptions?.find((c) => c.value === item.institutionId)}
                                    onChange={(e) => {
                                        setItem({...item, institutionId: e.value});
                                        setValue('institutionId', e.value);
                                    }}
                                    placeholder="Pilih Lembaga"
                                />
                                <input type="hidden" id="institutionId"
                                       className="form-control" {...register("institutionId", {required: true})} />
                                {errors.institutionId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="name">Nama Item</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    placeholder="Ex. Seragam"
                                    {...register("name", {
                                        required: true,
                                        onChange: (e) => handleChange(e)
                                    })}
                                />
                                {errors.name && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="alias">Alias</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="alias"
                                    placeholder="Ex. Seragam"
                                    {...register("alias", {
                                        required: true,
                                        onChange: (e) => handleChange(e)
                                    })}
                                />
                                {errors.alias && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="accountAppId">Rekening Perkiraan</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={accountOptions}
                                    value={accountOptions?.find((c) => c.value === item.accountAppId)}
                                    onChange={(e) => {
                                        setItem({...item, accountAppId: e.value});
                                        setValue('accountAppId', e.value);
                                    }}
                                    placeholder="Pilih Rekening"
                                />
                                <input type="hidden" id="accountAppId"
                                       className="form-control" {...register("accountAppId", {required: true})} />
                                {errors.accountAppId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="accountRevId">Rekening Pendapatan</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={accountOptions}
                                    value={accountOptions?.find((c) => c.value === item.accountRevId)}
                                    onChange={(e) => {
                                        setItem({...item, accountRevId: e.value});
                                        setValue('accountRevId', e.value);
                                    }}
                                    placeholder="Pilih Rekening"
                                />
                                <input type="hidden" id="accountRevId"
                                       className="form-control" {...register("accountRevId", {required: true})} />
                                {errors.accountRevId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-12">
                            <label className="form-label" htmlFor="repeat">Tagihan Bulanan</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={repeatOptions}
                                    value={repeatOptions?.find((c) => c.value === item.repeat)}
                                    onChange={(e) => {
                                        setItem({...item, repeat: e.value});
                                        setValue('repeat', e.value);
                                    }}
                                    placeholder="Tagihan Bulanan"
                                />
                                <input type="hidden" id="repeat"
                                       className="form-control" {...register("repeat", {required: true})} />
                                {errors.repeat && <span className="invalid">Kolom tidak boleh kosong.</span>}
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
