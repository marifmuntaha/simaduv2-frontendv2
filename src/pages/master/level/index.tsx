import React, {useEffect, useMemo, useState} from "react";
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
import {get as getLevel, destroy as destroyLevel} from "@/common/api/master/level";
import Partial from "@/pages/master/level/partial";
import {ColumnType, LevelType} from "@/common/types";
import ButtonAction from "@/components/table/ButtonAction";

const Level = () => {
    const [sm, updateSm] = useState(false);
    const [reloadData, setReloadData] = useState(true);
    const [loading, setLoading] = useState<boolean|number|undefined>(false);
    const [modal, setModal] = useState(false);
    const [levels, setLevels] = useState<LevelType[]>([]);
    const [level, setLevel] = useState<LevelType>({
        id: undefined,
        ladderId: undefined,
        name: "",
        alias: "",
        description: "",
    });
    const buttonType = {
        show: false,
        edit: true,
        destroy: true,
    }
    const Column: ColumnType<LevelType>[] = useMemo(() => [
        {
            name: "Jenjang",
            selector: (row) => row.ladder?.alias,
            sortable: false,
        },
        {
            name: "Nama",
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
            cell: (row) => (
                <ButtonAction<LevelType>
                    types={buttonType}
                    data={row}
                    setData={setLevel}
                    setModal={setModal}
                    loading={loading}
                    setLoading={setLoading}
                    destroyData={destroyLevel}
                    setReloadData={setReloadData}
                />
            )
        },
    ], [loading]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        reloadData && getLevel<LevelType>({type: 'datatable'}).then((resp) => {
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
                    <Partial modal={modal} setModal={setModal} data={level} setData={setLevel} setReloadData={setReloadData}/>
                </Block>
            </Content>
        </React.Fragment>
    )
}

export default Level;
