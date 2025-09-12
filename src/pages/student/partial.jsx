import React, {useState} from "react";
import Head from "@/layout/head";
import Content from "@/layout/content";
import {
    Block,
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Button,
    Icon,
    PreviewCard
} from "@/components";
import {Steps, StepsProvider, useSteps} from "react-step-builder";
import {useForm} from "react-hook-form";
import {store as storeUser, destroy as destroyUser} from "@/api/user"
import {store as storeStudent, destroy as destroyStudent} from "@/api/student"
import {store as storeParent, destroy as destroyParent} from "@/api/student/parent"
import {store as storeAddress, destroy as destroyAddress} from "@/api/student/address"
import {store as storeActivity} from "@/api/student/activity"


import FormPersonal from "./partial/FormPersonal";
import FormParent from "./partial/FormParent";
import FormAddress from "./partial/FormAddress";
import FormActivity from "./partial/FormActivity";

export const Add = () => {
    const [sm, updateSm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        nisn: '',
        nism: '',
        gender: '',
        birthplace: '',
        birthdate: new Date(),
        email: '',
        phone: '',
        fatherStatus: '',
        fatherName: '',
        fatherNIK: '',
        fatherBirthplace: '',
        fatherBirthdate: new Date(),
        fatherEmail: '',
        fatherPhone: '',
        motherStatus: '',
        motherName: '',
        motherNIK: '',
        motherBirthplace: '',
        motherBirthdate: new Date(),
        motherEmail: '',
        motherPhone: '',
        guardStatus: '',
        guardName: '',
        guardNIK: '',
        guardBirthplace: '',
        guardBirthdate: new Date(),
        guardEmail: '',
        guardPhone: '',

    })
    const methods = useForm()
    const onSubmit = () => {
        if (!formData.parentId) {
            const paramsUserParent = {
                name: formData.guardName,
                email: formData.guardEmail,
                username: formData.guardNIK,
                password: formData.guardBirthplace,
                phone: formData.guardPhone,
                role: '6'
            }
            storeUser(paramsUserParent).then(respUserParent => {
                const paramsStudentParent = {
                    userId: respUserParent.id,
                    numberKk: formData.numberKk,
                    headFamily: formData.headFamily,
                    fatherStatus: formData.fatherStatus,
                    fatherName: formData.fatherName,
                    fatherNIK: formData.fatherNIK,
                    fatherBirthplace: formData.fatherBirthplace,
                    fatherBirthdate: formData.fatherBirthdate,
                    fatherEmail: formData.fatherEmail,
                    fatherPhone: formData.fatherPhone,
                    motherStatus: formData.motherStatus,
                    motherName: formData.motherName,
                    motherNIK: formData.motherNIK,
                    motherBirthplace: formData.motherBirthplace,
                    motherBirthdate: formData.motherBirthdate,
                    motherEmail: formData.motherEmail,
                    motherPhone: formData.motherPhone,
                    guardStatus: formData.guardStatus,
                    guardName: formData.guardName,
                    guardNIK: formData.guardNIK,
                    guardBirthplace: formData.guardBirthplace,
                    guardBirthdate: formData.guardBirthdate,
                    guardEmail: formData.guardEmail,
                    guardPhone: formData.guardPhone,
                }
                storeParent(paramsStudentParent).then(respStudentParent => {
                    const paramsUserStudent = {
                        name: formData.name,
                        email: formData.email,
                        username: formData.nisn,
                        password: formData.birthplace,
                        phone: formData.phone,
                        role: '5'
                    }
                    storeUser(paramsUserStudent).then(respUserStudent=>{
                        const paramsStudent = {
                            userId: respUserStudent.id,
                            parentId: respStudentParent.id,
                            nisn: formData.nisn,
                            nism: formData.nism,
                            nik: formData.nik,
                            name: formData.name,
                            gender: formData.gender,
                            birthplace: formData.birthplace,
                            birthdate: formData.birthdate,
                            email: formData.email,
                            phone: formData.phone,
                        }
                        storeStudent(paramsStudent).then((respStudent) => {
                            const paramsStudentAddress = {
                                studentId: respStudent.id,
                                provinceId: formData.provinceId,
                                cityId: formData.cityId,
                                districtId: formData.districtId,
                                villageId: formData.villageId,
                                address: formData.address,
                            }
                            storeAddress(paramsStudentAddress).then((respStudentAddress) => {
                                const params = {
                                    status: formData.status,
                                    studentId: respStudent.id,
                                    yearId: formData.yearId,
                                    institutionId: formData.institutionId,
                                }
                                storeActivity(params).catch(()=>{
                                    destroyAddress(respStudentAddress.id)
                                    destroyStudent(respStudent.id)
                                    destroyUser(respUserStudent.id)
                                    destroyParent(respStudentParent.id)
                                    destroyUser(respUserParent.id)
                                })
                            }).catch(() => {
                                destroyStudent(respStudent.id)
                                destroyUser(respUserStudent.id)
                                destroyParent(respStudentParent.id)
                                destroyUser(respUserParent.id)
                            })
                        }).catch(() => {
                            destroyUser(respUserStudent.id)
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
        } else {
            const paramsUserStudent = {
                name: formData.name,
                email: formData.email,
                username: formData.nisn,
                password: formData.birthplace,
                phone: formData.phone,
                role: '5'
            }
            storeUser(paramsUserStudent).then(respUserStudent=>{
                const paramsStudent = {
                    userId: respUserStudent.id,
                    parentId: formData.parentId,
                    nisn: formData.nisn,
                    nism: formData.nism,
                    nik: formData.nik,
                    name: formData.name,
                    gender: formData.gender,
                    birthplace: formData.birthplace,
                    birthdate: formData.birthdate,
                    email: formData.email,
                    phone: formData.phone,
                }
                storeStudent(paramsStudent).then((respStudent) => {
                    const params = {
                        status: formData.status,
                        studentId: respStudent.id,
                        yearId: formData.yearId,
                        institutionId: formData.institutionId,
                        levelId: formData.levelId,
                        rombelId: formData.rombelId,
                        programId: formData.programId,
                        boardingId: formData.boardingId,
                    }
                    storeActivity(params).catch(()=>{
                        destroyStudent(respStudent.id)
                        destroyUser(respUserStudent.id)
                    })
                }).catch(() => {
                    destroyUser(respUserStudent.id)
                })
            })
        }

    }
    const handleReset = () => {
        setFormData({
            name: '',
            nisn: '',
            nism: '',
            nik: '',
            gender: '',
            birthplace: '',
            birthdate: new Date(),
            email: '',
            phone: '',
            fatherStatus: '',
            fatherName: '',
            fatherNIK: '',
            fatherBirthplace: '',
            fatherBirthdate: new Date(),
            fatherEmail: '',
            fatherPhone: '',
            motherStatus: '',
            motherName: '',
            motherNIK: '',
            motherBirthplace: '',
            motherBirthdate: new Date(),
            motherEmail: '',
            motherPhone: '',
            guardStatus: '',
            guardName: '',
            guardNIK: '',
            guardBirthplace: '',
            guardBirthdate: new Date(),
            guardEmail: '',
            guardPhone: '',
        })
        methods.reset()
    }
    return (
        <React.Fragment>
            <Head title="Tambah Siswa" />
            <Content page={"component"}>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Tambah Siswa</BlockTitle>
                                <p>
                                    Textual form controls—like <code className="code-tag">&lt;input&gt;</code>s,{" "}
                                    <code className="code-tag">&lt;select&gt;</code>s, and{" "}
                                </p>
                            </BlockHeadContent>
                            <BlockHeadContent>
                                <div className="toggle-wrap nk-block-tools-toggle">
                                    <Button
                                        className={`btn-icon btn-trigger toggle-expand me-n1 ${sm ? "active" : ""}`}
                                        onClick={() => updateSm(!sm)}
                                    >
                                        <Icon name="menu-alt-r"></Icon>
                                    </Button>
                                    <div className="toggle-expand-content" style={{display: sm ? "block" : "none"}}>
                                        <ul className="nk-block-tools g-3">
                                            <li>
                                                <Button color="primary" size={"sm"} outline className="btn-white"
                                                        onClick={methods.handleSubmit(onSubmit)}>
                                                    <Icon name="save"></Icon>
                                                    <span>SIMPAN</span>
                                                </Button>
                                            </li>
                                            <li>
                                                <Button color="danger" size={"sm"} outline className="btn-white"
                                                        onClick={() => handleReset()}>
                                                    <Icon name="reload"></Icon>
                                                    <span>RESET</span>
                                                </Button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </BlockHeadContent>
                        </BlockBetween>
                    </BlockHead>
                    <PreviewCard>
                        <StepsProvider>
                            <Step formData={formData} setFormData={setFormData} methods={methods}/>
                        </StepsProvider>
                    </PreviewCard>
                </Block>
            </Content>
        </React.Fragment>
    )
}



const Step = ({formData, setFormData, methods}) => {
    const { prev, next, current } = useSteps();
    return (
        <div className="nk-wizard nk-wizard-simple is-alter wizard clearfix">
            <div className="steps clearfix">
                <ul>
                    <li className={current >= 1 ? "first done" : "first"}>
                        <a href={"#"} onClick={(ev) => ev.preventDefault()}>
                            <span className="number">01</span> <h5>Informasi Pribadi</h5>
                        </a>
                    </li>
                    <li className={current >= 2 ? "first done" : "first"}>
                        <a href={"#"} onClick={(ev) => ev.preventDefault()}>
                            <span className="number">02</span> <h5>Informasi Orangtua</h5>
                        </a>
                    </li>
                    <li className={current >= 3 ? "first done" : "first"}>
                        <a href={"#"} onClick={(ev) => ev.preventDefault()}>
                            <span className="number">03</span> <h5>Informasi Tempat Tinggal</h5>
                        </a>
                    </li>
                    <li className={current >= 4 ? "first done" : "first"}>
                        <a href={"#"} onClick={(ev) => ev.preventDefault()}>
                            <span className="number">04</span> <h5>Aktifitas Siswa</h5>
                        </a>
                    </li>
                </ul>
            </div>
            <Steps>
                <FormPersonal next={next} prev={prev} formData={formData} setFormData={setFormData} methods={methods}/>
                <FormParent next={next} prev={prev} formData={formData} setFormData={setFormData} methods={methods}/>
                <FormAddress next={next} prev={prev} formData={formData} setFormData={setFormData} methods={methods}/>
                <FormActivity prev={prev} next={next} formData={formData} setFormData={setFormData} />
            </Steps>
        </div>
    )
}