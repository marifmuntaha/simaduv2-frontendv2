import React, { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalHeader, Spinner } from "reactstrap";
import {Controller, useForm} from "react-hook-form";
import { Icon, Row, RSelect } from "@/components";
import { store as storeProgram, update as updateProgram } from "@/common/api/institution/program";
import {OptionsType, PartialModalProps, ProgramType} from "@/common/types";
import {useAuthContext} from "@/common/hooks/useAuthContext";
import {useYearContext} from "@/common/hooks/useYearContext";

interface PartialProps extends PartialModalProps<ProgramType>{
    yearOptions: OptionsType[]
    institutionOptions: OptionsType[]
}
const Partial: React.FC<PartialProps> = ({ modal, setModal, data, setData, setReloadData, yearOptions, institutionOptions }) => {
    const year = useYearContext()
    const { user } = useAuthContext()
    const [loading, setLoading] = useState(false);
    const {
        control,
        reset,
        handleSubmit,
        register,
        formState: { errors },
        setValue
    } = useForm<ProgramType>();

    const onSubmit = (values: ProgramType) => {
        setLoading(true);
        data.id === undefined ? onStore(values) : onUpdate(values);
    }
    const onStore = (formData: ProgramType) => {
        storeProgram(formData).then((resp) => {
            if (resp.status === 'success') {
                setReloadData(true)
                toggle()
            }
        }).finally(() => setLoading(false));
    }
    const onUpdate = (formData: ProgramType) => {
        updateProgram(formData).then((resp) => {
            if (resp.status === "success") {
                setReloadData(true)
                toggle()
            }
        }).finally(() => setLoading(false));
    }
    const handleReset = () => {
        setData({
            id: undefined,
            yearId: year?.id,
            institutionId: user?.role === 1 ? undefined : user?.institution?.id,
            name: "",
            alias: ""
        });
        reset();
    }
    const toggle = () => {
        setModal(false);
        handleReset();
    };

    useEffect(() => {
        setValue('id', data?.id);
        setValue('yearId', data?.yearId);
        setValue('institutionId', data?.institutionId);
        setValue('name', data?.name);
        setValue('alias', data?.alias);
    }, [data, setValue]);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross" />
                </button>
            }>
                {data?.id === undefined ? 'TAMBAH' : 'UBAH'}
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <Row className="gy-0">
                        <div className={`form-group col-md-${user?.role === 1 ? 6 : 12}`}>
                            <label className="form-label" htmlFor="yearId">Tahun Pelajaran</label>
                            <div className="form-control-wrap">
                                <Controller
                                    name="yearId"
                                    control={control}
                                    rules={{required: 'Silahkan pilih tahun ajaran'}}
                                    render={({field: {onChange, value}}) => (
                                        <React.Fragment>
                                            <RSelect
                                                options={yearOptions}
                                                value={yearOptions?.find((c) => c.value === value)}
                                                onChange={(val) => onChange(val?.value)}
                                                placeholder="Pilih Tahun Pelajaran"
                                            />
                                            <input type="hidden" id="yearId" className="form-control" />
                                            {errors.yearId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                                        </React.Fragment>
                                    )}
                                />

                            </div>
                        </div>
                        {user?.role === 1 && (
                            <div className="form-group col-md-6">
                                <label className="form-label" htmlFor="institutionId">Pilih Lembaga</label>
                                <div className="form-control-wrap">
                                    <Controller
                                        name="institutionId"
                                        control={control}
                                        rules={{required: 'Kolom tidak boleh kosong'}}
                                        render={({field: {onChange, value}}) => (
                                            <React.Fragment>
                                                <RSelect
                                                    options={institutionOptions}
                                                    value={institutionOptions?.find((c) => c.value === value)}
                                                    onChange={(val) => onChange(val?.value)}
                                                    placeholder="Pilih Lembaga"
                                                />
                                                <input type="hidden" id="institutionId" className="form-control"/>
                                                {errors.institutionId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                                            </React.Fragment>
                                        )}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="form-group">
                            <label className="form-label" htmlFor="name">Nama Program</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder="Ex. Tahfid"
                                    {...register("name", {required: true})}
                                />
                                {errors.name && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="alias">Alias</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="alias"
                                    placeholder="Ex. TFZ"
                                    {...register("alias", {required: true})}
                                />
                                {errors.alias && <span className="invalid">Kolom tidak boleh kosong</span>}
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
