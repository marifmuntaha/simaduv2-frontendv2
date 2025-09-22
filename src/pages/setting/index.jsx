import React, {useEffect, useState} from "react";
import Head from "@/layout/head/index.jsx";
import Content from "@/layout/content/index.jsx";
import {useParams} from "react-router-dom";
import {Button, Col, PreviewCard, Row, RSelect} from "@/components/index.jsx";
import {useForm} from "react-hook-form";
import {get as getSetting, store as storeSetting, update as updateSetting} from "@/api/setting"
import {get as getAccount} from "@/api/finance/account";
import {monthOptions} from "@/utils/index.jsx";

const Setting = () => {
    const {institutionId} = useParams();
    const {handleSubmit, register, setValue, formState: {errors}} = useForm();
    const [accountOptions, setAccountOptions] = useState([]);
    const [setting, setSetting] = useState({});
    const [firstMonthSelected, setFirstMonthSelected] = useState([]);
    const [lastMonthSelected, setLastMonthSelected] = useState([]);
    const [tellerApprox, setTellerApprox] = useState([]);
    const [bendaharaApprox, setBendaharaApprox] = useState([]);
    const onSubmit = () => {
        const keys = Object.keys(setting);
        keys.map(async (key) => {
            const formData = {
                id:  setting[key]['id'],
                institutionId: institutionId,
                name: key,
                value: setting[key]['value'],
            }
            if (formData.id !== undefined) {
                await updateSetting(formData, false);
            } else {
                await storeSetting(formData, false);
            }
        })
    }

    useEffect(() => {
        getAccount({type: 'select', with: 'codeApp', shown: 1, institutionId: institutionId}).then(account => {
            setAccountOptions(account);
            getSetting({institutionId: institutionId}).then(data => {
                let setting = {}
                data.map((item) => {
                    return Object.assign(setting, item);
                });
                setFirstMonthSelected(() => {
                    return monthOptions.find(item => item.value === setting?.firstMonth?.value);
                });
                setLastMonthSelected(() => {
                    return monthOptions.find(item => item.value === setting?.lastMonth?.value);
                });
                setTellerApprox(() => {
                    return account.find((item) => item.value === parseInt(setting?.cashTeller?.value));
                });
                setBendaharaApprox(() => {
                    return account.find((item) => item.value === parseInt(setting?.cashBendahara?.value));
                });
                setValue('firstMonth', setting?.cashTeller?.value);
                setValue('lastMonth', setting?.lastMonth?.value);
                setValue('cashTeller', setting?.cashTeller?.value);
                setValue('cashBendahara', setting?.cashBendahara?.value);
                setSetting(setting);
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [institutionId]);
    return (
        <React.Fragment>
            <Head title="Pengaturan"/>
            <Content page="component">
                <PreviewCard>
                    <div className="card-head">
                        <h5 className="card-title">Pengaturan Aplikasi</h5>
                    </div>
                    <form className="gy-3" onSubmit={handleSubmit(onSubmit)}>
                        <Row className="g-3 align-center">
                            <Col lg="5">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="site-name">Awal Tahun</label>
                                    <span className="form-note">Pilih awal tahun untuk perhitungan keuangan.</span>
                                </div>
                            </Col>
                            <Col lg="7">
                                <div className="form-group">
                                    <div className="form-control-wrap">
                                        <RSelect
                                            options={monthOptions}
                                            value={firstMonthSelected}
                                            onChange={(e) => {
                                                setSetting({...setting, firstMonth: {id: setting?.firstMonth?.id, value: e.value}});
                                                setFirstMonthSelected([{value : e.value, label: e.label, id: setting?.firstMonth?.id}]);
                                                setValue('firstMonth', e.value);
                                            }}
                                            placeholder="Pilih Awal Tahun"
                                        />
                                        <input type="hidden" id="firstMonth"
                                               className="form-control" {...register("firstMonth", {required: true})} />
                                        {errors.firstMonth && <span className="invalid">Kolom tidak boleh kosong.</span>}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className="g-3 align-center">
                            <Col lg="5">
                                <div className="form-group">
                                    <label className="form-label">Akhir Tahun</label>
                                    <span className="form-note">Pilih akhir tahun untuk perhitungan keuangan.</span>
                                </div>
                            </Col>
                            <Col lg="7">
                                <div className="form-group">
                                    <div className="form-control-wrap">
                                        <RSelect
                                            options={monthOptions}
                                            value={lastMonthSelected}
                                            onChange={(e) => {
                                                setSetting({...setting, lastMonth: {id: setting?.lastMonth?.id, value: e.value}});
                                                setLastMonthSelected([{value : e.value, label: e.label, id: setting?.lastMonth?.id}]);
                                                setValue('lastMonth', e.value);
                                            }}
                                            placeholder="Pilih Akhir Tahun"
                                        />
                                        <input type="hidden" id="lastMonth"
                                               className="form-control" {...register("lastMonth", {required: true})} />
                                        {errors.lastMonth && <span className="invalid">Kolom tidak boleh kosong.</span>}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className="g-3 align-center">
                            <Col lg="5">
                                <div className="form-group">
                                    <label className="form-label">Rekening Perkiraan Kas Teller</label>
                                    <span className="form-note">Pilih rekening perkiraan untuk kas teller</span>
                                </div>
                            </Col>
                            <Col lg="7">
                                <div className="form-group">
                                    <div className="form-control-wrap">
                                        <RSelect
                                            options={accountOptions}
                                            value={tellerApprox}
                                            onChange={(e) => {
                                                setSetting({...setting, cashTeller: {id: setting?.cashTeller?.id, value: e.value}});
                                                setTellerApprox([{value : e.value, label: e.label, id: setting?.cashTeller?.id}]);
                                                setValue('cashTeller', e.value);
                                            }}
                                            placeholder="Pilih Rekening"
                                        />
                                        <input type="hidden" id="cashTeller"
                                               className="form-control" {...register("cashTeller", {required: true})} />
                                        {errors.cashTeller && <span className="invalid">Kolom tidak boleh kosong.</span>}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className="g-3 align-center">
                            <Col lg="5">
                                <div className="form-group">
                                    <label className="form-label">Rekening Perkiraan Kas Bendahara</label>
                                    <span className="form-note">Pilih rekening perkiraan untuk kas bendahara</span>
                                </div>
                            </Col>
                            <Col lg="7">
                                <div className="form-group">
                                    <div className="form-control-wrap">
                                        <RSelect
                                            options={accountOptions}
                                            value={bendaharaApprox}
                                            onChange={(e) => {
                                                setSetting({...setting, cashBendahara: {id: setting?.cashBendahara?.id, value: e.value}});
                                                setBendaharaApprox([{value : e.value, label: e.label, id: setting?.cashBendahara?.id}]);
                                                setValue('cashBendahara', e.value);
                                            }}
                                            placeholder="Pilih Rekening"
                                        />
                                        <input type="hidden" id="cashBendahara"
                                               className="form-control" {...register("cashBendahara", {required: true})} />
                                        {errors.cashBendahara && <span className="invalid">Kolom tidak boleh kosong.</span>}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className="g-3">
                            <Col lg="7" className="offset-lg-5">
                                <div className="form-group mt-2">
                                    <Button color="primary" size="lg" type="submit">
                                        Update
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </form>
                </PreviewCard>
            </Content>
        </React.Fragment>
    )
}

export default Setting;
