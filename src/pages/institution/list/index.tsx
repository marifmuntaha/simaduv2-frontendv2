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
import {useAuthContext} from "@/common/hooks/useAuthContext";
import {get as getInstitution, destroy as destroyInstitution} from "@/common/api/institution"
import Partial from "@/pages/institution/list/partial";
import {ColumnType, InstitutionType} from "@/common/types";

const Institution = () => {
    const { user } = useAuthContext();
    const [sm, updateSm] = useState(false);
    const [reloadData, setReloadData] = useState(true);
    const [loading, setLoading] = useState<boolean|number|undefined>(false);
    const [modal, setModal] = useState(false);
    const [institutions, setInstitutions] = useState<InstitutionType[]>([]);
    const [institution, setInstitution] = useState<InstitutionType>({
        id: undefined,
        ladderId: undefined,
        name: "",
        alias: "",
        nsm: "",
        npsn: "",
        address: "",
        phone: "",
        email: "",
        website: "",
        logo: "",
    });
    const Column: ColumnType<InstitutionType>[] = [
        {
            name: "Jenjang",
            selector: (row) => row.ladder?.alias,
            sortable: false,
        },
        {
            name: "Nama",
            selector: (row) => row.name,
            sortable: false,

        },
        {
            name: "Alias",
            selector: (row) => row.alias,
            sortable: false,

        },
        {
            name: "NSM",
            selector: (row) => row.nsm,
            sortable: false,

        },
        {
            name: "NPSN",
            selector: (row) => row.npsn,
            sortable: false,

        },
        {
            name: "Aksi",
            selector: (row) => row.id,
            sortable: false,
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
                            setReloadData(true);
                        }).catch(() => setLoading(false))
                    }}>{loading === row.id ? <Spinner size="sm"/> : <Icon name="trash"/>}</Button>
                </ButtonGroup>
            )
        },
    ];
    const params = useCallback(() => {
        let param: any = {type: 'datatable'}
        if (user?.role !== 1) {
            param.institutionId = user?.institution?.id;
        }
        return param;
    }, [user]);
    useEffect(() => {
        reloadData && getInstitution<InstitutionType>(params()).then((resp) => {
            setInstitutions(resp)
            setReloadData(false);
        }).finally(() => setLoading(false));
    }, [reloadData, params]);

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
                                    {user?.role === 1 && (
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
                        <ReactDataTable data={institutions} columns={Column} pagination progressPending={reloadData}/>
                    </PreviewCard>
                    <Partial modal={modal} setModal={setModal} data={institution} setData={setInstitution} setReloadData={setReloadData}/>
                </Block>
            </Content>
        </React.Fragment>
    )
}

export default Institution;
