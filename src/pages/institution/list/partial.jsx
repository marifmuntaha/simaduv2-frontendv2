import React, {useEffect, useState} from "react";
import {Button, Input, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {useForm} from "react-hook-form";
import {Icon, Row, RSelect} from "@/components";
import {store as storeInstitution, update as updateInstitution} from "@/api/institution"
import {get as getLadder} from "@/api/master/ladder"

const Partial = ({modal, setModal, institution, setInstitution, setLoadData}) => {
    const [loading, setLoading] = useState(false);
    const [ladderOptions, setLadderOptions] = useState([]);
    const {
        reset,
        handleSubmit,
        register,
        formState: {errors},
        setValue
    } = useForm();
    const handleChange = (e) => {
        setInstitution({...institution, [e.target.name]: e.target.value});
    }
    const onSubmit = () => {
        institution.id === null ? onStore() : onUpdate();
    }
    const onStore = async () => {
        setLoading(true);
        const store = await storeInstitution(institution).then((resp) => resp);
        if (store) {
            setLoading(false);
            setLoadData(true);
            toggle();
        } else {
            setLoading(false);
        }
    }
    const onUpdate = async () => {
        setLoading(true)
        const update = await updateInstitution(institution).then((resp) => resp);
        if (update) {
            setLoading(false);
            setLoadData(true);
            toggle();
        } else {
            setLoading(false);
        }
    }
    const handleReset = () => {
        setInstitution({
            id: null,
            ladderId: null,
            name: "",
            alias: "",
            nsm: "",
            npsn: "",
            address: "",
            phone: "",
            email: "",
            website: "",
            image: "",
        });
        reset();
    }
    const toggle = () => {
        setModal(false);
        handleReset();
    };

    useEffect(() => {
        setValue('ladderId', institution.ladderId);
        setValue('name', institution.name);
        setValue('alias', institution.alias);
        setValue('nsm', institution.nsm);
        setValue('npsn', institution.npsn);
        setValue('address', institution.address);
        setValue('phone', institution.phone);
        setValue('email', institution.email);
        setValue('website', institution.website);
        setValue('image', institution.image);
    }, [institution, setValue]);

    useEffect(() => {
        modal && getLadder({type: 'select'}).then((data) => setLadderOptions(data));
    }, [modal]);

    return (
        <Modal isOpen={modal} toggle={toggle} size={"md"}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross"/>
                </button>
            }>
                {institution === null ? 'TAMBAH' : 'UBAH'}
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <Row className="gy-0">
                        <div className="form-group col-md-12">
                            <label className="form-label" htmlFor="ladderId">Pilih Jenjang</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={ladderOptions}
                                    value={ladderOptions?.find((c) => c.value === institution.ladderId)}
                                    onChange={(e) => {
                                        setInstitution({...institution, ladderId: e.value});
                                        setValue('ladderId', e.value);
                                    }}
                                    placeholder="Pilih Jenjang"
                                />
                                <input type="hidden" id="ladderId" className="form-control" {...register('ladderId', {required: true})}/>
                                {errors.ladderId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="name">Nama Lembaga</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    placeholder="Ex. Darul Hikmah Menganti"
                                    {...register("name", {
                                        required: true,
                                        onChange: (e) => handleChange(e)
                                    })}
                                />
                                {errors.name && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="alias">Singkatan</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="alias"
                                    placeholder="Ex. MTSDH"
                                    {...register("alias", {
                                        required: true,
                                        onChange: (e) => handleChange(e)
                                    })}
                                />
                                {errors.alias && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="nsm">Nomor Statistik Madrasah</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nsm"
                                    placeholder="Ex. 1234567890"
                                    {...register("nsm", {
                                        required: true,
                                        onChange: (e) => handleChange(e)
                                    })}
                                />
                                {errors.nsm && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="npsn">Nomor Pokok Sekolah Nasional</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="npsn"
                                    placeholder="Ex. MTSDH"
                                    {...register("npsn", {
                                        required: true,
                                        onChange: (e) => handleChange(e)
                                    })}
                                />
                                {errors.npsn && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-12">
                            <label className="form-label" htmlFor="address">Alamat</label>
                            <div className="form-control-wrap">
                                    <textarea
                                        className="form-control"
                                        id="address"
                                        placeholder="Ex. Jl. Raya Jepara - Bugel KM 7 Menganti Kedung Jepara"
                                        {...register("address", {
                                            required: false,
                                            onChange: (e) => handleChange(e)
                                        })}
                                    />
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="phone">Nomor Telepon</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="phone"
                                    placeholder="Ex. 0291-2276756"
                                    {...register("phone", {
                                        required: true,
                                        onChange: (e) => handleChange(e)
                                    })}
                                />
                                {errors.phone && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="email">Email</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="email"
                                    placeholder="Ex. info@mts.darul-hikmah.sch.id"
                                    {...register("email", {
                                        required: true,
                                        onChange: (e) => handleChange(e)
                                    })}
                                />
                                {errors.email && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="website">Website</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="website"
                                    placeholder="Ex. https://mts.darul-hikmah.sch.id"
                                    {...register("website", {
                                        required: true,
                                        onChange: (e) => handleChange(e)
                                    })}
                                />
                                {errors.website && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="logo">Logo</label>
                            <div className="form-control-wrap">
                                <div className="form-file">
                                    <Input
                                        type="file"
                                        id="logo"
                                        onChange={(e) => {
                                            setValue('logo', e.target.files[0]);
                                            setInstitution({...institution, image: e.target.files[0]});
                                        }}
                                    />
                                </div>
                                {errors.logo && <span className="invalid">Kolom tidak boleh kosong</span>}
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
