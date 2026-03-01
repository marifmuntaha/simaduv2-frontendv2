import React, {useCallback, useEffect, useState} from "react";
import {useOutletContext} from "react-router";
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
    ReactDataTable, Row, RSelect
} from "@/components";
import {get as getLetter, print as printLetter, destroy as destroyLetter} from "@/common/api/letter";
import Partial from "@/pages/letter/partial";

const Letter = () => {
    const {user} = useOutletContext();
    const [sm, updateSm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reloadData, setReloadData] = useState(true);
    const [yearOptions, setYearOptions] = useState([]);
    const [institutionOptions, setInstitutionOptions] = useState([]);
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
            selector: (row) => description(row.type, row.data),
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
                    <Button outline color="info" onClick={() => {
                        printLetter(row.id).then((resp) => {
                            window.location.href = String(resp);
                        });
                    }}>{loading === row.id ? <Spinner size="sm"/> : <Icon name="printer"/>}</Button>
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
    const paramsLetter = useCallback(() => {
        const params = {type: 'datatable'}
        if (letter.yearId !== null) {
            params.yearId = letter.yearId;
        }
        if (letter.institutionId !== null) {
            params.institutionId = letter.institutionId;
        }
        return params;
    }, [letter.yearId, letter.institutionId]);
    const description = (type, data) => {
        switch (type) {
            case "1.01":
                return ("Penerima: " + data?.to + " Acara: " + data?.event)
            case "1.02":
                return "Surat Keterangan Aktif"
            case "1.03":
                return ("Nama: " + data?.name + " NISN: " + data?.nisn + " Wali: " + data?.guardName + " Keterangan: " + data.description)
            case "1.04":
                return "Surat Undangan"
            default:
                return ""
        }
    }

    useEffect(() => {
        reloadData && getLetter(paramsLetter())
            .then((resp) => {
                setLetters(resp);
                setReloadData(false);
            }).catch(() => {
                setReloadData(false);
            });
    }, [reloadData, paramsLetter]);

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
                        <Row className="gy-0">
                            <div className="form-group col-md-6">
                                <div className="form-control-wrap">
                                    <RSelect
                                        options={yearOptions}
                                        value={yearOptions?.find((item) => item.value === letter.yearId)}
                                        onChange={(val) => {
                                            setLetter({...letter, yearId: val.value});
                                            setReloadData(true);
                                        }}
                                        placeholder="Pilih Tahun Pelajaran"
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div className="form-control-wrap">
                                    <RSelect
                                        options={institutionOptions}
                                        value={institutionOptions.find((item) => item.value === letter.institutionId)}
                                        onChange={(val) => {
                                            setLetter({...letter, institutionId: val.value});
                                            setReloadData(true);
                                        }}
                                        placeholder="Pilih Lembaga"
                                    />
                                </div>
                            </div>
                            <ReactDataTable data={letters} columns={Columns} expandableRows pagination/>
                        </Row>
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
