import React, { useEffect, useState } from "react";
import { Button, Input, Modal, ModalBody, ModalHeader, Spinner } from "reactstrap";
import { Controller, useForm } from "react-hook-form";
import { Icon, Row, RSelect } from "@/components";
import { store as storeInstitution, update as updateInstitution } from "@/common/api/institution"
import { get as getLadder } from "@/common/api/master/ladder"
import { InstitutionType, OptionsType, PartialModalProps } from "@/common/types";

const Partial = ({ modal, setModal, data, setData, setReloadData }: PartialModalProps<InstitutionType>) => {
    const [loading, setLoading] = useState(false);
    const [ladderOptions, setLadderOptions] = useState<OptionsType[]>([]);
    const {
        reset,
        handleSubmit,
        register,
        formState: { errors },
        setValue,
        control
    } = useForm<InstitutionType>();

    const onSubmit = (values: InstitutionType) => {
        setLoading(true);
        data.id === null || data.id === undefined ? onStore(values) : onUpdate(values);
    }
    const onStore = (formData: InstitutionType) => {
        storeInstitution(formData).then((resp) => {
            if (resp.status === 'success') {
                setReloadData(true)
                toggle()
            }
        }).finally(() => setLoading(false));
    }
    const onUpdate = (formData: InstitutionType) => {
        updateInstitution(formData).then(() => {
            setLoading(false);
            setReloadData(true);
            toggle();
        }).finally(() => setLoading(false));
    }
    const handleReset = () => {
        setData({
            id: undefined,
            ladderId: undefined,
            name: "",
            alias: "",
            nsm: "",
            npsn: "",
            address: "",
            phone: "",
            email: "",
            website: "",
            logo: "",
        });
        reset();
    }
    const toggle = () => {
        setModal(false);
        handleReset();
    };

    useEffect(() => {
        setValue('id', data.id)
        setValue('ladderId', data.ladderId);
        setValue('name', data.name);
        setValue('alias', data.alias);
        setValue('nsm', data.nsm);
        setValue('npsn', data.npsn);
        setValue('address', data.address);
        setValue('phone', data.phone);
        setValue('email', data.email);
        setValue('website', data.website);
        setValue('logo', data.logo);
    }, [data, setValue]);

    useEffect(() => {
        modal && getLadder<OptionsType>({ type: 'select' }).then((data) => setLadderOptions(data));
    }, [modal]);

    return (
        <Modal isOpen={modal} toggle={toggle} size={"md"}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross" />
                </button>
            }>
                {(data.id === null || data.id === undefined) ? 'TAMBAH' : 'UBAH'}
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <Row className="gy-0">
                        <div className="form-group col-md-12">
                            <label className="form-label" htmlFor="ladderId">Pilih Jenjang</label>
                            <div className="form-control-wrap">
                                <Controller
                                    name="ladderId"
                                    control={control}
                                    rules={{ required: 'Jenjang tidak boleh kosong' }}
                                    render={({ field: { onChange, value } }) => (
                                        <React.Fragment>
                                            <RSelect
                                                id="ladderId"
                                                options={ladderOptions}
                                                value={ladderOptions?.find((c) => c.value === value)}
                                                onChange={(val: OptionsType | null) => onChange(val?.value)}
                                                placeholder="Pilih Jenjang"
                                            />
                                            <input type="hidden" id="ladderId" className="form-control" />
                                            {errors.ladderId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                                        </React.Fragment>
                                    )} />
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="name">Nama Lembaga</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ex. Darul Hikmah Menganti"
                                    {...register("name", {
                                        required: true,
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
                                            setValue('image', (e.target.files as FileList)[0]);
                                        }}
                                    />
                                </div>
                                {errors.logo && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <Button color="primary" type="submit" size="md">
                                {loading ? <Spinner size="sm" /> : 'SIMPAN'}
                            </Button>
                        </div>
                    </Row>
                </form>
            </ModalBody>
        </Modal>
    )
}

export default Partial;
