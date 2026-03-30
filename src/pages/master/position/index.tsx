import React, { useEffect, useState } from "react";
import { ButtonGroup, Spinner } from "reactstrap";
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
import { get as getPosition, destroy as destroyPosition } from "@/common/api/master/position";
import { ColumnType, PositionType } from "@/common/types";
import Partial from "@/pages/master/position/partial";

const Position = () => {
    const [sm, updateSm] = useState(false);
    const [loadData, setLoadData] = useState(true);
    const [loading, setLoading] = useState<boolean | number>(false);
    const [modal, setModal] = useState(false);
    const [positions, setPositions] = useState<PositionType[]>([]);
    const [position, setPosition] = useState<PositionType>({
        id: undefined,
        name: "",
        description: "",
        alias: "",
        createdBy: undefined,
        updatedBy: undefined,
    });
    const Column: ColumnType<PositionType>[] = [
        {
            name: "Nama",
            selector: (row) => row.name,
            sortable: false,
            // hide: 370,
            // width: "300px",
        },
        {
            name: "Deskripsi",
            selector: (row) => row.description,
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
            name: "Aksi",
            selector: (row) => row.id,
            sortable: false,
            // hide: "md",
            width: "150px",
            cell: (row) => (
                <ButtonGroup size="sm">
                    <Button outline color="warning" onClick={() => {
                        setPosition(row);
                        setModal(true);
                    }}><Icon name="pen" /></Button>
                    <Button outline color="danger" onClick={() => {
                        if (!row.id) return;
                        setLoading(row.id);
                        destroyPosition(row.id).then(() => {
                            setLoading(false);
                            setLoadData(true);
                        }).catch(() => setLoading(false))
                    }}>{loading === row.id ? <Spinner size="sm" /> : <Icon name="trash" />}</Button>
                </ButtonGroup>
            )
        },
    ];

    useEffect(() => {
        loadData && getPosition({ list: 'table' }).then((resp) => {
            setPositions(resp as PositionType[])
            setLoadData(false);
        }).catch(() => setLoading(false));
    }, [loadData])
    return (
        <React.Fragment>
            <Head title="Data Tahun Pelajaran" />
            <Content page="component">
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Data Tahun Pelajaran</BlockTitle>
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
                                    <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
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
                        <ReactDataTable data={positions} columns={Column} pagination progressPending={loadData} />
                    </PreviewCard>
                     <Partial modal={modal} setModal={setModal} data={position} setData={setPosition} setReloadData={setLoadData}/>
                </Block>
            </Content>
        </React.Fragment>
    )
}

export default Position;
