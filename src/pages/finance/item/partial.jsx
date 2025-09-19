import React, {useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {useForm} from "react-hook-form";
import {Icon, RSelect} from "@/components";
import {store as storeAccount, update as updateAccount} from "@/api/finance/account"
import {get as getInstitution} from "@/api/institution"

const Partial = ({modal, setModal, account, setAccount, setReloadData}) => {
    const [loading, setLoading] = useState(false);
    const [institutionOptions, setInstitutionOptions] = useState([]);
    const {handleSubmit, reset, register, formState: {errors}, setValue} = useForm();
    const handleChange = (e) => {
        setAccount({...account, [e.target.name]: e.target.value});
    }
    const onSubmit = () => {
        account.id === "" ? onStore() : onUpdate();
    }
    const onStore = async () => {
        setLoading(true);
        const store = await storeAccount(account);
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
        const update = await updateAccount(account);
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
            name: "",
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
        setValue('name', account.name);
        setValue('balance', account.balance);
    }, [account, setValue]);

    useEffect(() => {
        getInstitution({type: 'select', ladder: 'alias'}).then(data => setInstitutionOptions(data));
    }, []);

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
                            <input type="hidden" id="institutionId" className="form-control" {...register("institutionId", {required: true})} />
                            {errors.institutionId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                        </div>
                    </div>
                    <div className="form-group">
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
                </form>
            </ModalBody>
        </Modal>
    )
}

export default Partial;
