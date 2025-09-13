import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Row} from "reactstrap";
import {RSelect} from "@/components";
import {get as getYear} from "@/api/master/year";
import {get as getInstitution} from "@/api/institution";
import {get as getLevel} from "@/api/master/level";
import {get as getRombel} from "@/api/institution/rombel";
import {get as getProgram} from "@/api/institution/program"

const FormActivity = ({formData, setFormData, ...props}) => {
    const [yearOptions, setYearOptions] = useState([]);
    const [yearSelected, setYearSelected] = useState([]);
    const [institutionOptions, setInstitutionOptions] = useState([]);
    const [institutionSelected, setInstitutionSelected] = useState([]);
    const [levelOptions, setLevelOptions] = useState([]);
    const [levelSelected, setLevelSelected] = useState([]);
    const [rombelOptions, setRombelOptions] = useState([]);
    const [rombelSelected, setRombelSelected] = useState([]);
    const [programOptions, setProgramOptions] = useState([]);
    const [programSelected, setProgramSelected] = useState([]);
    const [boardingSelected, setBoardingSelected] = useState([]);

    const statusOptions = [
        {value: '1', label: "Aktif"},
        {value: '2', label: "Keluar"},
        {value: '3', label: "Alumni"}
    ];
    const boardingOptions = [
        {value: '0', label: "Tidak Boarding"},
        {value: '1', label: "Tahfidz"},
        {value: '2', label: "Kitab"},
    ];

    const {  handleSubmit, formState: { errors } } = useForm();

    const onSubmit = () => {

    };

    useEffect(() => {
        getYear({type: 'select'}).then((resp) => setYearOptions(resp));
        getInstitution({type: 'select', ladder: 'alias'}).then((resp) => setInstitutionOptions(resp));
    }, []);

    useEffect(() => {
        getLevel({type: 'select', ladderId: institutionSelected.ladderId}).then((resp) => {
            setLevelOptions(resp);
        });
    }, [institutionSelected]);

    useEffect(() => {
        if (yearSelected.value !== undefined && institutionSelected.value !== undefined && levelSelected.value !== undefined) {
            getRombel({type: 'select', yearId: yearSelected.value, institutionId: institutionSelected.value, levelId: levelSelected.value})
                .then((resp) => setRombelOptions(resp));
        }
        if (yearSelected.value !== undefined && institutionSelected.value !== undefined) {
            getProgram({type: "select", yearId: yearSelected.value, institutionId: institutionSelected.value})
                .then((resp) => setProgramOptions(resp));
        }
    }, [yearSelected, institutionSelected, levelSelected]);

    return (
        <form className="content clearfix" onSubmit={handleSubmit(onSubmit)}>
            <Row className="gy-0">
                <div className="form-group col-md-4">
                    <label className="form-label" htmlFor="status">Status</label>
                    <div className="form-control-wrap">
                        <RSelect
                            options={statusOptions}
                            value={statusOptions?.find((c) => c.value === formData.status)}
                            onChange={(val) => setFormData({...formData, status: val.value})}
                            placeholder="Pilih Status"
                        />
                        <input type="hidden" id="status" className="form-control"/>
                        {errors.status && <span className="invalid">Kolom tidak boleh kosong.</span>}
                    </div>
                </div>
                <div className="form-group col-md-4">
                    <label className="form-label" htmlFor="yearId">Tahun Pelajaran</label>
                    <div className="form-control-wrap">
                        <RSelect
                            options={yearOptions}
                            value={yearOptions?.find((c) => c.value === formData.yearId)}
                            onChange={(val) => {
                                setFormData({...formData, yearId: val.value});
                                setYearSelected(val);
                                setLevelSelected([]);
                                setRombelSelected([]);
                                setProgramSelected([]);
                            }}
                            placeholder="Pilih Tahun Pelajaran"
                        />
                        <input type="hidden" id="yearId" className="form-control"/>
                        {errors.yearId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                    </div>
                </div>
                <div className="form-group col-md-4">
                    <label className="form-label" htmlFor="institutionId">Lembaga</label>
                    <div className="form-control-wrap">
                        <RSelect
                            options={institutionOptions}
                            value={institutionOptions?.find((c) => c.value === formData.institutionId)}
                            onChange={(val) => {
                                setFormData({...formData, institutionId: val.value});
                                setInstitutionSelected(val);
                                setLevelSelected([]);
                                setRombelSelected([]);
                                setProgramSelected([]);
                            }}
                            placeholder="Pilih Lembaga"
                        />
                        <input type="hidden" id="institutionId" className="form-control"/>
                        {errors.institutionId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                    </div>
                </div>
                <div className="form-group col-md-3">
                    <label className="form-label" htmlFor="levelId">Tingkat</label>
                    <div className="form-control-wrap">
                        <RSelect
                            options={levelOptions}
                            value={levelSelected}
                            onChange={(val) => {
                                setFormData({...formData, levelId: val.value});
                                setLevelSelected(val);
                                setRombelSelected([]);
                            }}
                            placeholder="Pilih Tingkat"
                        />
                        <input type="hidden" id="levelId" className="form-control"/>
                        {errors.levelId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                    </div>
                </div>
                <div className="form-group col-md-3">
                    <label className="form-label" htmlFor="rombelId">Rombel</label>
                    <div className="form-control-wrap">
                        <RSelect
                            options={rombelOptions}
                            value={rombelSelected}
                            onChange={(val) => {
                                setFormData({...formData, rombelId: val.value});
                                setRombelSelected(val);
                            }}
                            placeholder="Pilih Rombel"
                        />
                        <input type="hidden" id="rombelId" className="form-control"/>
                        {errors.rombelId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                    </div>
                </div>
                <div className="form-group col-md-3">
                    <label className="form-label" htmlFor="programId">ProgramId</label>
                    <div className="form-control-wrap">
                        <RSelect
                            options={programOptions}
                            value={programSelected}
                            onChange={(val) => {
                                setFormData({...formData, programId: val.value});
                                setProgramSelected(val);
                            }}
                            placeholder="Pilih Rombel"
                        />
                        <input type="hidden" id="rombelId" className="form-control"/>
                        {errors.rombelId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                    </div>
                </div>
                <div className="form-group col-md-3">
                    <label className="form-label" htmlFor="boardingId">Boarding</label>
                    <div className="form-control-wrap">
                        <RSelect
                            options={boardingOptions}
                            value={boardingSelected}
                            onChange={(val) => {
                                setFormData({...formData, boardingId: val.value});
                                setBoardingSelected(val);
                            }}
                            placeholder="Pilih Boarding"
                        />
                        <input type="hidden" id="boardingId" className="form-control"/>
                        {errors.boardingId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                    </div>
                </div>
                <div className="actions clearfix">
                    <ul>
                        <li>
                            <Button color="primary" type="button" onClick={props.prev}>Kembali</Button>
                        </li>
                    </ul>
                </div>
            </Row>
        </form>
    );
};

export default FormActivity;