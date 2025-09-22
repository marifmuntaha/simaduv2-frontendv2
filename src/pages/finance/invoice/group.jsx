import React, {useCallback, useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {useForm} from "react-hook-form";
import {Icon, Row, RSelect, RToast} from "@/components";
import {get as getInstitution} from "@/api/institution";
import {get as getItem} from "@/api/finance/item";
import {get as getYear} from "@/api/master/year";
import {get as getLevel} from "@/api/master/level";
import {get as getRombel} from "@/api/institution/rombel";
import {get as getProgram} from "@/api/institution/program";
import {get as getStudent} from "@/api/student";
import {store as storeInvoice} from "@/api/finance/invoice";
import {numberFormat} from "@/utils/index.jsx";
import {get as getSetting} from "@/api/setting.jsx";
import moment from "moment/moment";
import "moment/locale/id";

const Group = ({modal, setModal, invoice, setInvoice, setReloadData}) => {
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
    const [levelOptions, setLevelOptions] = useState([]);
    const [rombelOptions, setRombelOptions] = useState([]);
    const [programOptions, setProgramOptions] = useState([]);
    const [itemOptions, setItemOptions] = useState([]);
    const boardingOptions = [
        {value: '', label: 'Semua'},
        {value: '1', label: 'Non Boarding'},
        {value: '2', label: 'Tahfidz'},
        {value: '3', label: 'Kitab'},
    ]
    const genderOptions = [
        {value: '', label: 'Semua'},
        {value: 'L', label: 'Laki-laki'},
        {value: 'P', label: 'Perempuan'},
    ]
    const handleChange = (e) => {
        setInvoice({...invoice, [e.target.name]: e.target.value});
    }
    const onSubmit = async () => {
        setLoading(true);
        const startMonth = await getSetting({institutionId: invoice.institution.id}).then(data => {
            let setting = {}
            data.map((item) => {
                return Object.assign(setting, item);
            });
            return setting.firstMonth.value;
        });
        const students = await getStudent(studentParam());
        if (!students) {
            setLoading(false);
        } else {
            students.map(async (student) => {
                if (invoice.item.repeat === '1') {
                    const startDate = moment(`1/${startMonth - 1}`, 'D/MM');
                    for (let i = 0; i < 12; i++) {
                        const created_at = startDate.add(1, 'month');
                        await storeInvoice({
                            institutionId: invoice.institution.id,
                            itemId: invoice.item.value,
                            studentId: student.id,
                            name: invoice.name + ' ' + created_at.locale('id').format('MMMM YYYY'),
                            amount: invoice.amount,
                            created_at: created_at.format("YYYY-MM-DD HH:mm:ss"),
                        }, false);
                    }
                    setLoading(false);
                    setReloadData(true);
                } else {
                    const store = await storeInvoice({
                        institutionId: invoice.institution.id,
                        itemId: invoice.item.value,
                        studentId: student.id,
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
            });
            RToast('Tagihan berhasil ditambahkan', 'success');
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
    const levelParam = useCallback(() => {
        let param = {type: 'select'}
        if (invoice.yearId !== '') {
            param = {...param, yearId: invoice.yearId}
        }
        if (invoice.institution.id !== '') {
            param = {...param, institutionId : invoice.institution.id}
        }
        if (invoice.levelId !== '') {
            param = {...param, levelId: invoice.levelId}
        }
        if (invoice.institution.id !== '') {
            return param;
        } else {
            return false
        }
    }, [invoice.yearId, invoice.institution, invoice.levelId]);
    const studentParam = useCallback(() => {
        let param = {}
        if (invoice.yearId !== '') {
            param = {...param, yearId : invoice.yearId}
        }
        if (invoice.institution.id !== '') {
            param = {...param, institutionId : invoice.institution.id}
        }
        if (invoice.levelId !== '') {
            param = {...param, levelId : invoice.levelId}
        }
        if (invoice.rombelId !== '') {
            param = {...param, rombelId : invoice.rombelId}
        }
        if (invoice.programId !== '') {
            param = {...param, programId : invoice.programId}
        }
        if (invoice.boardingId !== '') {
            param = {...param, boardingId : invoice.boardingId}
        }
        if (invoice.gender !== '') {
            param = {...param, gender : invoice.gender}
        }
        return param
    }, [invoice]);

    useEffect(() => {
        modal.group !== false && getYear({type: 'select'}).then(data => setYearOptions(data));
        modal.group !== false && getInstitution({type: 'select', ladder: 'alias'}).then(data => setInstitutionOptions(data));
    }, [modal.group]);

    useEffect(() => {
        if (modal.group !== false && invoice.institution.id !== "" ) {
            getItem({
                type: 'select',
                institutionId: invoice.institution?.id,
                with: "repeat"
            }).then(data => setItemOptions(data))
            getLevel({type: 'select', ladderId: invoice.institution?.ladderId}).then(data => setLevelOptions([{value: '', label: 'Semua'}, ...data]));
        }
    }, [modal.group, invoice.institution]);

    useEffect(() => {
        modal.group !== false && levelParam() !== false && getRombel(levelParam()).then(data => setRombelOptions([{value: '', label: 'Semua'}, ...data]));
        modal.group !== false && levelParam() !== false && getProgram(levelParam()).then(data => setProgramOptions([{value: '', label: 'Semua'}, ...data]));
    }, [modal.group, levelParam]);

    return (
        <Modal isOpen={modal.group} toggle={toggle}>
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
                                    value={itemOptions?.find((c) => c.value === invoice?.item?.value)}
                                    onChange={(e) => {
                                        setInvoice({...invoice, item: e});
                                        setValue('itemId', e.value);
                                    }}
                                    placeholder="Pilih Transaksi"
                                />
                                <input type="hidden" id="itemId"
                                       className="form-control" {...register("itemId", {required: true})} />
                                {errors.itemId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="levelId">Berdasarkan Kelas</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={levelOptions}
                                    value={levelOptions?.find((c) => c.value === invoice.levelId)}
                                    onChange={(e) => {
                                        setInvoice({...invoice, levelId: e.value});
                                    }}
                                    placeholder="Pilih Kelas"
                                />
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="rombelId">Berdasarkan Rombel</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={rombelOptions}
                                    value={rombelOptions?.find((c) => c.value === invoice.rombelId)}
                                    onChange={(e) => {
                                        setInvoice({...invoice, rombelId: e.value});
                                    }}
                                    placeholder="Pilih Rombel"
                                />
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="programId">Berdasarkan Program</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={programOptions}
                                    value={programOptions?.find((c) => c.value === invoice.programId)}
                                    onChange={(e) => {
                                        setInvoice({...invoice, programId: e.value});
                                    }}
                                    placeholder="Pilih Program"
                                />
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="boardingId">Berdasarkan Boarding</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={boardingOptions}
                                    value={boardingOptions?.find((c) => c.value === invoice.boardingId)}
                                    onChange={(e) => {
                                        setInvoice({...invoice, boardingId: e.value});
                                    }}
                                    placeholder="Pilih Boarding"
                                />
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="gender">Berdasarkan Kelamin</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={genderOptions}
                                    value={genderOptions?.find((c) => c.value === invoice.gender)}
                                    onChange={(e) => {
                                        setInvoice({...invoice, gender: e.value});
                                    }}
                                    placeholder="Pilih Kelamin"
                                />
                            </div>
                        </div>
                        <div className="form-group col-md-6">
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

export default Group;
