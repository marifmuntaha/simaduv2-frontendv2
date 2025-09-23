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
import {get as getDiscount, destroy as destroyDiscount} from "@/api/finance/discount";
import Partial from "@/pages/finance/discount/partial";
import {numberFormat} from "@/utils";

const Discount = () => {
    const [sm, updateSm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reloadData, setReloadData] = useState(true);
    const [discounts, setDiscounts] = useState([]);
    const [discount, setDiscount] = useState({
        id: null
    });
    const [modal, setModal] = useState(false);
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
                    {/*<Button outline color="danger" onClick={() => {*/}
                    {/*    setLoading(row.id)*/}
                    {/*    destroyTransaction(row.id).then(() => {*/}
                    {/*        setLoading(false);*/}
                    {/*        setReloadData(true);*/}
                    {/*    }).catch(() => setLoading(false))*/}
                    {/*}}>{loading === row.id ? <Spinner size="sm"/> : <Icon name="trash"/>}</Button>*/}
                </ButtonGroup>
            )
        },
    ];

    useEffect(() => {
        reloadData && getDiscount({list: 'table'}).then((resp) => {
            setDiscounts(resp);
            setReloadData(false);
        }).catch(() => {
            setReloadData(false);
        })
    }, [reloadData]);
    return (
        <React.Fragment>
            <Head title="Potongan Tagihan"/>
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h4">Potongan Tagihan</BlockTitle>
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
                        <ReactDataTable data={discounts} columns={Columns} expandableRows pagination/>
                    </PreviewCard>
                </Block>
                <Partial modal={modal} setModal={setModal} discount={discount} setDiscount={setDiscount} setReloadData={setReloadData} />
            </Content>
        </React.Fragment>
    )
}
export default Discount ;
