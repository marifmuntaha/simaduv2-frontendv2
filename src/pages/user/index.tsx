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
import { get as getUser, destroy as destroyUser } from "@/common/api/user";
import {ColumnType, UserType} from "@/common/types";
import Partial from "@/pages/user/partial";

const User = () => {
    const [sm, updateSm] = useState(false);
    const [loadData, setLoadData] = useState(true);
    const [loading, setLoading] = useState<boolean | number>(false);
    const [modal, setModal] = useState(false);
    const [users, setUsers] = useState<UserType[]>([]);
    const [user, setUser] = useState<UserType>({
        id: undefined,
        name: '',
        email: '',
        username: '',
        password: '',
        password_confirmation: '',
        role: 0,
    });
    const Column: ColumnType<UserType>[] = [
        {
            name: "Nama",
            selector: (row) => row.name,
            sortable: false,
            // hide: 370,
            // width: "300px",
        },
        {
            name: "Nama Pengguna",
            selector: (row) => row.username,
            sortable: false,
            // hide: 370,

        },
        {
            name: "Alamat Email",
            selector: (row) => row.email,
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
                        setUser(row);
                        setModal(true);
                    }}><Icon name="pen" /></Button>
                    <Button outline color="danger" onClick={() => {
                        if (!row.id) return;
                        setLoading(row.id);
                        destroyUser(row.id).then(() => {
                            setLoading(false);
                            setLoadData(true);
                        }).catch(() => setLoading(false))
                    }}>{loading === row.id ? <Spinner size="sm" /> : <Icon name="trash" />}</Button>
                </ButtonGroup>
            )
        },
    ];

    useEffect(() => {
        loadData && getUser<UserType>({ list: 'table' }).then((resp) => {
            setUsers(resp)
            setLoadData(false);
        }).catch(() => setLoading(false));
    }, [loadData])
    return (
        <React.Fragment>
            <Head title="Data Pengguna" />
            <Content page="component">
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Data Pengguna</BlockTitle>
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
                        <ReactDataTable data={users} columns={Column} pagination progressPending={loadData} />
                    </PreviewCard>
                     <Partial modal={modal} setModal={setModal} data={user} setData={setUser} setReloadData={setLoadData}/>
                </Block>
            </Content>
        </React.Fragment>
    )
}

export default User;
