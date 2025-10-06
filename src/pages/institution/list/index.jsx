import React, {useCallback, useEffect, useState} from "react";
import {ButtonGroup, Spinner} from "reactstrap";
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
    ReactDataTable
} from "@/components";
import {get as getInstitution, destroy as destroyInstitution} from "@/api/institution"
import Partial from "@/pages/institution/list/partial";
import {useOutletContext} from "react-router";

const Institution = () => {
    const {user} = useOutletContext();
    const [sm, updateSm] = useState(false);
    const [loadData, setLoadData] = useState(true);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [institutions, setInstitutions] = useState([]);
    const [institution, setInstitution] = useState({
        id: null,
        ladderId: null,
        name: "",
        alias: "",
        nsm: "",
        npsn: "",
        address: "",
        phone: "",
        email: "",
        website: "",
        image: "",
    });
    const Column = [
        {
            name: "Jenjang",
            selector: (row) => row.ladderAlias,
            sortable: false,
            // hide: 370,
            // width: "300px",
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
            name: "NSM",
            selector: (row) => row.nsm,
            sortable: false,
            // hide: 370,

        },
        {
            name: "NPSN",
            selector: (row) => row.npsn,
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
                        setInstitution(row);
                        setModal(true);
                    }}><Icon name="pen"/></Button>
                    <Button outline color="danger" onClick={() => {
                        setLoading(row.id)
                        destroyInstitution(row.id).then(() => {
                            setLoading(false);
                            setLoadData(true);
                        }).catch(() => setLoading(false))
                    }}>{loading === row.id ? <Spinner size="sm"/> : <Icon name="trash"/>}</Button>
                </ButtonGroup>
            )
        },
    ];
    const params = useCallback(() => {
        let param = {type: 'datatable'}
        if (user.role !== '1') {
            param.institutionId = user.institutionId;
        }
        return param;
    }, [user]);
    useEffect(() => {
        loadData && getInstitution(params()).then((resp) => {
            setInstitutions(resp)
            setLoadData(false);
        }).catch(() => setLoading(false));
    }, [loadData, params]);

    return (
        <React.Fragment>
            <Head title="Data Lembaga"/>
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Data Lembaga</BlockTitle>
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
                                    {user.role === "1" && (
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
                                    )}
                                </div>
                            </BlockHeadContent>
                        </BlockBetween>
                    </BlockHead>
                    <PreviewCard>
                        <ReactDataTable data={institutions} columns={Column} pagination progressPending={loadData}/>
                    </PreviewCard>
                    <Partial modal={modal} setModal={setModal} institution={institution} setInstitution={setInstitution} setLoadData={setLoadData}/>
                </Block>
            </Content>
        </React.Fragment>
    )
}

export default Institution;
