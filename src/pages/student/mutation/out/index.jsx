import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router";
import {Badge, Button, ButtonGroup, Spinner} from "reactstrap";
import Head from "@/layout/head";
import Content from "@/layout/content";
import {
    Block,
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Icon,
    PreviewCard,
    ReactDataTable, Row, RSelect
} from "@/components";
import {get as getYear} from "@/api/master/year";
import {get as getInstitution} from "@/api/institution";
import {get as getMutation, destroy as destroyMutation} from "@/api/student/mutation";
import Partial from "./partial";

const MutationOut = () => {
    const {user} = useOutletContext();
    const [sm, updateSm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reloadData, setReloadData] = useState(true);
    const [mutations, setMutations] = useState([]);
    const [mutation, setMutation] = useState({
        id: null,
        yearId: user.yearId,
        institutionId: user.role === '1' ? null : user.institutionId,
        studentId: null,
        type: 1,
        description: "",
        letterEmis: "",
    });
    const [yearOptions, setYearOptions] = useState([]);
    const [institutionOptions, setInstitutionOptions] = useState([]);
    const [modal, setModal] = useState(false);
    const Columns = [
        {
            name: "Jenjang",
            selector: (row) => row.institution,
            sortable: false,
            // hide: 370,
            width: "100px",
        },
        {
            name: "Nomor Surat",
            selector: (row) => row.numberLetter,
            sortable: false,
            // hide: 370,
            // width: "200px",
        },
        {
            name: "Nama Siswa",
            selector: (row) => row.name,
            sortable: false,
            // hide: 370,
            // width: "200px",
        },
        {
            name: "Diskripsi",
            selector: (row) => row.description,
            sortable: false,
            // hide: 370,

        },
        {
            name: "Status",
            selector: (row) => row.status,
            sortable: false,
            // hide: 370,
            cell: (row) => (
                row.status === 1
                    ? <Badge pill size="sm" color="success">Terkirim</Badge>
                    : <Badge pill size="sm" color="danger">Belum terkirim</Badge>
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
                    <Button outline color="info" onClick={() => {
                        setMutation(row);
                        setModal(true);
                    }}><Icon name="printer"/></Button>
                    <Button outline color="warning" onClick={() => {
                        setMutation(row);
                        setModal(true);
                    }}><Icon name="pen"/></Button>
                    <Button outline color="danger" onClick={() => {
                        setLoading(row.id)
                        destroyMutation(row.id).then(() => {
                            setLoading(false);
                            setReloadData(true);
                        }).catch(() => setLoading(false))
                    }}>{loading === row.id ? <Spinner size="sm"/> : <Icon name="trash"/>}</Button>
                </ButtonGroup>
            )
        },
    ];

    useEffect(() => {
        reloadData && getMutation({type: 'datatable'}).then((resp) => {
            setMutations(resp);
            setReloadData(false);
        }).catch(() => {
            setReloadData(false);
        })
    }, [reloadData]);

    useEffect(() => {
        getYear({type: 'select'}).then(data => setYearOptions(data));
        getInstitution({type: 'select', ladder: 'alias'}).then(data => setInstitutionOptions(data));
    }, []);

    return (
        <React.Fragment>
            <Head title="Mutasi Keluar Siswa"/>
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h4">Data Mutasi Siswa</BlockTitle>
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
                            <div className={`form-group col-md-${user.role === '1' ? '6' : '12'}`}>
                                <label className="form-label" htmlFor="yearId">Pilih Tahun Pelajaran</label>
                                <div className="form-control-wrap">
                                    <RSelect
                                        options={yearOptions}
                                        value={yearOptions.find((e) => e.value === user.yearId)}
                                        onChange={(e) => {
                                            setMutation({...mutation, yearId: e.value})
                                        }}
                                        placeholder="Pilih Tahun Pelajaran"
                                    />
                                </div>
                            </div>
                            {user.role === '1' && (
                                <div className="form-group col-md-6">
                                    <label className="form-label" htmlFor="institutionId">Pilih Lembaga</label>
                                    <div className="form-control-wrap">
                                        <RSelect
                                            options={institutionOptions}
                                            value={institutionOptions?.find((e) => e.value === user.institutionId)}
                                            onChange={(e) => {
                                                setMutation({...mutation, institutionId: e.value});
                                            }}
                                            placeholder="Pilih Lembaga"
                                        />
                                    </div>
                                </div>
                            )}
                            <ReactDataTable data={mutations} columns={Columns} expandableRows pagination/>
                        </Row>
                    </PreviewCard>
                </Block>
                <Partial
                    user={user}
                    modal={modal}
                    setModal={setModal}
                    mutation={mutation}
                    setMutation={setMutation}
                    setReloadData={setReloadData}
                    yearOptions={yearOptions}
                    institutionOptions={institutionOptions}
                />
            </Content>
        </React.Fragment>
    )
}

export default MutationOut;
