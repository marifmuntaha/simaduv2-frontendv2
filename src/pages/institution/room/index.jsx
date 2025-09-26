import React, {useCallback, useEffect, useState} from "react";
import {ButtonGroup, Spinner} from "reactstrap";
import Head from "@/layout/head";
import Content from "@/layout/content";
import {
    BackTo,
    Block,
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Button, Icon,
    PreviewCard,
    ReactDataTable, Row, RSelect
} from "@/components";
import {get as getYear} from "@/api/master/year";
import {get as getRoom, destroy as destroyRoom} from "@/api/institution/room";
import Partial from "@/pages/institution/room/partial";

const Room = () => {
    const [sm, updateSm] = useState(false);
    const [loadData, setLoadData] = useState(true);
    const [loading, setLoading] = useState(false);
    const [yearOptions, setYearOptions] = useState([]);
    const [yearSelected, setYearSelected] = useState([]);
    const [modal, setModal] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [room, setRoom] = useState({
        id: null,
        yearId: null,
        name: "",
        alias: ""
    });
    const Column = [
        {
            name: "Tahun Pelajaran",
            selector: (row) => row.yearName,
            sortable: false,
            // hide: 370,
            // width: "300px",
        },
        {
            name: "Nama",
            selector: (row) => row.name,
            sortable: false,
            // hide: 370,

        },
        {
            name: "Alias",
            selector: (row) => row.alias,
            sortable: false,
            // hide: 370,

        },
        {
            name: "Santri",
            selector: (row) => row.count,
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
                        setRoom(row);
                        setModal(true);
                    }}><Icon name="pen"/></Button>
                    <Button outline color="danger" onClick={() => {
                        setLoading(row.id)
                        destroyRoom(row.id).then(() => {
                            setLoading(false);
                            setLoadData(true);
                        }).catch(() => setLoading(false))
                    }}>{loading === row.id ? <Spinner size="sm"/> : <Icon name="trash"/>}</Button>
                </ButtonGroup>
            )
        },
    ];
    const params = useCallback(() => {
        let query = {type: 'datatable'}
        if (yearSelected.value !== undefined) {
            query.yearId = yearSelected.value;
        }

        return query;
    }, [yearSelected]);
    useEffect(() => {
        getYear({type: 'select'}).then(year => setYearOptions(year));
    }, []);
    useEffect(() => {
        loadData && getRoom(params()).then((resp) => {
            setRooms(resp)
            setLoadData(false);
        }).catch(() => setLoading(false));
    }, [loadData, params])
    return (
        <React.Fragment>
            <Head title="Data Kamar Santri"/>
            <Content page="component">
                <BlockHeadContent>
                    <BackTo link="/" icon="arrow-left">
                        Beranda
                    </BackTo>
                </BlockHeadContent>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Data Kamar Santri</BlockTitle>
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
                        <Row className="mb-3">
                            <div className="form-group col-md-12">
                                <div className="form-control-wrap">
                                    <RSelect
                                        options={yearOptions}
                                        value={yearSelected}
                                        onChange={(val) => {
                                            setYearSelected(val);
                                            setLoadData(true);
                                        }}
                                        placeholder="Pilih Tahun Pelajaran"
                                    />
                                </div>
                            </div>
                        </Row>
                        <ReactDataTable data={rooms} columns={Column} pagination progressPending={loadData}/>
                    </PreviewCard>
                    <Partial
                        modal={modal}
                        setModal={setModal}
                        room={room}
                        setRoom={setRoom}
                        setLoadData={setLoadData}
                        yearOptions={yearOptions}
                    />
                </Block>
            </Content>
        </React.Fragment>
    )
}

export default Room;
