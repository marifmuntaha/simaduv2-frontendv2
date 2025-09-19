import React, {useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {useForm} from "react-hook-form";
import {Icon, Row, RSelect} from "@/components";
import {store as storeTransaction, update as updateTransaction} from "@/api/finance/transaction";
import {get as getInstitution} from "@/api/institution";
import {get as getAccount} from "@/api/finance/account";

const Partial = ({modal, setModal, transaction, setTransaction, setReloadData}) => {
    const [loading, setLoading] = useState(false);
    const [institutionOptions, setInstitutionOptions] = useState([]);
    const [accountOptions, setAccountOptions] = useState([]);
    const {handleSubmit, reset, register, formState: {errors}, setValue} = useForm();
    const typeOption = [
        {value: '1', label: 'Transaksi Masuk'},
        {value: '2', label: 'Transaksi Keluar'},
    ];
    const handleChange = (e) => {
        setTransaction({...transaction, [e.target.name]: e.target.value});
    }
    const onSubmit = () => {
        transaction.id === "" ? onStore() : onUpdate();
    }
    const onStore = async () => {
        setLoading(true);
        const store = await storeTransaction(transaction);
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
        const update = await updateTransaction(transaction);
        if (update) {
            setLoading(false);
            setReloadData(true);
            toggle();
        } else {
            setLoading(false);
        }
    }
    const handleReset = () => {
        setTransaction({
            id: "",
            yearId: "",
            institutionId: "",
            accountId: "",
            name: "",
            type: "",
            code: "",
            amount: 0,
        });
        reset();
    }
    const toggle = () => {
        setModal(false);
        handleReset();
    };

    useEffect(() => {
        setValue('id', transaction.id);
        setValue('yearId', transaction.yearId);
        setValue('institutionId', transaction.institutionId);
        setValue('accountId', transaction.accountId);
        setValue('name', transaction.name);
        setValue('type', transaction.type);
        setValue('code', transaction.code);
        setValue('amount', transaction.amount);
    }, [transaction, setValue]);

    useEffect(() => {
        getInstitution({type: 'select', ladder: 'alias'}).then(data => setInstitutionOptions(data));
    }, []);

    useEffect(() => {
        transaction.institutionId !== "" && getAccount({type: 'select', institutionId: transaction.institutionId}).then(data => setAccountOptions(data))
    }, [transaction])

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross"/>
                </button>
            }>
                {transaction.id !== "" ? 'UBAH' : 'TAMBAH'}
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <Row className="gy-0">
                        <div className="form-group col-md-12">
                            <label className="form-label" htmlFor="institutionId">Pilih Lembaga</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={institutionOptions}
                                    value={institutionOptions?.find((c) => c.value === transaction.institutionId)}
                                    onChange={(e) => {
                                        setTransaction({...transaction, institutionId: e.value});
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
                            <label className="form-label" htmlFor="accountId">Pilih Rekening</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={accountOptions}
                                    value={accountOptions?.find((c) => c.value === transaction.accountId)}
                                    onChange={(e) => {
                                        setTransaction({...transaction, accountId: e.value});
                                        setValue('accountId', e.value);
                                    }}
                                    placeholder="Pilih Transaksi"
                                />
                                <input type="hidden" id="accountId"
                                       className="form-control" {...register("accountId", {required: true})} />
                                {errors.accountId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="type">Pilih Transaksi</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={typeOption}
                                    value={typeOption?.find((c) => c.value === transaction.type)}
                                    onChange={(e) => {
                                        setTransaction({...transaction, type: e.value});
                                        setValue('type', e.value);
                                    }}
                                    placeholder="Pilih Transaksi"
                                />
                                <input type="hidden" id="type"
                                       className="form-control" {...register("type", {required: true})} />
                                {errors.type && <span className="invalid">Kolom tidak boleh kosong.</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="name">Keterangan</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    placeholder="Ex. Pembelian Banner Harlah 5x3m"
                                    {...register("name", {
                                        required: true,
                                        onChange: (e) => handleChange(e)
                                    })}
                                />
                                {errors.name && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="amount">Harga</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="amount"
                                    placeholder="Ex. 1000000"
                                    {...register("amount", {
                                        required: true,
                                        onChange: (e) => handleChange(e)
                                    })}
                                />
                                {errors.amount && <span className="invalid">Kolom tidak boleh kosong</span>}
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
