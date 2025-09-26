import React, {useCallback, useEffect, useState} from "react";
import {ButtonGroup, Spinner} from "reactstrap";
import Head from "@/layout/head";
import Content from "@/layout/content";
import {
    BackTo,
    Block,
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Button, Icon,
    PreviewCard,
    ReactDataTable, Row, RSelect
} from "@/components";
import {get as getProgram, destroy as destroyProgram} from "@/api/institution/program";
import {get as getYear} from "@/api/master/year";
import {get as getInstitution} from "@/api/institution";
import Partial from "@/pages/institution/program/partial";

const Program = () => {
    const [sm, updateSm] = useState(false);
    const [loadData, setLoadData] = useState(true);
    const [loading, setLoading] = useState(false);
    const [yearOptions, setYearOptions] = useState([]);
    const [yearSelected, setYearSelected] = useState([]);
    const [institutionOptions, setInstitutionOptions] = useState([]);
    const [institutionSelected, setInstitutionSelected] = useState([])
    const [modal, setModal] = useState(false);
    const [programs, setPrograms] = useState([]);
    const [program, setProgram] = useState({
        id: null,
        yearId: null,
        institutionId: null,
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
            name: "Aksi",
            selector: (row) => row.id,
            sortable: false,
            // hide: "md",
            width: "150px",
            cell: (row) => (
                <ButtonGroup size="sm">
                    <Button outline color="warning" onClick={() => {
                        setProgram(row);
                        setModal(true);
                    }}><Icon name="pen"/></Button>
                    <Button outline color="danger" onClick={() => {
                        setLoading(row.id)
                        destroyProgram(row.id).then(() => {
                            setLoading(false);
                            setLoadData(true);
                        }).catch(() => setLoading(false))
                    }}>{loading === row.id ? <Spinner size="sm"/> : <Icon name="trash"/>}</Button>
                </ButtonGroup>
            )
        },
    ];
    const params = useCallback(() => {
        let query = {list: 'table'}
        if (yearSelected.value !== undefined) {
            query.yearId = yearSelected.value;
        }
        if (institutionSelected.value !== undefined) {
            query.institutionId = institutionSelected.value;
        }
        return query;
    }, [yearSelected, institutionSelected]);
    useEffect(() => {
        getYear({type: 'select'}).then(year => setYearOptions(year));
        getInstitution({type: 'select', ladder: 'alias'}).then(institution => setInstitutionOptions(institution));
    }, []);
    useEffect(() => {
        loadData && getProgram(params()).then((resp) => {
            setPrograms(resp)
            setLoadData(false);
        }).catch(() => setLoading(false));
    }, [loadData, params])
    return (
        <React.Fragment>
            <Head title="Data Program"/>
            <Content page="component">
                <BlockHeadContent>
                    <BackTo link="/" icon="arrow-left">
                        Beranda
                    </BackTo>
                </BlockHeadContent>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Data Program</BlockTitle>
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
                            <div className="form-group col-md-6">
                                <div className="form-control-wrap">
                                    <RSelect
                                        options={yearOptions}
                                        value={yearSelected}
                                        onChange={(val) => {
                                            setYearSelected(val);
                                            setLoadData(true);
                                        }}
                                        placeholder="Pilih Tahun Pelajaran"
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div className="form-control-wrap">
                                    <RSelect
                                        options={institutionOptions}
                                        value={institutionSelected}
                                        onChange={(val) => {
                                            setInstitutionSelected(val);
                                            setLoadData(true);
                                        }}
                                        placeholder="Pilih Lembaga"
                                    />
                                </div>
                            </div>
                        </Row>
                        <ReactDataTable data={programs} columns={Column} pagination progressPending={loadData}/>
                    </PreviewCard>
                    <Partial
                        modal={modal}
                        setModal={setModal}
                        program={program}
                        setProgram={setProgram}
                        setLoadData={setLoadData}
                        yearOptions={yearOptions}
                        institutionOptions={institutionOptions}
                    />
                </Block>
            </Content>
        </React.Fragment>
    )
}

export default Program;
