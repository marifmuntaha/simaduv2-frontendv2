import React, {useEffect, useState} from "react";
import {ButtonGroup, Spinner} from "reactstrap";
import Head from "@/layout/head";
import Content from "@/layout/content";
import {
    Block,
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Button, Icon,
    PreviewCard,
    ReactDataTable
} from "@/components";
import {get as getLevel, destroy as destroyLevel} from "@/api/master/level";
import Partial from "@/pages/master/level/partial";

const Ladder = () => {
    const [sm, updateSm] = useState(false);
    const [reloadData, setReloadData] = useState(true);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [levels, setLevels] = useState([]);
    const [level, setLevel] = useState({
        id: null,
        ladderId: null,
        name: "",
        alias: "",
        description: "",
    });
    const Column = [
        {
            name: "Jenjang",
            selector: (row) => row.ladderAlias,
            sortable: false,
            // hide: 370,
            // width: "300px",
        },
        {
            name: "Nama",
            selector: (row) => row.name,
            sortable: false,
            // hide: 370,
            // width: "300px",
        },
        {
            name: "Alias",
            selector: (row) => row.alias,
            sortable: false,
            // hide: 370,
            // width: "200px",
        },
        {
            name: "Diskripsi",
            selector: (row) => row.description,
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
                        setLevel(row);
                        setModal(true);
                    }}><Icon name="pen"/></Button>
                    <Button outline color="danger" onClick={() => {
                        setLoading(row.id)
                        destroyLevel(row.id).then(() => {
                            setLoading(false);
                            setReloadData(true);
                        }).catch(() => setLoading(false))
                    }}>{loading === row.id ? <Spinner size="sm" /> : <Icon name="trash" /> }</Button>
                </ButtonGroup>
            )
        },
    ];

    useEffect(() => {
        reloadData && getLevel({list: 'table'}).then((resp) => {
            setLevels(resp);
            setReloadData(false);
        }).catch(() => setLoading(false));
    }, [reloadData]);
    return (
        <React.Fragment>
            <Head title="Data Tingkat"/>
            <Content page="component">
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Data Tingkat</BlockTitle>
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
                        <ReactDataTable data={levels} columns={Column} pagination progressPending={reloadData} />
                    </PreviewCard>
                    <Partial modal={modal} setModal={setModal} level={level} setLevel={setLevel} setReloadData={setReloadData}/>
                </Block>
            </Content>
        </React.Fragment>
    )
}

export default Ladder;
