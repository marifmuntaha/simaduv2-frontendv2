import React, {useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {useForm} from "react-hook-form";
import {Icon, Row, RSelect} from "@/components";
import {get as getAccount} from "@/api/finance/account";
import {store as storeTransaction} from "@/api/finance/transaction";
import {get as getInstitution} from "@/api/institution";
import {numberFormat} from "@/utils";
import {get as getSetting} from "@/api/setting";
import {APICore} from "@/api/APICore.jsx";
import {get as getStudent} from "@/api/student";
import {get as getInvoice} from "@/api/finance/invoice";

const Payment = ({modal, setModal, transaction, setTransaction, setReloadData}) => {
    const api = new APICore();
    const user = api.getLoggedInUser();
    const {
        handleSubmit,
        reset,
        register,
        formState: {errors},
        setValue
    } = useForm();
    const [loading, setLoading] = useState(false);
    const [institutionOptions, setInstitutionOptions] = useState([]);
    const [accountOptions, setAccountOptions] = useState([]);
    const [studentOptions, setStudentOptions] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [payments, setPayments] = useState([]);
    const [formData, setFormData] = useState([]);
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
            code: 'KM',
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
            level: 2
        }).then(data => setAccountOptions(data));
        transaction.institutionId !== "" && getStudent({type: 'select', institutionId: transaction.institutionId}).then(data => setStudentOptions(data));
    }, [transaction.institutionId]);

    useEffect(() => {
        modal.payment && transaction.studentId !== null && getInvoice({studentId: transaction.studentId}).then(data => setInvoices(data));
    }, [modal, transaction.studentId]);

    useEffect(() => {
        const payment = payments.length > 0 && payments?.reduce((acc, cur) => {
            acc[cur['invoiceId']] = cur;
            return acc;
        }, {});
        setFormData(Object.values(payment))
    }, [payments])

    useEffect(() => {
        console.log(formData);
    }, [formData]);

    return (
        <Modal isOpen={modal.payment} toggle={toggle} size="lg">
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross"/>
                </button>
            }>
                {transaction.id !== "" ? 'UBAH KAS MASUK' : 'PEMBAYARAN'}
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
                            <label className="form-label" htmlFor="studentId">Pilih Siswa</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={studentOptions}
                                    value={studentOptions?.find((c) => c.value === transaction.studentId)}
                                    onChange={(e) => {
                                        setTransaction({...transaction, studentId: e.value});
                                        setValue('studentId', e.value);
                                    }}
                                    placeholder="Pilih Siswa"
                                />
                                <input type="hidden" id="studentId"
                                       className="form-control" {...register("studentId", {required: true})} />
                                {errors.studentId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                            </div>
                        </div>
                        <div className="col-md-12">
                            <table className="table table-bordered">
                                <thead>
                                <tr>
                                    <th scope="col">Tagihan</th>
                                    <th scope="col">Jumlah</th>
                                    <th scope="col">Bayar</th>
                                </tr>
                                </thead>
                                <tbody>
                                {invoices.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{item.name}</td>
                                        <td>{numberFormat(item.amount)}</td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="amount"
                                                placeholder="Ex. 1000000"
                                                onChange={(e) => {
                                                    setPayments([...payments, {
                                                        institutionId: item.institutionId,
                                                        invoiceId: item.id,
                                                        itemId: item.itemId,
                                                        studentId: item.studentId,
                                                        amount: e.target.value,
                                                    }])
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
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

export default Payment;
