import React, {useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {useForm} from "react-hook-form";
import {Icon, Row, RSelect} from "@/components";
import {store as storeLetter, update as updateLetter} from "@/api/letter";
import Invitations from "@/pages/letter/partial/invitations";

const Partial = ({user, modal, setModal, letter, setLetter, setReloadData}) => {
    const [loading, setLoading] = useState(false);
    const {handleSubmit, reset, register, formState: {errors}, setValue} = useForm();
    const onSubmit = () => {
        letter.id === null ? onStore() : onUpdate();
    }
    const onStore = async () => {
        setLoading(true);
        const formData = {...letter, data: JSON.stringify(letter.data)}
        const store = await storeLetter(formData);
        if (store) {
            setLoading(false);
            setReloadData(true);
            toggle()
        } else {
            setLoading(false);
        }
        setLoading(false);
    }
    const onUpdate = async () => {
        setLoading(true);
        const update = await updateLetter(letter);
        if (update) {
            setLoading(false);
            setReloadData(true);
            toggle();
        } else {
            setLoading(false);
        }
    }
    const handleReset = () => {
        setLetter({
            id: null,
            yearId: user.yearId,
            institutionId: user.role === '1' ? null : user.institutionId,
            type: "",
            data: "",
            signature: "",
        });
        reset();
    }
    const toggle = () => {
        setModal(false);
        handleReset();
    };
    const typeOptions = [
        {value: '1.01', label: 'Surat Keterangan'},
        {value: '1.02', label: 'Surat Keterangan Aktif'},
        {value: '1.03', label: 'Surat Pindah Sekolah'},
        {value: '1.04', label: 'Surat Undangan'},
    ]
    const signatureOptions = [
        {value: '1', label: 'Digital'},
        {value: '2', label: 'Manual'},
    ]

    useEffect(() => {
        setValue('id', letter.id);
        setValue('yearId', letter.yearId);
        setValue('institutionId', letter.institutionId);
        setValue('type', letter.type);
        setValue('data', letter.data);
        setValue('signature', letter.signature);
    }, [letter, setValue]);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross"/>
                </button>
            }>
                {letter.id === null ? 'TAMBAH' : 'UBAH'}
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <Row className="gy-0">
                    <div className="form-group col-md-6">
                        <label className="form-label" htmlFor="type">Jenis Surat</label>
                        <div className="form-control-wrap">
                            <RSelect
                                options={typeOptions}
                                value={typeOptions?.find((c) => c.value === letter.type)}
                                onChange={(e) => {
                                    setLetter({...letter, type: e.value});
                                    setValue('type', e.value);
                                }}
                                placeholder="Pilih Jenis Surat"
                            />
                            <input type="hidden" className="form-control" id="type" {...register('type', {required: true})} />
                            {errors.type && <span className="invalid">Kolom tidak boleh kosong.</span>}
                        </div>
                    </div>
                    <div className="form-group col-md-6">
                        <label className="form-label" htmlFor="type">Tanda Tangan</label>
                        <div className="form-control-wrap">
                            <RSelect
                                options={signatureOptions}
                                value={signatureOptions?.find((c) => c.value === letter.signature)}
                                onChange={(e) => {
                                    setLetter({...letter, signature: e.value});
                                    setValue('type', e.value);
                                }}
                                placeholder="Pilih Tanda tangan"
                            />
                            <input type="hidden" className="form-control" id="signature" {...register('signature', {required: true})} />
                            {errors.signature && <span className="invalid">Kolom tidak boleh kosong.</span>}
                        </div>
                    </div>
                    {letter.type === '1.04' && <Invitations letter={letter} setLetter={setLetter}/>}
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
