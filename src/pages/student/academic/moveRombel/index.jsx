import React, {useCallback, useEffect, useState} from "react";
import Head from "@/layout/head/index.jsx";
import Content from "@/layout/content/index.jsx";
import {
    Block,
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle, Button, Col, Icon,
    PreviewCard,
    Row, RSelect
} from "@/components/index.jsx";
import {Table} from "reactstrap";
import {get as getYear} from "@/api/master/year";
import {get as getInstitution} from '@/api/institution';
import {get as getRombel} from "@/api/institution/rombel";
import {get as getStudent} from "@/api/student";
import {store as storeActivity} from "@/api/student/activity";

const MoveRombel = () => {
    const [sm, updateSm] = useState(false);
    const [yearOptions, setYearOptions] = useState([]);
    const [yearSelected, setYearSelected] = useState([]);
    const [institutionOptions, setInstitutionOptions] = useState([]);
    const [institutionSelected, setInstitutionSelected] = useState([]);
    const [rombels, setRombels] = useState([]);
    const [rombelBeforeOptions, setRombelBeforeOptions] = useState([]);
    const [rombelBeforeSelected, setRombelBeforeSelected] = useState([]);
    const [studentBefore, setStudentBefore] = useState([]);
    const [studentAfter, setStudentAfter] = useState([]);
    const [rombelAfterOptions, setRombelAfterOptions] = useState([]);
    const [rombelAfterSelected, setRombelAfterSelected] = useState([]);
    const handleSubmit = (e) => {
        e.preventDefault();
        const rombel = rombels.find((item) => item.id === rombelAfterSelected.value);
        const newStudent = studentAfter.filter((item) => item.status === 1);
        newStudent.map((item) => {
            const params = {
                status: '1',
                studentId: item.id,
                yearId: yearSelected.value,
                institutionId: institutionSelected.value,
                levelId: rombel.levelId,
                majorId: rombel.majorId,
                rombelId: rombel.id,
                programId: item.programId,
                boardingId: item.boardingId,
            }
            storeActivity(params).then((resp) => {
                console.log(resp);
            })
        })
    }
    const handleAdd = (id) => {
        const student = studentBefore.find((student) => student.id === id);
        setStudentAfter([...studentAfter, {
            id: student.id,
            name: student.name,
            nisn: student.nisn,
            status: 1,
            programId: student.programId,
            boardingId: student.boardingId,
        }]);
        setStudentBefore(() => {
            return studentBefore.filter((student) => student.id !== id);
        })
    }
    const handleRemove = (id) => {
        const student = studentAfter.find((student) => student.id === id);
        setStudentBefore([...studentBefore, student]);
        setStudentAfter(() => {
            return studentAfter.filter((student) => student.id !== id);
        })
    }
    useEffect(() => {
        getYear({type: 'select'}).then(data => setYearOptions(data));
        getInstitution({type: 'select', ladder: "alias"}).then(data => setInstitutionOptions(data));
    }, []);
    useEffect(() => {
        if(yearSelected.value !== undefined && institutionSelected.value !== undefined){
            getRombel({yearId: yearSelected.value, institutionId: institutionSelected.value}).then(data => {
                setRombels(data);
                setRombelBeforeOptions(() => {
                    return data.map((item) => {
                        return {
                            value: item.id,
                            label: item.alias
                        }
                    })
                });
            });
        }
    }, [yearSelected, institutionSelected])

    useEffect(() => {
        rombelBeforeSelected.value !== undefined && getStudent({rombelId: rombelBeforeSelected.value}).then(data => setStudentBefore(() => {
            return data.map(student => {
                return {
                    id: student.id,
                    name: student.name,
                    nisn: student.nisn,
                    programId: student.activity?.programId,
                    boardingId: student.activity?.boardingId,
                }
            })
        }));
        const rombelAfter = rombels.filter((item) => item.id !== rombelBeforeSelected.value)
        setRombelAfterOptions(rombelAfter.map((item) => {
            return {
                value: item.id,
                label: item.alias
            }
        }));
    }, [rombels, rombelBeforeSelected])

    useEffect(() => {
        rombelAfterSelected.value !== undefined && getStudent({rombelId: rombelAfterSelected.value}).then(data => setStudentAfter(data));
    }, [rombelAfterSelected])
    return (
        <React.Fragment>
            <Head title="Pindah Kelas" />
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h4">Pindah Kelas</BlockTitle>
                                <p>
                                    Just import <code>ReactDataTable</code> from <code>components</code>, it is built in
                                    for react dashlite.
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
                                                <Button color="info" size={"sm"} outline className="btn-white" onClick={(e) => handleSubmit(e)}>
                                                    <Icon name="save"></Icon>
                                                    <span>PROSES</span>
                                                </Button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </BlockHeadContent>
                        </BlockBetween>
                    </BlockHead>
                    <Row className="gy-3">
                        <Col size="6">
                            <PreviewCard>
                                <Row className="gy-0">
                                    <div className="form-group col-md-4">
                                        <div className="form-control-wrap">
                                            <RSelect
                                                options={yearOptions}
                                                value={yearSelected}
                                                onChange={(val) => {
                                                    setYearSelected(val);
                                                }}
                                                placeholder="Pilih Tahun Pelajaran"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group col-md-4">
                                        <div className="form-control-wrap">
                                            <RSelect
                                                options={institutionOptions}
                                                value={institutionSelected}
                                                onChange={(val) => {
                                                    setInstitutionSelected(val);
                                                }}
                                                placeholder="Pilih Lembaga"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group col-md-4">
                                        <div className="form-control-wrap">
                                            <RSelect
                                                options={rombelBeforeOptions}
                                                value={rombelBeforeSelected}
                                                onChange={(val) => {
                                                    setRombelBeforeSelected(val);
                                                }}
                                                placeholder="Pilih Rombel"
                                            />
                                        </div>
                                    </div>
                                </Row>
                                <Row className="gy-0">
                                    <div className="col-md-12">
                                        <Table className="table table-bordered">
                                            <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Nama</th>
                                                <th>NISN</th>
                                                <th>Aksi</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {studentBefore?.map((row, i) => (
                                                <tr key={i}>
                                                    <td>{i+1}</td>
                                                    <td>{row.name}</td>
                                                    <td>{row.nisn}</td>
                                                    <td><Button className="btn btn-xs btn-info" onClick={() => handleAdd(row.id)}><Icon name="plus"/> </Button> </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Row>
                            </PreviewCard>
                        </Col>
                        <Col size="6">
                            <PreviewCard>
                                <Row className="gy-0">
                                    <div className="form-group col-md-4">
                                        <div className="form-control-wrap">
                                            <RSelect
                                                options={yearOptions}
                                                value={yearSelected}
                                                onChange={(val) => {
                                                    setYearSelected(val);
                                                }}
                                                placeholder="Pilih Tahun Pelajaran"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group col-md-4">
                                        <div className="form-control-wrap">
                                            <RSelect
                                                options={institutionOptions}
                                                value={institutionSelected}
                                                onChange={(val) => {
                                                    setInstitutionSelected(val);
                                                }}
                                                placeholder="Pilih Lembaga"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group col-md-4">
                                        <div className="form-control-wrap">
                                            <RSelect
                                                options={rombelAfterOptions}
                                                value={rombelAfterSelected}
                                                onChange={(val) => {
                                                    setRombelAfterSelected(val);
                                                }}
                                                placeholder="Pilih Rombel"
                                            />
                                        </div>
                                    </div>
                                </Row>
                                <Row className="gy-0">
                                    <div className="col-md-12">
                                        <Table className="table table-bordered">
                                            <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Nama</th>
                                                <th>NISN</th>
                                                <th>Aksi</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {studentAfter?.map((row, i) => (
                                                <tr key={i}>
                                                    <td>{i + 1}</td>
                                                    <td>{row.name}</td>
                                                    <td>{row.nisn}</td>
                                                    <td><Button className="btn btn-xs btn-danger" onClick={() => handleRemove(row.id)}><Icon name="trash"/> </Button> </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Row>
                            </PreviewCard>
                        </Col>
                    </Row>
                </Block>
            </Content>
        </React.Fragment>
    )
}

export default MoveRombel;