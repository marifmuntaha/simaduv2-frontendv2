import React, {useEffect, useState} from "react";
import {Button, ButtonGroup, Spinner} from "reactstrap";
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
import {get as getAccount, destroy as destroyAccount} from "@/api/finance/account"
import Partial from "@/pages/finance/account/partial.jsx";
import {numberFormat} from "@/utils";

const Account = () => {
    const [sm, updateSm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reloadData, setReloadData] = useState(true);
    const [accounts, setAccounts] = useState([]);
    const [account, setAccount] = useState({
        id: "",
        institutionId: "",
        parent: {id: '', codeApp: ''},
        codeApp: "",
        code: "",
        name: "",
        level: "",
        balance: "",
    });
    const [modal, setModal] = useState(false);
    const Columns = [
        {
            name: "Nama Jenjang",
            selector: (row) => row.institutionAlias,
            sortable: false,
            // hide: 370,
            // width: "300px",
        },
        {
            name: "Kode Rekening",
            selector: (row) => row.codeApp,
            sortable: false,
            // hide: 370,
            // width: "200px",
        },
        {
            name: "Nama Rekening",
            selector: (row) => row.name,
            sortable: false,
            // hide: 370,
            // width: "200px",
        },
        {
            name: "Saldo",
            selector: (row) => numberFormat(row.balance),
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
                        setAccount(row);
                        setModal(true);
                    }}><Icon name="pen"/></Button>
                    <Button outline color="danger" onClick={() => {
                        setLoading(row.id)
                        destroyAccount(row.id).then(() => {
                            setLoading(false);
                            setReloadData(true);
                        }).catch(() => setLoading(false))
                    }}>{loading === row.id ? <Spinner size="sm"/> : <Icon name="trash"/>}</Button>
                </ButtonGroup>
            )
        },
    ];

    useEffect(() => {
        reloadData && getAccount({list: 'table'}).then((resp) => {

            setAccounts(() => {
                return resp.map((account) => {
                    return {
                        id: account.id,
                        institutionId: account.institutionId,
                        parent: {id: account.parent, codeApp: account.codeApp},
                        codeApp: account.codeApp,
                        code: account.code,
                        name: account.name,
                        level: account.level    ,
                        balance: account.balance,
                        institutionAlias: account.institutionAlias
                    }
                })
            });
            setReloadData(false);
        }).catch(() => {
            setReloadData(false);
        })
    }, [reloadData]);
    return (
        <React.Fragment>
            <Head title="Data Rekening"/>
            <Content page="component">
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h4">Data Rekening</BlockTitle>
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
                        <ReactDataTable data={accounts} columns={Columns} expandableRows pagination/>
                    </PreviewCard>
                </Block>
                <Partial modal={modal} setModal={setModal} account={account} setAccount={setAccount} setReloadData={setReloadData} />
            </Content>
        </React.Fragment>
    )
}
export default Account;
