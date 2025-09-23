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
import {get as getTransaction, destroy as destroyTransaction} from "@/api/finance/transaction"
import CashIn from "@/pages/finance/transaction/cash-in";
import CashOut from "@/pages/finance/transaction/cash-out";
import {numberFormat} from "@/utils";
import Payment from "@/pages/finance/transaction/payment.jsx";

const Transaction = () => {
    const [sm, updateSm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reloadData, setReloadData] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [transaction, setTransaction] = useState({
        id: "",
        institutionId: "",
        accountAppId: "",
        accountRevId: "",
        code: "",
        number: "",
        name: "",
        amount: 0,
        student: {
            value: null,
            label: ''
        },
    });
    const [modal, setModal] = useState({
        cashIn: false,
        cashOut: false,
        payment: false,
        moved: false,
    });
    const Columns = [
        {
            name: "Nama Jenjang",
            selector: (row) => row.institutionAlias,
            sortable: false,
            // hide: 370,
            width: "150px",
        },
        {
            name: "Tanggal",
            selector: (row) => row.date,
            sortable: false,
            // hide: 370,
            width: "150px",
        },
        {
            name: "Nomor Transaksi",
            selector: (row) => row.number,
            sortable: false,
            // hide: 370,
            width: "200px",
        },
        {
            name: "Keterangan",
            selector: (row) => row.name,
            sortable: false,
            // hide: 370,
            width: "650px",
        },
        {
            name: "Jumlah",
            selector: (row) => numberFormat(row.amount),
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
                                                <Button color="danger" size={"sm"} outline className="btn-white"
                                                        onClick={() => setModal({
                                                            cashIn: false,
                                                            cashOut: true,
                                                            payment: false,
                                                            moved: false,
                                                        })}>
                                                    <Icon name="upload"></Icon>
                                                    <span>KAS KELUAR</span>
                                                </Button>
                                            </li>
                                            <li>
                                                <Button color="info" size={"sm"} outline className="btn-white"
                                                        onClick={() => setModal({
                                                            cashIn: true,
                                                            cashOut: false,
                                                            payment: false,
                                                            moved: false,
                                                        })}>
                                                    <Icon name="download"></Icon>
                                                    <span>KAS MASUK</span>
                                                </Button>
                                            </li>
                                            <li>
                                                <Button color="warning" size={"sm"} outline className="btn-white"
                                                        onClick={() => setModal({
                                                            cashIn: false,
                                                            cashOut: false,
                                                            payment: true,
                                                            moved: false,
                                                        })}>
                                                    <Icon name="cc"></Icon>
                                                    <span>PEMBAYARAN</span>
                                                </Button>
                                            </li>
                                            <li>
                                                <Button color="success" size={"sm"} outline className="btn-white"
                                                        onClick={() => setModal({
                                                            cashIn: false,
                                                            cashOut: false,
                                                            payment: false,
                                                            moved: true,
                                                        })}>
                                                    <Icon name="cc"></Icon>
                                                    <span>PEMINDAHAN</span>
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
                <CashIn modal={modal} setModal={setModal} transaction={transaction} setTransaction={setTransaction} setReloadData={setReloadData} />
                <CashOut modal={modal} setModal={setModal} transaction={transaction} setTransaction={setTransaction} setReloadData={setReloadData} />
                <Payment modal={modal} setModal={setModal} transaction={transaction} setTransaction={setTransaction} setReloadData={setReloadData} />
            </Content>
        </React.Fragment>
    )
}
export default Transaction ;
