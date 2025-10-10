import React, {useEffect, useState} from "react";
import moment from "moment/moment";
import {Button, ButtonGroup, Spinner} from "reactstrap";
import {useOutletContext} from "react-router";
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
    ReactDataTable
} from "@/components";
import {get as getCertificate, store as storeCertificate, destroy as destroyCertificate} from "@/api/certificate";

const Certificate = () => {
    const {user} = useOutletContext();
    const [sm, updateSm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reloadData, setReloadData] = useState(true);
    const [certificates, setCertificates] = useState([]);
    const Columns = [
        {
            name: "Nama",
            selector: (row) => row.data['issuer']['commonName'],
            sortable: false,
            // hide: 370,
            width: "200px",
        },
        {
            name: "Serial Number",
            selector: (row) => row.data['serialNumberHex'],
            sortable: false,
            // hide: 370,
            width: "400px",
        },
        {
            name: "Aktif Sampai",
            selector: (row) => moment.unix(row.data['validTo_time_t']).format("DD/MM/YYYY"),
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
                    <Button outline color="danger" onClick={() => {
                        setLoading(row.id)
                        destroyCertificate(user.id).then(() => {
                            setLoading(false);
                            setReloadData(true);
                        }).catch(() => setLoading(false))
                    }}>{loading === row.id ? <Spinner size="sm"/> : <Icon name="trash"/>}</Button>
                </ButtonGroup>
            )
        },
    ];
    const handleSubmit = async () => {
        setLoading(true);
        const certificate = await storeCertificate(user);
        if (!certificate) {
            setLoading(false);
        } else {
            setReloadData(true);
            setLoading(false);
        }
    }

    useEffect(() => {
        reloadData && getCertificate({type: 'datatable'}).then((resp) => {
            setCertificates(resp);
            setReloadData(false);
        }).catch(() => {
            setReloadData(false);
        })
    }, [reloadData]);

    return (
        <React.Fragment>
            <Head title="Data Sertifikat"/>
            <Content page="component">
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h4">Data Sertifikat</BlockTitle>
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
                                                <Button color="danger" size={"sm"} outline className="btn-white" onClick={() => handleSubmit()}>
                                                    {loading
                                                        ? <Spinner size="sm"/>
                                                        : <React.Fragment>
                                                            <Icon name="reload"></Icon>
                                                            <span>GENERATE</span>
                                                        </React.Fragment>}
                                                </Button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </BlockHeadContent>
                        </BlockBetween>
                    </BlockHead>
                    <PreviewCard>
                        <ReactDataTable data={certificates} columns={Columns} expandableRows pagination/>
                    </PreviewCard>
                </Block>
            </Content>
        </React.Fragment>
    )
}
export default Certificate;
