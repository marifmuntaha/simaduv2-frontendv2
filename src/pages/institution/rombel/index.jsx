import React, {useEffect, useState} from "react";
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
import {ButtonGroup, Spinner} from "reactstrap";
import {get as getRombel, destroy as destroyRombel} from "@/api/institution/rombel";
import {get as getYear} from "@/api/master/year";
import {get as getInstitution} from "@/api/institution";
import {get as getLevel} from "@/api/master/level";
import Partial from "@/pages/institution/rombel/partial";
import {useOutletContext} from "react-router";

const Rombel = () => {
    const {user} = useOutletContext();
    const [sm, updateSm] = useState(false);
    const [loadData, setLoadData] = useState(true);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [yearOptions, setYearOptions] = useState([]);
    const [institutionOptions, setInstitutionOptions] = useState([]);
    const [institutionSelected, setInstitutionSelected] = useState([]);
    const [levelOptions, setLevelOptions] = useState([]);
    const [rombels, setRombels] = useState([]);
    const [rombel, setRombel] = useState({
        id: null,
        yearId: user.yearId,
        institutionId: user.role === '1' ? null : user.institutionId,
        levelId: null,
        majorId: null,
        teacherId: null,
        name: "",
        alias: ""
    });
    const Column = [
        {
            name: "Tahun Pelajaran",
            selector: (row) => row.yearName,
            sortable: false,
            // hide: 370,
            // width: "300px",
        },
        {
            name: "Lembaga",
            selector: (row) => row.institutionAlias,
            sortable: false,
            // hide: 370,

        },
        {
            name: "Tingkat",
            selector: (row) => row.levelName,
            sortable: false,
            // hide: 370,

        },
        {
            name: "Jurusan",
            selector: (row) => row.majorName,
            sortable: false,
            // hide: 370,

        },
        {
            name: "Nama",
            selector: (row) => row.name,
            sortable: false,
            // hide: 370,

        },
        {
            name: "Alias",
            selector: (row) => row.alias,
            sortable: false,
            // hide: 370,

        },
        {
            name: "Walikelas",
            selector: (row) => row.teacherName,
            sortable: false,
            // hide: 370,

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
                        setRombel(row);
                        setModal(true);
                    }}><Icon name="pen"/></Button>
                    <Button outline color="danger" onClick={() => {
                        setLoading(row.id)
                        destroyRombel(row.id).then(() => {
                            setLoading(false);
                            setLoadData(true);
                        }).catch(() => setLoading(false))
                    }}>{loading === row.id ? <Spinner size="sm"/> : <Icon name="trash"/>}</Button>
                </ButtonGroup>
            )
        },
    ];

    useEffect(() => {
        getYear({type: 'select'}).then(year => setYearOptions(year));
        getInstitution({type: 'select', ladder: 'alias', with: 'ladder'}).then(institution => {
            setInstitutionOptions(institution);
            if (user.role !== '1') {
                setInstitutionSelected(institution.find((item) => item.value === user.institutionId));
            }
        });
    }, [user]);

    useEffect(() => {
        const {value, ladder} = institutionSelected
        value !== undefined && getLevel({type: 'select', ladderId: ladder.id}).then(level => setLevelOptions(level));
    }, [institutionSelected]);

    useEffect(() => {
        loadData && getRombel({
            type: 'datatable',
            yearId: rombel.yearId,
            institutionId: rombel.institutionId,
            levelId: rombel.levelId,
        }).then((resp) => {
            setRombels(resp);
            setLoadData(false);
        }).catch(() => setLoading(false));
    }, [loadData, rombel])

    return (
        <React.Fragment>
            <Head title="Data Rombongan Belajar"/>
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Data Rombongan Belajar</BlockTitle>
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
                                                        onClick={() => setModal(true)}>
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
                            <div className={`form-group col-md-${user.role === '1' ? '4' : '6'}`}>
                                <div className="form-control-wrap">
                                    <RSelect
                                        options={yearOptions}
                                        value={yearOptions.find((item) => item.value === rombel.yearId)}
                                        onChange={(val) => {
                                            setRombel({...rombel, yearId: val.value});
                                            setLoadData(true);
                                        }}
                                        placeholder="Pilih Tahun Pelajaran"
                                    />
                                </div>
                            </div>
                            {user.role === '1' && (
                                <div className="form-group col-md-4">
                                    <div className="form-control-wrap">
                                        <RSelect
                                            options={institutionOptions}
                                            value={institutionOptions.find((item) => item.value === rombel.institutionId)}
                                            onChange={(val) => {
                                                setRombel({...rombel, institutionId: val.value});
                                                setInstitutionSelected(val);
                                                setLoadData(true);
                                            }}
                                            placeholder="Pilih Lembaga"
                                        />
                                    </div>
                                </div>
                            )}
                            <div className={`form-group col-md-${user.role === '1' ? '4' : '6'}`}>
                                <div className="form-control-wrap">
                                    <RSelect
                                        options={levelOptions}
                                        value={levelOptions.find((item) => item.value === rombel.levelId)}
                                        onChange={(val) => {
                                            setRombel({...rombel, levelId: val.value});
                                            setLoadData(true);
                                        }}
                                        placeholder="Pilih Tingkat"
                                    />
                                </div>
                            </div>
                            <ReactDataTable data={rombels} columns={Column} pagination progressPending={loadData}/>
                        </Row>
                    </PreviewCard>
                    <Partial
                        user={user}
                        modal={modal}
                        setModal={setModal}
                        rombel={rombel}
                        setRombel={setRombel}
                        setLoadData={setLoadData}
                        yearOptions={yearOptions}
                        institutionOptions={institutionOptions}
                        levelOptions={levelOptions}
                    />
                </Block>
            </Content>
        </React.Fragment>
    )
}

export default Rombel;
