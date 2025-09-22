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
import {get as getInvoice, destroy as destroyInvoice} from "@/api/finance/invoice"
import Group from "@/pages/finance/invoice/group.jsx";
import {numberFormat} from "@/utils";
import Individual from "@/pages/finance/invoice/individual.jsx";

const Invoice = () => {
    const [sm, updateSm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reloadData, setReloadData] = useState(true);
    const [invoices, setInvoices] = useState([]);
    const [invoice, setInvoice] = useState({
        id: "",
        yearId: "",
        institution: {id: "", ladderId: ""},
        itemId: "",
        levelId: "",
        rombelId: "",
        programId: "",
        boardingId: "",
        gender: "",
        studentId: "",
        number: "",
        amount: 0,
        name: "",
    });
    const [modal, setModal] = useState({
        individual: false,
        group: false
    });
    const Columns = [
        {
            name: "Nama Jenjang",
            selector: (row) => row.institutionAlias,
            sortable: false,
            // hide: 370,
            // width: "300px",
        },
        {
            name: "Tanggal",
            selector: (row) => row.date,
            sortable: false,
            // hide: 370,
            // width: "300px",
        },
        {
            name: "Nomor Transaksi",
            selector: (row) => row.number,
            sortable: false,
            // hide: 370,
            // width: "300px",
        },
        {
            name: "Nama Siswa",
            selector: (row) => row.studentName,
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
            name: "Jumlah",
            selector: (row) => numberFormat(row.amount),
            sortable: false,
            // hide: 370,

        },
        {
            name: "Status",
            selector: (row) => row.status,
            sortable: false,
            // hide: 370,
            cell: (row) => (
                <React.Fragment>
                    {row.status === '1' && (<Badge pill color="danger">Belum Dibayar</Badge> )}
                    {row.status === '2' && (<Badge pill color="warning">Terbayar</Badge> )}
                    {row.status === '3' && (<Badge pill color="success">Lunas</Badge> )}
                </React.Fragment>
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
                    <Button outline color="danger" onClick={() => {
                        setLoading(row.id)
                        destroyInvoice(row.id).then(() => {
                            setLoading(false);
                            setReloadData(true);
                        }).catch(() => setLoading(false))
                    }}>{loading === row.id ? <Spinner size="sm"/> : <Icon name="trash"/>}</Button>
                </ButtonGroup>
            )
        },
    ];

    useEffect(() => {
        reloadData && getInvoice({list: 'table'}).then((resp) => {
            setInvoices(resp);
            setReloadData(false);
        }).catch(() => {
            setReloadData(false);
        })
    }, [reloadData]);
    return (
        <React.Fragment>
            <Head title="Data Tagihan"/>
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h4">Data Tagihan</BlockTitle>
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
                                                <Button color="warning" size={"sm"} outline className="btn-white"
                                                        onClick={() => setModal({
                                                            individual: true,
                                                            group: false
                                                        })}>
                                                    <Icon name="plus"></Icon>
                                                    <span>PER INDIVIDU</span>
                                                </Button>
                                            </li>
                                            <li>
                                                <Button color="info" size={"sm"} outline className="btn-white"
                                                        onClick={() => setModal({
                                                            individual: false,
                                                            group: true
                                                        })}>
                                                    <Icon name="plus"></Icon>
                                                    <span>PER KELOMPOK</span>
                                                </Button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </BlockHeadContent>
                        </BlockBetween>
                    </BlockHead>
                    <PreviewCard>
                        <ReactDataTable data={invoices} columns={Columns} expandableRows pagination/>
                    </PreviewCard>
                </Block>
                <Individual modal={modal} setModal={setModal} invoice={invoice} setInvoice={setInvoice} setReloadData={setReloadData} />
                <Group modal={modal} setModal={setModal} invoice={invoice} setInvoice={setInvoice} setReloadData={setReloadData} />
            </Content>
        </React.Fragment>
    )
}
export default Invoice ;
