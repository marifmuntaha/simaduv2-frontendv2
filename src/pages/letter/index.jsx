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
import {get as getLetter, destroy as destroyLetter} from "@/api/letter";
import Partial from "@/pages/letter/partial";
import {useOutletContext} from "react-router";

const Letter = () => {
    const {user} = useOutletContext();
    const [sm, updateSm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reloadData, setReloadData] = useState(true);
    const [letters, setLetters] = useState([]);
    const [letter, setLetter] = useState({
        id: null,
        yearId: user.yearId,
        institutionId: user.role === '1' ? null : user.institutionId,
        number: "",
        type: "",
        data: "",
        signature: '',
    });
    const [modal, setModal] = useState(false);
    const typeLetter = (type) => {
        switch (type) {
            case "1.01":
                return "Surat Keterangan"
            case "1.02":
                return "Surat Keterangan Aktif"
            case "1.03":
                return "Surat Pindah Sekolah"
            case "1.04":
                return "Surat Undangan"
            default:
                return ""
        }
    }
    const Columns = [
        {
            name: "Nomor Surat",
            selector: (row) => row.number,
            sortable: false,
            // hide: 370,
            width: "250px",
        },
        {
            name: "Tipe Surat",
            selector: (row) => typeLetter(row.type),
            sortable: false,
            // hide: 370,
            width: "200px",
        },
        {
            name: "Diskripsi",
            selector: (row) => row.data,
            sortable: false,
            // hide: 370,
            cell: (row) => {
                const data = JSON.parse(row.data);
                return ("Penerima: " + data.to + " Acara: " + data.event)
            }

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
                        setLetter(row);
                        setModal(true);
                    }}><Icon name="printer"/></Button>
                    <Button outline color="warning" onClick={() => {
                        setLetter(row);
                        setModal(true);
                    }}><Icon name="pen"/></Button>
                    <Button outline color="danger" onClick={() => {
                        setLoading(row.id)
                        destroyLetter(row.id).then(() => {
                            setLoading(false);
                            setReloadData(true);
                        }).catch(() => setLoading(false))
                    }}>{loading === row.id ? <Spinner size="sm"/> : <Icon name="trash"/>}</Button>
                </ButtonGroup>
            )
        },
    ];

    useEffect(() => {
        reloadData && getLetter({type: 'datatable'}).then((resp) => {
            setLetters(resp);
            setReloadData(false);
        }).catch(() => {
            setReloadData(false);
        })
    }, [reloadData]);
    return (
        <React.Fragment>
            <Head title="Data Jenjang"/>
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h4">Data Surat Masuk</BlockTitle>
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
                        <ReactDataTable data={letters} columns={Columns} expandableRows pagination/>
                    </PreviewCard>
                </Block>
                <Partial
                    user={user}
                    modal={modal}
                    setModal={setModal}
                    letter={letter}
                    setLetter={setLetter}
                    setReloadData={setReloadData}
                />
            </Content>
        </React.Fragment>
    )
}
export default Letter;
