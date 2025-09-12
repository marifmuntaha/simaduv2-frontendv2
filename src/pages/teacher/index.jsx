import React, {useCallback, useEffect, useState} from "react";
import moment from "moment/moment";
import "moment/locale/id"
import {Badge, ButtonGroup, Spinner} from "reactstrap";
import Head from "@/layout/head";
import Content from "@/layout/content";
import {
    Block,
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Button, Icon,
    PreviewCard,
    ReactDataTable, Row, RSelect
} from "@/components";
import {get as getTeacher, destroy as destroyTeacher} from "@/api/teacher"
import {get as getInstitution} from "@/api/institution"
import Partial from "./partial";
import Upload from "./upload";

const Teacher = () => {
    const [sm, updateSm] = useState(false);
    const [refreshData, setRefreshData] = useState(true);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({
        partial: false,
        upload: false,
    });
    const [institutionOptions, setInstitutionOptions] = useState([]);
    const [institutionSelected, setInstitutionSelected] = useState([]);
    const [statusSelected, setStatusSelected] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [teacher, setTeacher] = useState({
        id: "",
        userId: "",
        institution: [],
        name: "",
        pageId: "",
        birthplace: "",
        birthdate: new Date(),
        gender: "",
        frontTitle: "",
        backTitle: "",
        phone: "",
        email: "",
        address: "",
    });
    const Column = [
        {
            name: "Lembaga",
            selector: (row) => row.institution,
            sortable: false,
            // hide: 370,
            cell: (row) => {
                return row.institution.map((item) => {
                    return item.alias + ' '
                });
            }
        },
        {
            name: "PegID",
            selector: (row) => row.pegId,
            sortable: false,
            // hide: 370,

        },
        {
            name: "Nama",
            selector: (row) => row.fullName,
            sortable: false,
            // hide: 370,
            // width: "300px",
        },
        {
            name: "Tempat, Tanggal Lahir",
            selector: (row) => row.birthplace + ', ' + moment(row.birthdate, 'YYYY-MM-DD').format('DD MMMM YYYY'),
            sortable: false,
            // hide: 370,
            // width: "300px",
        },
        {
            name: "Jenis Kelamin",
            selector: (row) => row.gender,
            sortable: false,
            // hide: 370,
            // width: "300px",
            cell: (row) => {
                return row.gender === 'L' ? 'Laki-laki' : 'Perempuan'
            }
        },
        {
            name: "Aktif",
            selector: (row) => row.status,
            sortable: false,
            // hide: 370,
            cell: (row) => (
                <Badge pill color={row.status ? 'success' : 'danger'}> {row.status ? 'Ya' : 'Tidak'}</Badge>
            )

        },
        {
            name: "Aksi",
            selector: (row) => row.id,
            sortable: false,
            // hide: "md",
            width: "150px",
            cell: (row) => (
                <ButtonGroup size="sm">
                    <Button outline color="warning" onClick={() => {
                        setTeacher(row);
                        setModal({
                            partial: true,
                            upload: false,
                        });
                    }}><Icon name="pen"/></Button>
                    <Button outline color="danger" onClick={() => {
                        setLoading(row.id)
                        destroyTeacher(row.id).then(() => {
                            setLoading(false);
                            setRefreshData(true);
                        }).catch(() => setLoading(false))
                    }}>{loading === row.id ? <Spinner size="sm"/> : <Icon name="trash"/>}</Button>
                </ButtonGroup>
            )
        },
    ];
    const statusOptions = [
        {value: 1, label: "Aktif"},
        {value: 0, label: "Tidak Aktif"},
    ]
    const params = useCallback(() => {
        let query = {}
        if (institutionSelected.value !== undefined) {
            query.institutionId = institutionSelected.value;
        }
        if (statusSelected.value !== undefined) {
            query.status = statusSelected.value;
        }
        return query;
    }, [institutionSelected, statusSelected]);
    useEffect(() => {
        getInstitution({type: 'select', ladder: 'alias'}).then(resp => setInstitutionOptions(resp));
    }, [])
    useEffect(() => {
        refreshData && getTeacher(params()).then((resp) => {
            setTeachers(resp)
            setRefreshData(false);
        }).catch(() => setLoading(false));
    }, [refreshData, params])
    return (
        <React.Fragment>
            <Head title="Data Guru"/>
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Data Guru</BlockTitle>
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
                                                <Button color="danger" size={"sm"} outline className="btn-white"
                                                        onClick={() => setModal({
                                                            partial: false,
                                                            upload: true,
                                                        })}>
                                                    <Icon name="upload"></Icon>
                                                    <span>UNGGAH</span>
                                                </Button>
                                            </li>
                                            <li>
                                                <Button color="primary" size={"sm"} outline className="btn-white"
                                                        onClick={() => setModal({
                                                            partial: true,
                                                            upload: false,
                                                        })}>
                                                    <Icon name="plus"></Icon>
                                                    <span>TAMBAH</span>
                                                </Button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </BlockHeadContent>
                        </BlockBetween>
                    </BlockHead>
                    <PreviewCard>
                        <Row className="gy-0">
                            <div className="form-group col-md-6">
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
                            <div className="form-group col-md-6">
                                <div className="form-control-wrap">
                                    <RSelect
                                        options={statusOptions}
                                        value={statusSelected}
                                        onChange={(val) => {
                                            setStatusSelected(val);
                                            setRefreshData(true);
                                        }}
                                        placeholder="Pilih Status"
                                    />
                                </div>
                            </div>
                        </Row>
                        <ReactDataTable data={teachers} columns={Column} pagination progressPending={refreshData}/>
                    </PreviewCard>
                    <Partial modal={modal} setModal={setModal} teacher={teacher} setTeacher={setTeacher}
                             setRefreshData={setRefreshData}/>
                    <Upload modal={modal} setModal={setModal} setRefreshData={setRefreshData}/>
                </Block>
            </Content>
        </React.Fragment>
    )
}

export default Teacher;