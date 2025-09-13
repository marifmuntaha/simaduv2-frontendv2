import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Badge, ButtonGroup, Spinner} from "reactstrap";
import moment from "moment/moment";
import 'moment/locale/id'
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
import {get as getStudent, destroy as destoryStudent} from "@/api/student"

const List = () => {
    const [sm, updateSm] = useState(false);
    const [refreshData, setRefreshData] = useState(true);
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const Column = [
        {
            name: "Jenjang",
            selector: (row) => row.activity?.institution?.alias,
            sortable: false,
            // hide: 370,
            width: "100px",
        },
        {
            name: "Nama",
            selector: (row) => row.name,
            sortable: true,
            // hide: 370,
            width: "300px",

        },
        {
            name: "Tempat, Tanggal Lahir",
            selector: (row) => row.birthplace + ', ' + moment(row.birthdate).locale('id').format('DD MMM YYYY'),
            sortable: false,
            // hide: 370,

        },
        {
            name: "NISN",
            selector: (row) => row.nisn,
            sortable: false,
            // hide: 370,

        },
        {
            name: "NISM",
            selector: (row) => row.nism,
            sortable: false,
            // hide: 370,

        },
        {
            name: "Status",
            selector: (row) => row.activity.status,
            sortable: false,
            // hide: 370,
            cell: (row) => {
                switch(row?.activity?.status) {
                    case '1' :
                        return <Badge pill color="success">Aktif</Badge>
                    case '2':
                        return <Badge pill color="danger">Keluar</Badge>
                    default:
                        return <Badge pill color="info">Alumni</Badge>
                }
            }

        },
        {
            name: "Rombel",
            selector: (row) => row?.activity?.rombel?.alias,
            sortable: false,
            // hide: 370,

        },
        {
            name: "Boarding",
            selector: (row) => row?.activity?.boardingId,
            sortable: false,
            // hide: 370,
            cell: (row) => (
                row?.activity?.boardingId
                    ? <Badge pill color="success">YA</Badge>
                    : <Badge pill color="danger">No</Badge>
            )

        },
        {
            name: "Aksi",
            selector: (row) => row.id,
            sortable: false,
            // hide: "md",
            width: "150px",
            cell: (row) => (
                <ButtonGroup size="sm">
                    <Button outline color="info" onClick={() => navigate(`${row.id}/lihat`)}><Icon name="eye"/></Button>
                    <Button outline color="warning" onClick={() => navigate(`${row.id}/ubah`)}><Icon name="pen"/></Button>
                    {/*<Button outline color="danger" onClick={() => {*/}
                    {/*    setLoading(row.id)*/}
                    {/*    destoryStudent(row.id).then(() => {*/}
                    {/*        setLoading(false);*/}
                    {/*        setRefreshData(true);*/}
                    {/*    }).catch(() => setLoading(false))*/}
                    {/*}}>{loading === row.id ? <Spinner size="sm"/> : <Icon name="trash"/>}</Button>*/}
                </ButtonGroup>
            )
        },
    ];
    const navigate = useNavigate();
    useEffect(() => {
        refreshData && getStudent().then((resp) => {
            setStudents(resp)
            setRefreshData(false);
        }).catch(() => setLoading(false));
    }, [refreshData])
    return (
        <React.Fragment>
            <Head title="Data Siswa"/>
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Data Siswa</BlockTitle>
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
                                                        onClick={() => navigate('tambah')}>
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
                        <ReactDataTable data={students} columns={Column} pagination progressPending={refreshData}/>
                    </PreviewCard>
                </Block>
            </Content>
        </React.Fragment>
    )
}

export default List;