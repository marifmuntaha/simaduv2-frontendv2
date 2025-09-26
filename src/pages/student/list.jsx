import React, {useCallback, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Badge, ButtonGroup, Spinner} from "reactstrap";
import 'moment/locale/id'
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
import {get as getStudent, destroy as destroyStudent} from "@/api/student";
import {get as getYear} from "@/api/master/year";
import {get as getInstitution} from "@/api/institution";
import {get as getRombel} from "@/api/institution/rombel";
import Upload from "@/pages/student/partial/upload";

const List = () => {
    const [sm, updateSm] = useState(false);
    const [modal, setModal] = useState(false)
    const [refreshData, setRefreshData] = useState(true);
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [yearOptions, setYearOptions] = useState([]);
    const [yearSelected, setYearSelected] = useState([]);
    const [institutionOptions, setInstitutionOptions] = useState([]);
    const [institutionSelected, setInstitutionSelected] = useState([]);
    const [rombelOptions, setRombelOptions] = useState([]);
    const [rombelSelected, setRombelSelected] = useState([]);
    const [boardingSelected, setBoardingSelected] = useState([]);
    const Column = [
        {
            name: "Jenjang",
            selector: (row) => row.institutionAlias,
            sortable: false,
            // hide: 370,
            width: "100px",
        },
        {
            name: "Nama",
            selector: (row) => row.name,
            sortable: true,
            // hide: 370,
            width: "300px",

        },
        {
            name: "Tempat, Tanggal Lahir",
            selector: (row) => row.birth,
            sortable: false,
            // hide: 370,

        },
        {
            name: "NISN",
            selector: (row) => row.nisn,
            sortable: false,
            // hide: 370,

        },
        {
            name: "NISM",
            selector: (row) => row.nism,
            sortable: false,
            // hide: 370,

        },
        {
            name: "Status",
            selector: (row) => row.status,
            sortable: false,
            // hide: 370,
            cell: (row) => {
                switch(row?.status) {
                    case '1' :
                        return <Badge pill color="success">Aktif</Badge>
                    case '2':
                        return <Badge pill color="danger">Keluar</Badge>
                    case '3':
                    default:
                        return <Badge pill color="info">Alumni</Badge>
                }
            }

        },
        {
            name: "Rombel",
            selector: (row) => row.rombelAlias,
            sortable: false,
            // hide: 370,

        },
        {
            name: "Boarding",
            selector: (row) => row.boardingId,
            sortable: false,
            // hide: 370,
            cell: (row) => (
                row.boardingId !== '1'
                    ? <Badge pill color="success">YA</Badge>
                    : <Badge pill color="danger">No</Badge>
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
                    <Button outline color="info" onClick={() => navigate(`${row.id}/lihat`)}><Icon name="eye"/></Button>
                    <Button outline color="warning" onClick={() => navigate(`${row.id}/ubah`)}><Icon name="pen"/></Button>
                    <Button outline color="danger" onClick={() => {
                        setLoading(row.id)
                        destroyStudent(row.id).then(() => {
                            setLoading(false);
                            setRefreshData(true);
                        }).catch(() => setLoading(false))
                    }}>{loading === row.id ? <Spinner size="sm"/> : <Icon name="trash"/>}</Button>
                </ButtonGroup>
            )
        },
    ];
    const boardingOptions = [
        {value: '1', label: 'Non Boarding'},
        {value: '2', label: 'Tahfidz'},
        {value: '3', label: 'Kitab'},
    ]
    const navigate = useNavigate();
    const paramsStudent = useCallback(() => {
        let params = {type: 'datatable'};
        if (yearSelected.value !== undefined) {
            params.yearId = yearSelected.value
        }
        if (institutionSelected.value !== undefined) {
            params.institutionId = institutionSelected.value
        }
        if (rombelSelected.value !== undefined) {
            params.rombelId = rombelSelected.value
        }
        if (boardingSelected.value !== undefined) {
            params.boardingId = boardingSelected.value
        }

        return params;
    }, [yearSelected, institutionSelected, rombelSelected, boardingSelected])
    useEffect(() => {
        getYear({type: 'select'}).then((resp) => setYearOptions(resp));
        getInstitution({type: 'select', ladder: 'alias'})
            .then((resp) => setInstitutionOptions(resp));
    }, []);

    useEffect(() => {
        yearSelected.value !== undefined &&
        institutionSelected.value &&
        getRombel({type: 'select', yearId: yearSelected.value, institutionId: institutionSelected.value})
            .then((resp) => setRombelOptions(resp));
    }, [yearSelected, institutionSelected]);
    useEffect(() => {
        refreshData && getStudent(paramsStudent()).then((resp) => {
            setStudents(resp);
            setRefreshData(false);
        }).catch(() => setLoading(false));
    }, [refreshData, paramsStudent]);
    return (
        <React.Fragment>
            <Head title="Data Siswa"/>
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Data Siswa</BlockTitle>
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
                                                        onClick={() => navigate('tambah')}>
                                                    <Icon name="plus"></Icon>
                                                    <span>TAMBAH</span>
                                                </Button>
                                            </li>
                                            <li>
                                                <Button color="danger" size={"sm"} outline className="btn-white"
                                                        onClick={() => setModal(true)}>
                                                    <Icon name="upload"></Icon>
                                                    <span>UNGGAH</span>
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
                            <div className="form-group col-md-3">
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
                            <div className="form-group col-md-3">
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
                            <div className="form-group col-md-3">
                                <div className="form-control-wrap">
                                    <RSelect
                                        options={rombelOptions}
                                        value={rombelSelected}
                                        onChange={(val) => {
                                            setRombelSelected(val);
                                            setRefreshData(true);
                                        }}
                                        placeholder="Pilih Rombel"
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-3">
                                <div className="form-control-wrap">
                                    <RSelect
                                        options={boardingOptions}
                                        value={boardingSelected}
                                        onChange={(val) => {
                                            setBoardingSelected(val);
                                            setRefreshData(true);
                                        }}
                                        placeholder="Pilih Boarding"
                                    />
                                </div>
                            </div>
                        </Row>
                        <ReactDataTable data={students} columns={Column} pagination progressPending={refreshData}/>
                    </PreviewCard>
                    <Upload
                        modal={modal}
                        setModal={setModal}
                        setRefreshData={setRefreshData}
                        yearOptions={yearOptions}
                        institutionOptions={institutionOptions}
                        rombelOptions={rombelOptions}
                    />
                </Block>
            </Content>
        </React.Fragment>
    )
}

export default List;
