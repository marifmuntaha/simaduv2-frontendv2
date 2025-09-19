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
import {get as getItem, destroy as destroyItem} from "@/api/finance/item"
import Partial from "@/pages/finance/account/partial";
import {numberFormat} from "@/utils";

const Item = () => {
    const [sm, updateSm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reloadData, setReloadData] = useState(true);
    const [items, setItems] = useState([]);
    const [item, setItem] = useState({
        id: "",
        yearId: "",
        institutionId: "",
        accountId: "",
        name: "",
        alias: "",
        gender: "",
        programId: "",
        boardingId: "",
        repeat: "",
        price: "",
    });
    const [modal, setModal] = useState(false);
    const boardingOptions = (boardingId) => {
        switch (boardingId) {
            case "0":
                return "Semua"
            case "1":
                return "Non Boarding"
            case "2":
                return "Tahfidz"
            case "3":
                return "Kitab"
        }
    }
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
            name: "Nama Item",
            selector: (row) => row.name,
            sortable: false,
            // hide: 370,
            // width: "200px",
        },
        {
            name: "Program",
            selector: (row) => row.programName,
            sortable: false,
            // hide: 370,

        },
        {
            name: "Boarding",
            selector: (row) => boardingOptions(row.boardingId),
            sortable: false,
            // hide: 370,

        },
        {
            name: "Jenis Kelamin",
            selector: (row) => row.gender,
            sortable: false,
            // hide: 370,

        },
        {
            name: "Bulanan",
            selector: (row) => row.repeat,
            sortable: false,
            // hide: 370,
            cell: (row) => (<Badge pill color="info">{row.repeat === '1' ? "Ya" : "Tidak"}</Badge>)

        },
        {
            name: "Harga",
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
                        setItem(row);
                        setModal(true);
                    }}><Icon name="pen"/></Button>
                    <Button outline color="danger" onClick={() => {
                        setLoading(row.id)
                        destroyItem(row.id).then(() => {
                            setLoading(false);
                            setReloadData(true);
                        }).catch(() => setLoading(false))
                    }}>{loading === row.id ? <Spinner size="sm"/> : <Icon name="trash"/>}</Button>
                </ButtonGroup>
            )
        },
    ];

    useEffect(() => {
        reloadData && getItem({list: 'table'}).then((resp) => {
            setItems(resp);
            setReloadData(false);
        }).catch(() => {
            setReloadData(false);
        })
    }, [reloadData]);
    return (
        <React.Fragment>
            <Head title="Item Tagihan"/>
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h4">Item Tagihan</BlockTitle>
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
                        <ReactDataTable data={items} columns={Columns} expandableRows pagination/>
                    </PreviewCard>
                </Block>
                <Partial modal={modal} setModal={setModal} item={item} setItem={setItem} setReloadData={setReloadData} />
            </Content>
        </React.Fragment>
    )
}
export default Item;
