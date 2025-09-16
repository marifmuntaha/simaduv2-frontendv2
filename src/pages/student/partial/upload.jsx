import React, {useEffect, useState} from "react";
import * as xlsx from "xlsx";
import moment from "moment/moment";
import {useForm} from "react-hook-form";
import {Button, Input, Modal, ModalBody, ModalHeader, Progress, Spinner} from "reactstrap";
import {Icon, Row, RSelect, RToast} from "@/components";
import {get as getInstitution} from "@/api/institution";
import {destroy as destroyUser, store as storeUser} from "@/api/user";
import {get as getYear} from "@/api/master/year";
import {get as getRombel} from "@/api/institution/rombel";
import {get as getProgram} from "@/api/institution/program";
import {get as getParent, store as storeParent, destroy as destroyParent} from "@/api/student/parent";
import {store as storeStudent, destroy as destroyStudent} from "@/api/student";
import {store as storeAddress, destroy as destroyAddress} from "@/api/student/address";
import {store as storeActivity} from "@/api/student/activity";
import {calcPercentage} from "@/utils";

const Upload = ({modal, setModal, setRefreshData}) => {
    const [loading, setLoading] = useState(false);
    const [dataStart, setDataStart] = useState(0);
    const [dataTotal, setDataTotal] = useState(0);
    const [yearOptions, setYearOptions] = useState([]);
    const [yearSelected, setYearSelected] = useState([]);
    const [institutionOptions, setInstitutionOptions] = useState([]);
    const [institutionSelected, setInstitutionSelected] = useState([]);
    const [rombelOptions, setRombelOptions] = useState([]);
    const [rombelSelected, setRombelSelected] = useState([]);
    const [programOptions, setProgramOptions] = useState([]);
    const [programSelected, setProgramSelected] = useState([]);
    const [file, setFile] = useState({});
    const {handleSubmit, register, setValue, formState: {errors}} = useForm();
    const onSubmit = async () => {
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
            await getParent({numberKk: item['Nomor KK']}).then(async (respStudentParent) => {
                if (respStudentParent.length > 0) {
                    const paramsUserStudent = {
                        name: item['Nama Lengkap'],
                        email: item['Email'],
                        username: item['NISN'],
                        password: item['Tanggal Lahir'],
                        phone: item['Nomor HP'],
                        role: '5'
                    }
                    await storeUser(paramsUserStudent).then(async respUserStudent => {
                        const paramsStudent = {
                            userId: respUserStudent.id,
                            parentId: respStudentParent[0].id,
                            nisn: item['NISN'],
                            nism: item['NISM'],
                            nik: item['NIK'],
                            name: item['Nama Lengkap'],
                            gender: item['Jenis Kelamin'] === 'Laki-laki' ? 'L' : 'P',
                            birthplace: item['Tempat Lahir'],
                            birthdate: moment(item['Tanggal Lahir'], 'DD/MM/YYYY').format('YYYY-MM-DD'),
                            email: item['Email'],
                            phone: item['Nomor HP'],
                        }
                        await storeStudent(paramsStudent).then(async (respStudent) => {
                            const paramsStudentAddress = {
                                studentId: respStudent.id,
                                address: item['Alamat']
                            }
                            await storeAddress(paramsStudentAddress).then(async (respStudentAddress) => {
                                const boardingId = (name) =>  {
                                    switch (name) {
                                        case "Tahfidz":
                                            return "1";
                                        case "Kitab":
                                            return "2";
                                        default:
                                            return "0";
                                    }
                                }
                                const params = {
                                    status: '1',
                                    studentId: respStudent.id,
                                    yearId: yearSelected.value,
                                    institutionId: institutionSelected.value,
                                    rombelId: rombelSelected.value,
                                    programId: programSelected.value,
                                    boardingId: boardingId(item['Boarding']),
                                }
                                await storeActivity(params).then(() => {
                                    start++
                                    setDataStart(start)
                                }).catch(()=>{
                                    setLoading(false);
                                    destroyAddress(respStudentAddress.id)
                                    destroyStudent(respStudent.id)
                                    destroyUser(respUserStudent.id)
                                })
                            }).catch(() => {
                                setLoading(false);
                                destroyStudent(respStudent.id);
                                destroyUser(respUserStudent.id);
                            })
                        }).catch(() => {
                            setLoading(false);
                            destroyUser(respUserStudent.id);
                        })
                    })
                } else {
                    let paramsUserParent = {};
                    switch (item['Status Wali']) {
                        case "Sama dengan ayah":
                            paramsUserParent = {
                                name: item['Nama Ayah'],
                                email: item['Email Ayah'],
                                username: item['NIK Ayah'],
                                password: item['Tempat Lahir Ayah'],
                                phone: item['Nomor HP Ayah'],
                                role: '6'
                            }
                            break;
                        case "Sama dengan ibu":
                            paramsUserParent = {
                                name: item['Nama Ibu'],
                                email: item['Email Ibu'],
                                username: item['NIK Ibu'],
                                password: item['Tempat Lahir Ibu'],
                                phone: item['Nomor HP Ibu'],
                                role: '6'
                            }
                            break;
                        case "Lainnya":
                            paramsUserParent = {
                                name: item['Nama Wali'],
                                email: item['Email Wali'],
                                username: item['NIK Wali'],
                                password: item['Tempat Lahir Wali'],
                                phone: item['Nomor HP Wali'],
                                role: '6'
                            }
                            break;
                        default:
                            break;
                    }
                    await storeUser(paramsUserParent).then(async (respUserParent) => {
                        const parentStatus = (status) => {
                            switch (status) {
                                case "Masih Hidup":
                                    return "1";
                                case "Meninggal":
                                    return "2";
                                default:
                                    return "3";
                            }
                        }
                        let paramsStudentParent = {
                            userId: respUserParent.id,
                            numberKk: item['Nomor KK'],
                            headFamily: item['Kepala Keluarga'],
                            fatherStatus: parentStatus(item['Status Ayah']),
                            fatherName: item['Nama Ayah'],
                            fatherNIK: item['NIK Ayah'],
                            fatherBirthplace: item['Tempat Lahir Ayah'],
                            fatherBirthdate: parentStatus(item['Status Ayah']) === '1' ? moment(item['Tanggal Lahir Ayah'], 'DD/MM/YYYY').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
                            fatherEmail: item['Email Ayah'],
                            fatherPhone: item['Nomor HP Ayah'],
                            motherStatus: parentStatus(item['Status Ibu']),
                            motherName: item['Nama Ibu'],
                            motherNIK: item['NIK Ibu'],
                            motherBirthplace: item['Tempat Lahir Ibu'],
                            motherBirthdate: parentStatus(item['Status Ibu']) === '1' ? moment(item['Tanggal Lahir Ibu'], 'DD/MM/YYYY').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
                            motherEmail: item['Email Ibu'],
                            motherPhone: item['Nomor HP Ibu'],
                        }
                        switch (item['Status Wali']) {
                            case "Sama dengan ayah":
                                paramsStudentParent = {
                                    ...paramsStudentParent,
                                    guardStatus: '1',
                                    guardName: item['Nama Ayah'],
                                    guardNIK: item['NIK Ayah'],
                                    guardBirthplace: item['Tempat Lahir Ayah'],
                                    guardBirthdate: moment(item['Tanggal Lahir Ayah'], 'DD/MM/YYYY').format('YYYY-MM-DD'),
                                    guardEmail: item['Email Ayah'],
                                    guardPhone: item['Nomor HP Ayah'],
                                }
                                break;
                            case "Sama dengan ibu":
                                paramsStudentParent = {
                                    ...paramsStudentParent,
                                    guardStatus: '2',
                                    guardName: item['Nama Ibu'],
                                    guardNIK: item['NIK Ibu'],
                                    guardBirthplace: item['Tempat Lahir Ibu'],
                                    guardBirthdate: moment(item['Tanggal Lahir Ibu'], 'DD/MM/YYYY').format('YYYY-MM-DD'),
                                    guardEmail: item['Email Ibu'],
                                    guardPhone: item['Nomor HP Ibu'],
                                }
                                break;
                            default:
                                paramsStudentParent = {
                                    ...paramsStudentParent,
                                    guardStatus: '3',
                                    guardName: item['Nama Wali'],
                                    guardNIK: item['NIK Wali'],
                                    guardBirthplace: item['Tempat Lahir Wali'],
                                    guardBirthdate: moment(item['Tanggal Lahir Wali'], 'DD/MM/YYYY').format('YYYY-MM-DD'),
                                    guardEmail: item['Email Wali'],
                                    guardPhone: item['Nomor HP Wali'],
                                }
                        }
                        await storeParent(paramsStudentParent).then(async respStudentParent => {
                            const paramsUserStudent = {
                                name: item['Nama Lengkap'],
                                email: item['Email'],
                                username: item['NISN'],
                                password: item['Tanggal Lahir'],
                                phone: item['Nomor HP'],
                                role: '5'
                            }
                            await storeUser(paramsUserStudent).then(async respUserStudent => {
                                const paramsStudent = {
                                    userId: respUserStudent.id,
                                    parentId: respStudentParent.id,
                                    nisn: item['NISN'],
                                    nism: item['NISM'],
                                    nik: item['NIK'],
                                    name: item['Nama Lengkap'],
                                    gender: item['Jenis Kelamin'] === 'Laki-laki' ? 'L' : 'P',
                                    birthplace: item['Tempat Lahir'],
                                    birthdate: moment(item['Tanggal Lahir'], 'DD/MM/YYYY').format('YYYY-MM-DD'),
                                    email: item['Email'],
                                    phone: item['Nomor HP'],
                                }
                                await storeStudent(paramsStudent).then(async (respStudent) => {
                                    const paramsStudentAddress = {
                                        studentId: respStudent.id,
                                        address: item['Alamat']
                                    }
                                    await storeAddress(paramsStudentAddress).then(async (respStudentAddress) => {
                                        const boardingId = (name) =>  {
                                            switch (name) {
                                                case "Tahfidz":
                                                    return "1";
                                                case "Kitab":
                                                    return "2";
                                                default:
                                                    return "0";
                                            }
                                        }
                                        const params = {
                                            status: '1',
                                            studentId: respStudent.id,
                                            yearId: yearSelected.value,
                                            institutionId: institutionSelected.value,
                                            rombelId: rombelSelected.value,
                                            programId: programSelected.value,
                                            boardingId: boardingId(item['Boarding']),
                                        }
                                        await storeActivity(params).then(() => {
                                            start++
                                            setDataStart(start)
                                        }).catch(()=>{
                                            destroyAddress(respStudentAddress.id)
                                            destroyStudent(respStudent.id)
                                            destroyUser(respUserStudent.id)
                                            destroyParent(respStudentParent.id)
                                            destroyUser(respUserParent.id)
                                        })
                                    }).catch(() => {
                                        destroyStudent(respStudent.id);
                                        destroyUser(respUserStudent.id);
                                        destroyParent(respStudentParent.id)
                                        destroyUser(respUserParent.id)
                                    })
                                }).catch(() => {
                                    destroyUser(respUserStudent.id);
                                    destroyParent(respStudentParent.id)
                                    destroyUser(respUserParent.id)
                                })
                            }).catch(() => {
                                destroyParent(respStudentParent.id)
                                destroyUser(respUserParent.id)
                            })
                        }).catch(() => {
                            destroyUser(respUserParent.id)
                        })
                    })
                }
            });
            if(start === jsonData.length) {
                setLoading(false)
                RToast('Data Siswa berhasil diunggah.', 'success')
                setRefreshData(true)
            }
        }
    }
    const toggle = () => {
        setModal(false);
        setInstitutionSelected([]);
        setYearSelected([]);
        setRombelSelected([]);
        setProgramSelected([]);
    }

    useEffect(() => {
        getYear({type: 'select'}).then((resp) => setYearOptions(resp));
        getInstitution({type: 'select', ladder: 'alias'}).then((resp) => setInstitutionOptions(resp));
    }, []);

    useEffect(() => {
        if (institutionSelected.value !== undefined && yearSelected.value !== undefined) {
            getRombel({
                type: 'select',
                institutionId: institutionSelected.value,
                yearId: yearSelected.value,
            }).then((resp) => {
                setRombelOptions(resp);
            });
            getProgram({
                type: 'select',
                institutionId: institutionSelected.value,
                yearId: yearSelected.value,
            }).then((resp) => {
                setProgramOptions(resp);
            });
        }
    }, [institutionSelected, yearSelected]);

    return (
        <Modal isOpen={modal} toggle={toggle} size="md">
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross"/>
                </button>
            }>UNGGAH</ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <Row className="gy-0">
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="institutionId">Pilih Lembaga</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={institutionOptions}
                                    value={institutionSelected}
                                    onChange={(val) => {
                                        setInstitutionSelected(val);
                                        setValue('institutionId', val.value)
                                    }}
                                    placeholder="Pilih Lembaga"
                                />
                                <input type="hidden" id="institutionId" className="form-control" {
                                    ...register("institutionId", {required: true, value: institutionSelected})
                                } />
                                {errors.institutionId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="yearId">Pilih Tahun Pelajaran</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={yearOptions}
                                    value={yearSelected}
                                    onChange={(val) => {
                                        setYearSelected(val);
                                        setValue('yearId', val.value)
                                    }}
                                    placeholder="Pilih Tahun Pelajaran"
                                />
                                <input type="hidden" id="yearId"
                                       className="form-control" {...register('yearId', {required: true})}/>
                                {errors.yearId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="rombelId">Pilih Rombel</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={rombelOptions}
                                    value={rombelSelected}
                                    onChange={(val) => {
                                        setRombelSelected(val);
                                        setValue('rombelId', val.value)
                                    }}
                                    placeholder="Pilih Rombel"
                                />
                                <input type="hidden" id="rombelId"
                                       className="form-control" {...register('rombelId', {required: true})}/>
                                {errors.rombelId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="programId">Pilih Program</label>
                            <div className="form-control-wrap">
                                <RSelect
                                    options={programOptions}
                                    value={programSelected}
                                    onChange={(val) => {
                                        setProgramSelected(val);
                                        setValue('programId', val.value)
                                    }}
                                    placeholder="Pilih Program"
                                />
                                <input type="hidden" id="programId"
                                       className="form-control" {...register('programId', {required: true})}/>
                                {errors.programId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="file">Unggah Data Siswa</label>
                            <div className="form-control-wrap">
                                <div className="form-file">
                                    <Input
                                        type="file"
                                        id="file"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        required
                                    />
                                </div>
                                <span className="ff-italic">Silahkan mengunduh template Data Siswa <a
                                    href={"/unduhan/template-siswa.xlsx"}>disini</a> </span>
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
                    </Row>
                </form>
            </ModalBody>
        </Modal>
    )
}

export default Upload;
