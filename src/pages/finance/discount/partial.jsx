import React, {useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {useForm} from "react-hook-form";
import {Icon, Row, RSelect} from "@/components/index.jsx";
import {store as storeItem, update as updateItem} from "@/api/finance/item";
import {get as getYear} from "@/api/master/year";
import {get as getInstitution} from "@/api/institution";
import {get as getItem} from "@/api/finance/item";

const Partial = ({modal, setModal, discount, setDiscount, setReloadData}) => {
    const [loading, setLoading] = useState(false);
    const [yearOptions, setYearOptions] = useState([]);
    const [institutionOptions, setInstitutionOptions] = useState([]);
    const [itemOptions, setItemOptions] = useState([]);
    const [accountOptions, setAccountOptions] = useState([]);
    const {handleSubmit, reset, register, formState: {errors}, setValue} = useForm();
    const handleChange = (e) => {
        setDiscount({...discount, [e.target.name]: e.target.value});
    }
    const onSubmit = () => {
        discount.id === "" ? onStore() : onUpdate();
    }
    const onStore = async () => {
        setLoading(true);
        const store = await storeItem(discount);
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
        const update = await updateItem(discount);
        if (update) {
            setLoading(false);
            setReloadData(true);
            toggle();
        } else {
            setLoading(false);
        }
    }
    const handleReset = () => {
        setDiscount({
            id: "",
            institutionId: "",
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

    // useEffect(() => {
    //     setValue('id', item.id);
    //     setValue('institutionId', item.institutionId);
    //     setValue('accountRevId', item.accountRevId);
    //     setValue('name', item.name);
    //     setValue('alias', item.alias);
    //     setValue('repeat', item.repeat);
    // }, [item, setValue]);
    //
    useEffect(() => {
        getInstitution({type: 'select', ladder: 'alias'}).then(data => setInstitutionOptions(data));
        getYear({type: 'select'}).then((data) => setYearOptions(data));
    }, []);
    //
    useEffect(() => {
        discount.institutionId !== null && getItem({institutionId: discount.institutionId, type: 'select'})
            .then(data => setItemOptions(data));
    }, [discount.institutionId]);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross"/>
                </button>
            }>
                {discount.id !== null ? 'UBAH' : 'TAMBAH'}
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <Row className="gy-0">
                        <div className="form-group col-md-12">
                            <label className="form-label" htmlFor="yearId">Pilih Tahun Pelajaran</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={yearOptions}
                                    value={yearOptions?.find((c) => c.value === discount.yearId)}
                                    onChange={(e) => {
                                        setDiscount({...discount, yearId: e.value});
                                        setValue('yearId', e.value);
                                    }}
                                    placeholder="Pilih Tahun Pelajaran"
                                />
                                <input type="hidden" id="yearId"
                                       className="form-control" {...register("yearId", {required: true})} />
                                {errors.yearId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-12">
                            <label className="form-label" htmlFor="institutionId">Pilih Lembaga</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={institutionOptions}
                                    value={institutionOptions?.find((c) => c.value === discount.institutionId)}
                                    onChange={(e) => {
                                        setDiscount({...discount, institutionId: e.value});
                                        setValue('institutionId', e.value);
                                    }}
                                    placeholder="Pilih Lembaga"
                                />
                                <input type="hidden" id="institutionId"
                                       className="form-control" {...register("institutionId", {required: true})} />
                                {errors.institutionId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-12">
                            <label className="form-label" htmlFor="itemId">Pilih Item</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={itemOptions}
                                    value={itemOptions?.find((c) => c.value === discount.itemId)}
                                    onChange={(e) => {
                                        setDiscount({...discount, itemId: e.value});
                                        setValue('itemId', e.value);
                                    }}
                                    placeholder="Pilih Item"
                                />
                                <input type="hidden" id="itemId"
                                       className="form-control" {...register("itemId", {required: true})} />
                                {errors.itemId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="name">Nama Potongan</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    placeholder="Ex. Potongan Gelombang 1"
                                    {...register("name", {
                                        required: true,
                                        onChange: (e) => handleChange(e)
                                    })}
                                />
                                {errors.name && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="qty">Kuantitas</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="qty"
                                    placeholder="Ex. 6"
                                    {...register("qty", {
                                        required: true,
                                        onChange: (e) => handleChange(e)
                                    })}
                                />
                                {errors.qty && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="percent">Berdasarkan Persen</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="percent"
                                    placeholder="Ex. 30"
                                    {...register("percent", {
                                        required: false,
                                        onChange: (e) => handleChange(e)
                                    })}
                                />
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="amount">Berdasarkan Jumlah</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="amount"
                                    placeholder="Ex. 100.000"
                                    {...register("amount", {
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
                    </Row>
                </form>
            </ModalBody>
        </Modal>
    )
}

export default Partial;
