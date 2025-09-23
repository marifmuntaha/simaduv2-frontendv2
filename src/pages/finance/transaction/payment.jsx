import React, {useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {useFieldArray, useForm} from "react-hook-form";
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
        setValue,
        getValues,
    } = useForm();
    const [loading, setLoading] = useState(false);
    const [institutionOptions, setInstitutionOptions] = useState([]);
    const [accountOptions, setAccountOptions] = useState([]);
    const [studentOptions, setStudentOptions] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [payments, setPayments] = useState([]);
    const [formData, setFormData] = useState([]);
    const [invoiceAmount, setInvoiceAmount] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
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
        formData.map(async (item) => {
            const formData = {
                institutionId: item.institutionId,
                accountAppId: accountAppId,
                accountRevId: item.item.accountRevId,
                code: 'KM',
                number: '',
                name: `${item.student.label}: Bayar Tunai ${item.name}`,
                amount: item.amount,
            }
            const store = await storeTransaction(formData);
            if (!store) {
                setLoading(false);
            } else {
                setLoading(false);
                setReloadData(true);
            }
        });
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
        setPayments([]);
        setFormData([]);
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
        modal.payment && transaction?.student?.value !== null && getInvoice({studentId: transaction?.student?.value}).then(data => {
            let invoice = 0;
            let discount = 0;
            data.map((item) => {
                invoice += parseInt(item.amount);
            });
            setInvoiceAmount(invoice);
            setInvoices(data.reverse());
        });
    }, [modal, transaction.student]);

    useEffect(() => {
        const payment = payments.length > 0 && payments?.reduce((acc, cur) => {
            acc[cur['invoiceId']] = cur;
            return acc;
        }, {});
        setFormData(Object.values(payment));
    }, [payments]);

    return (
        <Modal isOpen={modal.payment} toggle={toggle} size="xl">
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
                                    value={studentOptions?.find((c) => c.value === transaction?.student?.value)}
                                    onChange={(e) => {
                                        setTransaction({...transaction, student: e});
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
                                <tr className="text-center">
                                    <th scope="col">Keterangan</th>
                                    <th scope="col">Tagihan</th>
                                    <th scope="col">Potongan</th>
                                    <th scope="col">Jumlah</th>
                                    <th scope="col">Bayar</th>
                                </tr>
                                </thead>
                                <tbody>
                                {invoices.map((item, idx) => (
                                    <tr key={idx} className="align-text-bottom">
                                        <td>{item.name}</td>
                                        <td className="text-end">{numberFormat(item.amount)}</td>
                                        <td className="text-end">0</td>
                                        <td className="text-end">{numberFormat(item.amount)}</td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control text-end"
                                                name="amount"
                                                placeholder="Ex. 1000000"
                                                {...register(`inv.${item.id}`, {
                                                    required: false,
                                                    onChange: (e) => {
                                                        setPayments([...payments, {
                                                            institutionId: item.institutionId,
                                                            invoiceId: item.id,
                                                            item: item.item,
                                                            name: item.name,
                                                            student: transaction.student,
                                                            amount: numberFormat(e.target.value),
                                                        }]);
                                                        setValue(`inv.${item.id}`, numberFormat(e.target.value));
                                                    }
                                                })}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <th scope="col">Jumlah</th>
                                    <th scope="col">{numberFormat(invoiceAmount)}</th>
                                    <th scope="col">Potongan</th>
                                    <th scope="col">Jumlah</th>
                                    <th scope="col">Bayar</th>
                                </tr>
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
