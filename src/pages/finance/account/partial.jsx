import React, {useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {useForm} from "react-hook-form";
import {Icon, Row, RSelect} from "@/components/index.jsx";
import {get as getAccounts, store as storeAccount, update as updateAccount} from "@/api/finance/account.jsx"
import {get as getInstitution} from "@/api/institution.jsx"

const Partial = ({modal, setModal, account, setAccount, setReloadData}) => {
    const [loading, setLoading] = useState(false);
    const [institutionOptions, setInstitutionOptions] = useState([]);
    const [accountOptions, setAccountOptions] = useState([]);
    const {handleSubmit, reset, register, formState: {errors}, setValue} = useForm();
    const handleChange = (e) => {
        setAccount({...account, [e.target.name]: e.target.value});
    }
    const onSubmit = () => {
        account.id === "" ? onStore() : onUpdate();
    }
    const onStore = async () => {
        setLoading(true);
        const formData = {
            institutionId: account.institutionId,
            parent: account.parent?.id,
            codeApp: (account.parent?.codeApp !== undefined ? account.parent.codeApp : "") + account.code,
            code: account.code,
            name: account.name,
            level: account.level,
            balance: account.balance
        }
        const store = await storeAccount(formData);
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
        const formData = {
            id: account.id,
            institutionId: account.institutionId,
            parent: account.parent?.id,
            codeApp: (account.parent?.codeApp !== undefined ? account.parent.codeApp : "") + account.code,
            code: account.code,
            name: account.name,
            level: account.level,
            balance: account.balance
        }
        const update = await updateAccount(formData);
        if (update) {
            setLoading(false);
            setReloadData(true);
            toggle();
        } else {
            setLoading(false);
        }
    }
    const handleReset = () => {
        setAccount({
            id: "",
            institutionId: "",
            codeParent: "",
            codeApp: "",
            code: "",
            name: "",
            level: "",
            balance: "",
        });
        reset();
    }
    const toggle = () => {
        setModal(false);
        handleReset();
    };

    useEffect(() => {
        setValue('id', account.id);
        setValue('institutionId', account.institutionId);
        setValue('codeApp', parent.codeApp);
        setValue('code', account.code);
        setValue('name', account.name);
        setValue('level', account.level);
        setValue('balance', account.balance);
    }, [account, setValue]);

    useEffect(() => {
        getInstitution({type: 'select', ladder: 'alias'}).then(data => setInstitutionOptions(data));
    }, []);
    useEffect(() => {
        account.institutionId !== undefined && getAccounts({type: 'select', with: 'level', 'institutionId': account.institutionId}).then(data => {
            setAccountOptions(data);
        });
    }, [account.institutionId]);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross"/>
                </button>
            }>
                {account.id !== "" ? 'UBAH' : 'TAMBAH'}
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <Row className="gy-0">
                        <div className="form-group col-md-12">
                            <label className="form-label" htmlFor="institutionId">Pilih Lembaga</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={institutionOptions}
                                    value={institutionOptions?.find((c) => c.value === account.institutionId)}
                                    onChange={(e) => {
                                        setAccount({...account, institutionId: e.value});
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
                            <label className="form-label" htmlFor="parent">Jenis Akun</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={accountOptions}
                                    value={accountOptions?.find((c) => c.value === account.parent?.id)}
                                    onChange={(e) => {
                                        setAccount({
                                            ...account,
                                            parent: {id: e.value, codeApp: e.codeApp}
                                        });
                                    }}
                                    placeholder="Pilih Janis Akun"
                                />
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="level">Kode Rekening</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="code"
                                    placeholder="Ex. 1"
                                    {...register("code", {
                                        required: true,
                                        onChange: (e) => handleChange(e)
                                    })}
                                />
                                {errors.code && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="level">Level</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="level"
                                    placeholder="Ex. 1"
                                    {...register("level", {
                                        required: true,
                                        onChange: (e) => handleChange(e)
                                    })}
                                />
                                {errors.level && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="name">Nama Rekening</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    placeholder="Ex. BOS"
                                    {...register("name", {
                                        required: true,
                                        onChange: (e) => handleChange(e)
                                    })}
                                />
                                {errors.name && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="balance">Saldo</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="balance"
                                    placeholder="Ex. 1000000"
                                    {...register("balance", {
                                        required: true,
                                        onChange: (e) => handleChange(e)
                                    })}
                                />
                                {errors.balance && <span className="invalid">Kolom tidak boleh kosong</span>}
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
