import React, {useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {useForm} from "react-hook-form";
import {Icon, Row, RSelect} from "@/components";
import {get as getInstitution} from "@/api/institution";
import {get as getItem} from "@/api/finance/item";
import {get as getYear} from "@/api/master/year";
import {get as getStudent} from "@/api/student";
import {store as storeInvoice} from "@/api/finance/invoice";
import {numberFormat} from "@/utils/index.jsx";

const Individual = ({modal, setModal, invoice, setInvoice, setReloadData}) => {
    const {
        handleSubmit,
        reset,
        register,
        formState: {errors},
        setValue
    } = useForm();
    const [loading, setLoading] = useState(false);
    const [yearOptions, setYearOptions] = useState([]);
    const [institutionOptions, setInstitutionOptions] = useState([]);
    const [itemOptions, setItemOptions] = useState([]);
    const [studentOptions, setStudentOptions] = useState([]);
    const handleChange = (e) => {
        setInvoice({...invoice, [e.target.name]: e.target.value});
    }
    const onSubmit = async () => {
        setLoading(true);
        const store = await storeInvoice({
            institutionId: invoice.institution.id,
            itemId: invoice.itemId,
            studentId: invoice.studentId,
            name: invoice.name,
            amount: invoice.amount,
        });
        if (!store) {
            setLoading(false);
        } else {
            setLoading(false);
            setReloadData(true);
            toggle();
        }

    }
    const handleReset = () => {
        setInvoice({
            id: "",
            yearId: "",
            institution: {id: "", ladderId: ""},
            itemId: [],
            levelId: "",
            rombelId: "",
            programId: "",
            boardingId: "",
            gender: "",
            studentId: "",
            number: "",
            amount: 0,
            name: "",
        });
        reset();
    }
    const toggle = () => {
        setModal({
            individual: false,
            group: false
        });
        handleReset();
    };

    useEffect(() => {
        modal.individual !== false && getYear({type: 'select'}).then(data => setYearOptions(data));
        modal.individual !== false && getInstitution({type: 'select', ladder: 'alias'}).then(data => setInstitutionOptions(data));
    }, [modal.individual]);

    useEffect(() => {
        if (modal.individual !== false && invoice.institution.id !== "" ) {
            getItem({
                type: 'select',
                institutionId: invoice.institution?.id,
            }).then(data => setItemOptions(data));
            getStudent({type: 'select', yearId: invoice.yearId, institutionId: invoice.institution.id}).then(data => setStudentOptions(data));
        }
    }, [modal.individual, invoice.yearId, invoice.institution.id]);

    useEffect(() => {
        console.log(invoice);
    }, [invoice]);

    return (
        <Modal isOpen={modal.individual} toggle={toggle}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross"/>
                </button>
            }>
                {invoice.id === "" ? 'TAMBAH' : 'UBAH'}
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <Row className="gy-0">
                        <div className="form-group col-md-12">
                            <label className="form-label" htmlFor="yearId">Pilih Tahun Pelajaran</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={yearOptions}
                                    value={yearOptions?.find((c) => c.value === invoice.yearId)}
                                    onChange={(e) => {
                                        setInvoice({...invoice, yearId: e.value});
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
                                    value={institutionOptions?.find((c) => c.value === invoice.institution?.id)}
                                    onChange={(e) => {
                                        setInvoice({...invoice, institution: {id: e.value, ladderId: e.ladderId}});
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
                            <label className="form-label" htmlFor="itemId">Pilih Item Tagihan</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={itemOptions}
                                    value={itemOptions?.find((c) => c.value === invoice.itemId)}
                                    onChange={(e) => {
                                        setInvoice({...invoice, itemId: e.value});
                                        setValue('itemId', e.value);
                                    }}
                                    placeholder="Pilih Transaksi"
                                />
                                <input type="hidden" id="itemId"
                                       className="form-control" {...register("itemId", {required: true})} />
                                {errors.itemId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-12">
                            <label className="form-label" htmlFor="studentId">Pilih Siswa</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={studentOptions}
                                    value={studentOptions?.find((c) => c.value === invoice.studentId)}
                                    onChange={(e) => {
                                        setInvoice({...invoice, studentId: e.value});
                                        setValue('studentId', e.value);
                                    }}
                                    placeholder="Pilih Transaksi"
                                />
                                <input type="hidden" id="studentId"
                                       className="form-control" {...register("studentId", {required: true})} />
                                {errors.studentId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-12">
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
                                            handleChange(e)
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

export default Individual;
