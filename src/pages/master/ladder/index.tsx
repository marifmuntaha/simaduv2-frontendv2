import React, { useEffect, useMemo, useState } from "react";
import { Button } from "reactstrap";
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
import { get as getLadder, destroy as destroyLadder } from "@/common/api/master/ladder";
import Partial from "@/pages/master/ladder/partial";
import { ColumnType, LadderType } from "@/common/types";
import ButtonAction from "@/components/table/ButtonAction";

const Ladder = () => {
    const [sm, updateSm] = useState(false);
    const [loading, setLoading] = useState<boolean | number | undefined>(false);
    const [reloadData, setReloadData] = useState(true);
    const [ladders, setLadders] = useState<LadderType[]>([]);
    const [ladder, setLadder] = useState<LadderType>({
        id: undefined,
        name: "",
        alias: "",
        description: "",
    });
    const [modal, setModal] = useState(false);
    const Columns: ColumnType<LadderType>[] = useMemo(() => [
        {
            name: "Nama Jenjang",
            selector: (row) => row.name,
            sortable: false,
        },
        {
            name: "Alias",
            selector: (row) => row.alias,
            sortable: false,
        },
        {
            name: "Deskripsi",
            selector: (row) => row.description,
            sortable: false,

        },
        {
            name: "Aksi",
            selector: (row) => row.id,
            sortable: false,
            width: "150px",
            cell: (row) => {
                const type = {
                    show: false,
                    edit: true,
                    destroy: true,
                }
                return (
                    <ButtonAction<LadderType>
                        types={type}
                        data={row}
                        setData={setLadder}
                        setModal={setModal}
                        loading={loading}
                        setLoading={setLoading}
                        destroyData={destroyLadder}
                        setReloadData={setReloadData}
                    />
                )
            }
        },
    ], [loading]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        reloadData && getLadder<LadderType>({ type: 'datatable' }).then((resp) => {
            setLadders(resp);
            setReloadData(false);
        }).catch(() => {
            setReloadData(false);
        })
    }, [reloadData]);
    return (
        <React.Fragment>
            <Head title="Data Jenjang" />
            <Content page="component">
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h4">Data Jenjang</BlockTitle>
                                <p>
                                    Data semua jenjang pendidikan
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
                        <ReactDataTable data={ladders} columns={Columns} expandableRows pagination />
                    </PreviewCard>
                </Block>
                <Partial modal={modal} setModal={setModal} data={ladder} setData={setLadder} setReloadData={setReloadData} />
            </Content>
        </React.Fragment>
    )
}
export default Ladder;
