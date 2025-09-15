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

const MoveRombel = () => {
    const [sm, updateSm] = useState(false);
    const [refreshData, setRefreshData] = useState(true);
    const [yearOptions, setYearOptions] = useState([]);
    const [yearSelected, setYearSelected] = useState([]);
    const [institutionOptions, setInstitutionOptions] = useState([]);
    const [institutionSelected, setInstitutionSelected] = useState([]);
    const [rombelBeforeOptions, setRombelBeforeOptions] = useState([]);
    const [rombelBeforeSelected, setRombelBeforeSelected] = useState([]);
    const [studentBefore, setStudentBefore] = useState([]);
    const [studentAfter, setStudentAfter] = useState([]);
    const [rombelAfterOptions, setRombelAfterOptions] = useState([]);
    const [rombelAfterSelected, setRombelAfterSelected] = useState([]);
    const handleAdd = (id) => {
        const student = studentBefore.find((student) => student.id === id);
        setStudentAfter([...studentAfter, student]);
        setStudentBefore(() => {
            return studentBefore.filter((student) => student.id !== id);
        })
    }
    useEffect(() => {
        getYear({type: 'select'}).then(data => setYearOptions(data));
        getInstitution({type: 'select', ladder: "alias"}).then(data => setInstitutionOptions(data));
    }, []);
    useEffect(() => {
        if(yearSelected.value === undefined && institutionSelected.value === undefined){
            getRombel({type: 'select'}).then(data => {
                setRombelBeforeOptions(data);
                setRombelAfterOptions(data);
            });
        }
    }, [yearSelected, institutionSelected])

    useEffect(() => {
        getStudent({rombelId: rombelBeforeSelected.value}).then(data => setStudentBefore(() => {
            return data.map(student => {
                return {
                    id: student.id,
                    name: student.name,
                    nisn: student.nisn,
                }
            })
        }));
    }, [rombelBeforeSelected])
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
                                                <th>Nama</th>
                                                <th>NISN</th>
                                                <th>Aksi</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {studentBefore?.map((row, i) => (
                                                <tr key={i}>
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
                                                    setRefreshData(true);
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
                                                    setRefreshData(true);
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
                                                <th>Nama</th>
                                                <th>NISN</th>
                                                <th>Aksi</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {studentAfter?.map((row, i) => (
                                                <tr key={i}>
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
                    </Row>
                </Block>
            </Content>
        </React.Fragment>
    )
}

export default MoveRombel;