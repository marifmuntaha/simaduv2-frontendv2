import React, {useEffect, useState} from "react";
import Head from "@/layout/head/index.jsx";
import Content from "@/layout/content/index.jsx";
import {useParams} from "react-router-dom";
import {Button, Col, PreviewCard, Row, RSelect} from "@/components/index.jsx";
import {useForm} from "react-hook-form";
import {get as getSetting, store as storeSetting} from "@/api/setting"
import {get as getAccount} from "@/api/finance/account";

const Setting = () => {
    const {institutionId} = useParams();
    const {handleSubmit, register, setValue, formState: {errors}} = useForm();
    const [accountOptions, setAccountOptions] = useState([]);
    const [setting, setSetting] = useState({});
    const onSubmit = () => {
        const keys = Object.keys(setting);
        keys.map(async (key) => {
            const formData = {
                id:  setting[key]['id'],
                institutionId: institutionId,
                name: key,
                value: setting[key]['value'],
            }
            await storeSetting(formData);
        })
    }
    const monthOptions = [
        {value: 1, label: "Januari"},
        {value: 2, label: "Februari"},
        {value: 3, label: "Maret"},
        {value: 4, label: "April"},
        {value: 5, label: "Mei"},
        {value: 6, label: "Juni"},
        {value: 7, label: "Juli"},
        {value: 8, label: "Agustus"},
        {value: 9, label: "September"},
        {value: 10, label: "Oktober"},
        {value: 11, label: "Nopember"},
        {value: 11, label: "Desember"},

    ]

    useEffect(() => {
        getAccount({type: 'select', with: 'codeApp', shown: 1, institutionId: institutionId}).then(data => setAccountOptions(data));
        getSetting({institutionId: institutionId}).then(data => setSetting(data[0]));
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
                                    <label className="form-label" htmlFor="site-name">
                                        Awal Tahun
                                    </label>
                                    <span className="form-note">Pilih awal tahun untuk perhitungan keuangan.</span>
                                </div>
                            </Col>
                            <Col lg="7">
                                <div className="form-group">
                                    <div className="form-control-wrap">
                                        <RSelect
                                            options={monthOptions}
                                            value={monthOptions?.find((c) => c.value === setting.firstMonth?.value)}
                                            onChange={(e) => {
                                                setSetting({...setting, firstMonth: {id: setting.firstMonth.id, value: e.value}});
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
                                            value={monthOptions?.find((c) => c.value === setting.lastMonth?.value)}
                                            onChange={(e) => {
                                                setSetting({...setting, lastMonth: {id: setting.lastMonth.id, value: e.value}});
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
                                            value={accountOptions?.find((c) => c.value === setting.cashTeller?.value)}
                                            onChange={(e) => {
                                                setSetting({...setting, cashTeller: {id: setting.cashTeller.id, value: e.value}});
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
                                            value={accountOptions?.find((c) => c.value === setting.cashBendahara?.value)}
                                            onChange={(e) => {
                                                setSetting({...setting, cashBendahara: {id: setting.cashBendahara.id, value: e.value}});
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
                        <Row className="g-3 align-center">
                            <Col lg="5">
                                <div className="form-group">
                                    <label className="form-label">Site Copyright</label>
                                    <span className="form-note">Copyright information of your website.</span>
                                </div>
                            </Col>
                            <Col lg="7">
                                <div className="form-group">
                                    <div className="form-control-wrap">
                                        <input
                                            type="text"
                                            id="site-copyright"
                                            className="form-control"
                                            defaultValue="&copy; 2019, DashLite. All Rights Reserved."
                                        />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className="g-3 align-center">
                            <Col lg="5">
                                <div className="form-group">
                                    <label className="form-label">Allow Registration</label>
                                    <span className="form-note">Enable or disable registration from site.</span>
                                </div>
                            </Col>
                            <Col lg="7">
                                <div className="form-group">
                                    <ul className="custom-control-group g-3 align-center flex-wrap">
                                        <li>
                                            <div className="custom-control custom-radio">
                                                <input
                                                    type="radio"
                                                    className="custom-control-input"
                                                    defaultChecked
                                                    name="reg-public"
                                                    id="reg-enable"
                                                />
                                                <label className="custom-control-label" htmlFor="reg-enable">
                                                    Enable
                                                </label>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="custom-control custom-radio">
                                                <input
                                                    type="radio"
                                                    className="custom-control-input"
                                                    name="reg-public"
                                                    id="reg-disable"
                                                />
                                                <label className="custom-control-label" htmlFor="reg-disable">
                                                    Disable
                                                </label>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="custom-control custom-radio">
                                                <input
                                                    type="radio"
                                                    className="custom-control-input"
                                                    name="reg-public"
                                                    id="reg-request"
                                                />
                                                <label className="custom-control-label" htmlFor="reg-request">
                                                    On Request
                                                </label>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </Col>
                        </Row>
                        <Row className="g-3 align-center">
                            <Col lg="5">
                                <div className="form-group">
                                    <label className="form-label">Main Website</label>
                                    <span className="form-note">Specify the URL if your main website is external.</span>
                                </div>
                            </Col>
                            <Col lg="7">
                                <div className="form-group">
                                    <div className="form-control-wrap">
                                        <input
                                            type="text"
                                            name="site-url"
                                            className="form-control"
                                            defaultValue="https://www.softnio.com"
                                        />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className="g-3 align-center">
                            <Col lg="5">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="site-off">
                                        Maintanance Mode
                                    </label>
                                    <span className="form-note">Enable to make website make offline.</span>
                                </div>
                            </Col>
                            <Col lg="7">
                                <div className="form-group">
                                    <div className="custom-control custom-switch">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            name="reg-public"
                                            id="site-off"
                                        />
                                        <label className="custom-control-label" htmlFor="site-off">
                                            Offline
                                        </label>
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
