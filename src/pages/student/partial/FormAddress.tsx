import React, {useEffect, useState} from "react";
import {Button} from "reactstrap";
import {Col, Row, RSelect} from "@/components";

const FormAddress = ({formData, setFormData, methods, ...props}) => {
    const [provinceOptions, setProvinceOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [districtOptions, setDistrictOptions] = useState([]);
    const [villageOptions, setVillageOptions] = useState()
    const {handleSubmit, register, setValue, formState: {errors}} = methods;
    const onSubmit = () => {
        props.next()
    }

    useEffect(() => {
        fetch(`https://marifmuntaha.github.io/api-wilayah-indonesia/api/provinces.json`)
            .then(response => response.json())
            .then((provinces) => {
                setProvinceOptions(() => {
                    return provinces.map((province) => {
                        return {value: province.id, label: province.name}
                    })
                });
            });
    }, [])

    useEffect(() => {
        formData.provinceId && fetch(`https://marifmuntaha.github.io/api-wilayah-indonesia/api/regencies/${formData.provinceId}.json`)
            .then(response => response.json())
            .then((regencies) => {
                setCityOptions(() => {
                    return regencies.map((regencies) => {
                        return {value: regencies.id, label: regencies.name}
                    })
                })
            });
    }, [formData.provinceId])

    useEffect(() => {
        formData.cityId && fetch(`https://marifmuntaha.github.io/api-wilayah-indonesia/api/districts/${formData.cityId}.json`)
            .then(response => response.json())
            .then((districts) => {
                setDistrictOptions(() => {
                    return districts.map((district) => {
                        return {value: district.id, label: district.name}
                    })
                })
            });
    }, [formData.cityId])

    useEffect(() => {
        formData.districtId && fetch(`https://marifmuntaha.github.io/api-wilayah-indonesia/api/villages/${formData.districtId}.json`)
            .then(response => response.json())
            .then((villages) => {
                setVillageOptions(() => {
                    return villages.map((village) => {
                        return {value: village.id, label: village.name}
                    })
                })
            });
    }, [formData.districtId]);

    useEffect(() => {
        setValue('address', formData.address);
    }, [formData.address, setValue]);

    return (
        <React.Fragment>
            <form className="content clearfix" onSubmit={handleSubmit(onSubmit)}>
                <Row className="gy-4">
                    <Col md="6">
                        <div className="form-group">
                            <label className="form-label" htmlFor="provinceId">Provinsi</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    id="provinceId"
                                    options={provinceOptions}
                                    value={provinceOptions?.find((e) => e.value === formData.provinceId)}
                                    onChange={(val) => {
                                        setFormData({...formData, provinceId: val.value})
                                    }}
                                    placeholder="Pilih Provinsi"
                                />
                            </div>
                        </div>
                    </Col>
                    <Col md="6">
                        <div className="form-group">
                            <label className="form-label" htmlFor="cityId">Kabupaten/Kota</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    id="cityId"
                                    options={cityOptions}
                                    value={cityOptions?.find((e) => e.value === formData.cityId)}
                                    onChange={(val) => {
                                        setFormData({...formData, cityId: val.value})
                                    }}
                                    placeholder="Pilih Kabupaten/Kota"
                                />
                            </div>
                        </div>
                    </Col>
                    <Col md="6">
                        <div className="form-group">
                            <label className="form-label" htmlFor="districtId">Kabupaten/Kota</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    id="districtId"
                                    options={districtOptions}
                                    value={districtOptions?.find((e) => e.value === formData.districtId)}
                                    onChange={(val) => {
                                        setFormData({...formData, districtId: val.value})
                                    }}
                                    placeholder="Pilih Kecamatan"
                                />
                            </div>
                        </div>
                    </Col>
                    <Col md="6">
                        <div className="form-group">
                            <label className="form-label" htmlFor="villageId">Kelurahan/Desa</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    id="villageId"
                                    options={villageOptions}
                                    value={villageOptions?.find((e) => e.value === formData.villageId)}
                                    onChange={(val) => {
                                        setFormData({...formData, villageId: val.value})
                                    }}
                                    placeholder="Pilih Kelurahan/Desa"
                                />
                            </div>
                        </div>
                    </Col>
                    <Col md="12">
                        <div className="form-group">
                            <label className="form-label" htmlFor="address">Alamat</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    id="address"
                                    className="form-control"
                                    placeholder="Ex. Jl. Jepara - Bugel KM. 7 Ds. Menganti Kec. Kedung Kab. Jepara - Jawa Tengah"
                                    {...register('address', { required: true })}
                                    onChange={(e) => {
                                        setFormData({...formData, address: e.target.value})
                                    }}
                                />
                                {errors.address && <span className="invalid">Kolom tidak boleh kosong.</span>}
                            </div>
                        </div>
                    </Col>
                </Row>
                <div className="actions clearfix">
                    <ul>
                        <li><Button color="primary" type="submit">Lanjut</Button></li>
                        <li><Button color="primary" type="button" onClick={props.prev}>Kembali</Button></li>
                    </ul>
                </div>
            </form>
        </React.Fragment>
    )
}

export default FormAddress;