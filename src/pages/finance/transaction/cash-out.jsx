import React, {useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {useForm} from "react-hook-form";
import {Icon, Row, RSelect} from "@/components";
import {get as getAccount} from "@/api/finance/account";
import {store as storeTransaction} from "@/api/finance/transaction";
import {get as getInstitution} from "@/api/institution";
import {get as getSetting} from "@/api/setting.jsx";
import {APICore} from "@/api/APICore.jsx";
import {numberFormat} from "@/utils/index.jsx";

const CashOut = ({modal, setModal, transaction, setTransaction, setReloadData}) => {
    const api = new APICore();
    const user = api.getLoggedInUser();
    const [loading, setLoading] = useState(false);
    const [institutionOptions, setInstitutionOptions] = useState([]);
    const [accountOptions, setAccountOptions] = useState([]);
    const {
        handleSubmit,
        reset,
        register,
        formState: {errors},
        setValue
    } = useForm();
    const handleChange = (e) => {
        setTransaction({...transaction, [e.target.name]: e.target.value});
    }
    const onSubmit = async () => {
        setLoading(true);
        const accountAppId = await getSetting({institutionId: transaction.institutionId}).then(data => {
            let setting = {}
            data.map((item) => {
                return Object.assign(setting, item);
            });
            if (user.role === '1' || user.role === '3') {
                return setting.cashBendahara.value;
            } else {
                return setting.cashTeller.value;
            }
        });
        const formData = {
            institutionId: transaction.institutionId,
            accountAppId: accountAppId,
            accountRevId: transaction.accountRevId,
            code: 'KK',
            number: '',
            name: transaction.name,
            amount: transaction.amount,
        }
        const store = await storeTransaction(formData);
        if (!store) {
            setLoading(false);
        } else {
            setLoading(false);
            setReloadData(true);
            toggle();
        }

    }
    const handleReset = () => {
        setTransaction({
            id: "",
            institutionId: "",
            accountAppId: "",
            accountRevId: "",
            code: "",
            number: "",
            name: "",
            amount: 0,
        });
        reset();
    }
    const toggle = () => {
        setModal({
            cashIn: false,
            cashOut: false,
            payment: false,
            moved: false,
        });
        handleReset();
    };

    useEffect(() => {
        getInstitution({type: 'select', ladder: 'alias'}).then(data => setInstitutionOptions(data));
    }, []);

    useEffect(() => {
        transaction.institutionId !== "" && getAccount({
            type: 'select',
            institutionId: transaction.institutionId,
            shown: 1
        }).then(data => setAccountOptions(data))
    }, [transaction.institutionId]);

    return (
        <Modal isOpen={modal.cashOut} toggle={toggle}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross"/>
                </button>
            }>
                {transaction.id !== "" ? 'UBAH KAS KELUAR' : 'KAS KELUAR'}
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
                        <div className="form-group col-md-12">
                            <label className="form-label" htmlFor="accountRevId">Pilih Rekening</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={accountOptions}
                                    value={accountOptions?.find((c) => c.value === transaction.accountRevId)}
                                    onChange={(e) => {
                                        setTransaction({...transaction, accountRevId: e.value});
                                        setValue('accountRevId', e.value);
                                    }}
                                    placeholder="Pilih Transaksi"
                                />
                                <input type="hidden" id="accountRevId"
                                       className="form-control" {...register("accountRevId", {required: true})} />
                                {errors.accountRevId && <span className="invalid">Kolom tidak boleh kosong.</span>}
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
                                        onChange: (e) => {
                                            handleChange(e);
                                            setValue('amount', numberFormat(e.target.value));
                                        }
                                    })}
                                />
                                {errors.amount && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="name">Keterangan</label>
                            <div className="form-control-wrap">
                                <textarea
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

export default CashOut;
