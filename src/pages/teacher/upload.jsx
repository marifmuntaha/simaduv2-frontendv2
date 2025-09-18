import React, {useEffect, useState} from "react";
import {Button, Input, Modal, ModalBody, ModalHeader, Progress, Spinner} from "reactstrap";
import * as xlsx from "xlsx";
import moment from "moment";
import {Icon, RSelect, RToast} from "@/components";
import {get as getInstitution} from "@/api/institution"
import {store as storeUser, destroy as destroyUser} from "@/api/user"
import {store as storeTeacher} from "@/api/teacher";
import {calcPercentage} from "@/utils";

const Upload = ({modal, setModal, setLoadData}) => {
    const [loading, setLoading] = useState(false);
    const [dataStart, setDataStart] = useState(0);
    const [dataTotal, setDataTotal] = useState(0);
    const [institutionOptions, setInstitutionOptions] = useState([]);
    const [institutionSelected, setInstitutionSelected] = useState([]);
    const [errorsTeacher, setErrorsTeacher] = useState([]);
    const [file, setFile] = useState({})
    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = await file.arrayBuffer();
        const workbook = xlsx.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = xlsx.utils.sheet_to_json(worksheet, {
            header: 2,
            defval: "",
        });
        setDataTotal(jsonData.length);
        let start = 0;
        for await (let item of jsonData) {
            const userTeacher = await storeUser({
                name: item['Nama Lengkap'],
                email: item['Email'],
                username: item['PegId'],
                password: item['Tempat Lahir'],
                phone: item['Nomor HP'],
                role: '4'
            }, false)
            if (userTeacher === false) {
                start++;
                setDataStart(start);
                setErrorsTeacher(errorsTeacher => [...errorsTeacher, {
                    name: item['Nama Lengkap'],
                    pegId: item['PegId'],
                    status: 'Gagal ditambahkan'
                }]);
            } else {
                const teacher = await storeTeacher({
                    userId: userTeacher.id,
                    institution: [institutionSelected.value],
                    name: item['Nama Lengkap'],
                    pegId: item['PegId'],
                    birthplace: item['Tempat Lahir'],
                    birthdate: moment(item['Tanggal Lahir'], 'DD/MM/YYYY').format('YYYY-MM-DD'),
                    gender: item['Jenis Kelamin'],
                    frontTitle: item['Gelar Depan'],
                    backTitle: item['Gelar Belakang'],
                    phone: item['Nomor HP'],
                    email: item['Email'],
                    address: item['Alamat'],

                }, false);
                if (teacher === false) {
                    await destroyUser(userTeacher.id, false);
                    start++;
                    setDataStart(start);
                    setErrorsTeacher(errorsTeacher => [...errorsTeacher, {
                        name: item['Nama Lengkap'],
                        pegId: item['PegId'],
                        status: 'Gagal ditambahkan'
                    }]);
                } else {
                    start++;
                    setDataStart(start);
                }
            }
            if(start === jsonData.length) {
                setLoading(false)
                errorsTeacher.length === 0 && RToast('Data Guru berhasil diunggah.', 'success')
                setLoadData(true)
            }
        }
    }
    const toggle = () => {
        setModal({
            partial: false,
            upload: false,
        });
        setInstitutionSelected([]);
        setErrorsTeacher([]);
    }

    useEffect(() => {
        getInstitution({type: 'select', ladder: 'alias'}).then((resp) => setInstitutionOptions(resp));
    }, []);

    return (
        <Modal isOpen={modal.upload} toggle={toggle} size="md">
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross"/>
                </button>
            }>UNGGAH</ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={(e) => onSubmit(e)}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="institution">Pilih Lembaga</label>
                        <div className="form-control-wrap">
                            <RSelect
                                options={institutionOptions}
                                value={institutionSelected}
                                onChange={(val) => {
                                    setInstitutionSelected(val)
                                }}
                                placeholder="Pilih Lembaga"
                            />
                            <input type="hidden" id="institution" className="form-control"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="file">Unggah Data Guru</label>
                        <div className="form-control-wrap">
                            <div className="form-file">
                                <Input
                                    type="file"
                                    id="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    required
                                />
                            </div>
                            <span className="ff-italic">Silahkan mengunduh template Data Guru <a href={"/unduhan/template-guru.xlsx"}>disini</a> </span>
                        </div>
                    </div>
                    <div className="form-group">
                        {loading === true && (
                            <Progress className="progress-lg" value={calcPercentage(dataTotal, dataStart)}>
                                Mengunggah {dataStart} dari {dataTotal}
                            </Progress>
                        )}
                    </div>
                    <div className="form-group">
                        <Button color="primary" type="submit" size="md">
                            {loading ? <Spinner size="sm"/> : 'SIMPAN'}
                        </Button>
                    </div>
                </form>
                {errorsTeacher.length > 0 && (
                    <table className="table table-bordered mt-3">
                        <thead>
                        <tr>
                            <th scope="col">No</th>
                            <th scope="col">Nama Guru</th>
                            <th scope="col">PegId</th>
                            <th scope="col">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {errorsTeacher.map((item, idx) => (
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.pegId}</td>
                                <td>{item.status}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </ModalBody>
        </Modal>
    )
}

export default Upload;
