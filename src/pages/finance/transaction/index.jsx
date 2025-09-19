import React, {useEffect, useState} from "react";
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
    ReactDataTable
} from "@/components";
import {get as getTransaction, destroy as destroyTransaction} from "@/api/finance/transaction"
import Partial from "@/pages/finance/transaction/partial";
import {numberFormat} from "@/utils";

const Transaction = () => {
    const [sm, updateSm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reloadData, setReloadData] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [transaction, setTransaction] = useState({
        id: "",
        yearId: "",
        institutionId: "",
        accountId: "",
        name: "",
        type: "",
        code: "",
        amount: 0,
    });
    const [modal, setModal] = useState(false);
    const Columns = [
        {
            name: "Tahun Pelajaran",
            selector: (row) => row.yearName,
            sortable: false,
            // hide: 370,
            // width: "300px",
        },
        {
            name: "Nama Jenjang",
            selector: (row) => row.institutionAlias,
            sortable: false,
            // hide: 370,
            // width: "300px",
        },
        {
            name: "Keterangan",
            selector: (row) => row.name,
            sortable: false,
            // hide: 370,
            // width: "200px",
        },
        {
            name: "Kredit",
            selector: (row) => numberFormat(row.amount),
            sortable: false,
            // hide: 370,

        },
        {
            name: "Debit",
            selector: (row) => numberFormat(row.amount),
            sortable: false,
            // hide: 370,

        },
        {
            name: "Saldo",
            selector: (row) => numberFormat(row.price),
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
                        setTransaction(row);
                        setModal(true);
                    }}><Icon name="pen"/></Button>
                    <Button outline color="danger" onClick={() => {
                        setLoading(row.id)
                        destroyTransaction(row.id).then(() => {
                            setLoading(false);
                            setReloadData(true);
                        }).catch(() => setLoading(false))
                    }}>{loading === row.id ? <Spinner size="sm"/> : <Icon name="trash"/>}</Button>
                </ButtonGroup>
            )
        },
    ];

    useEffect(() => {
        reloadData && getTransaction({list: 'table'}).then((resp) => {
            setTransactions(resp);
            setReloadData(false);
        }).catch(() => {
            setReloadData(false);
        })
    }, [reloadData]);
    return (
        <React.Fragment>
            <Head title="Data Transaksi"/>
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h4">Data Transaksi</BlockTitle>
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
                        <ReactDataTable data={transactions} columns={Columns} expandableRows pagination/>
                    </PreviewCard>
                </Block>
                <Partial modal={modal} setModal={setModal} transaction={transaction} setTransaction={setTransaction} setReloadData={setReloadData} />
            </Content>
        </React.Fragment>
    )
}
export default Transaction ;
