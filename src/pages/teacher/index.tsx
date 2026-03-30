import React, {useCallback, useEffect, useState} from "react";
import moment from "moment/moment";
import "moment/locale/id"
import {Badge, ButtonGroup, Spinner} from "reactstrap";
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
    ReactDataTable, Row, RSelect
} from "@/components";
import {destroy as destroyUser} from "@/common/api/user";
import {get as getTeacher, destroy as destroyTeacher} from "@/common/api/teacher";
import {get as getInstitution} from "@/common/api/institution";
import Partial from "@/pages/teacher/partial";
// import Upload from "@/pages/teacher/upload";
import {ColumnType, InstitutionType, OptionsType, TeacherType} from "@/common/types";
import {gender} from "@/lib";
import {TEACHER_STATUS_OPTIONS, teacherStatus} from "@/common/constants";

const Teacher = () => {
    const [sm, updateSm] = useState(false);
    const [loadData, setLoadData] = useState(true);
    const [loading, setLoading] = useState<boolean|number|undefined>(false);
    const [modal, setModal] = useState({
        partial: false,
        upload: false,
    });
    const [institutionOptions, setInstitutionOptions] = useState<OptionsType[]>([]);
    const [institutionSelected, setInstitutionSelected] = useState<OptionsType|null>();
    const [statusSelected, setStatusSelected] = useState<OptionsType|null>();
    const [teachers, setTeachers] = useState<TeacherType[]>([]);
    const [teacher, setTeacher] = useState<TeacherType>({
        id: undefined,
        userId: undefined,
        name: "",
        pegId: "",
        birthplace: "",
        birthdate: "",
        gender: 0,
        frontTitle: "",
        backTitle: "",
        phone: "",
        email: "",
        address: "",
        status: 0,
    });
    const Column: ColumnType<TeacherType>[] = [
        // {
        //     name: "Lembaga",
        //     selector: (row) => row.institution,
        //     sortable: false,
        //     // hide: 370,
        //     cell: (row) => {
        //         return row.institution?.map((item) => {
        //             return item.alias + ' '
        //         });
        //     }
        // },
        {
            name: "PegID",
            selector: (row) => row.pegId,
            sortable: false,
            // hide: 370,

        },
        {
            name: "Nama",
            selector: (row) => row.fullName,
            sortable: false,
            // hide: 370,
            // width: "300px",
        },
        {
            name: "Tempat, Tanggal Lahir",
            selector: (row) => row.birthplace + ', ' + moment(row.birthdate, 'YYYY-MM-DD').format('DD MMMM YYYY'),
            sortable: false,
            // hide: 370,
            // width: "300px",
        },
        {
            name: "Jenis Kelamin",
            selector: (row) => gender(row.gender),
            sortable: false,
        },
        {
            name: "Status",
            selector: (row) => row.status,
            sortable: false,
            // hide: 370,
            cell: (row) => (
                <Badge pill color={teacherStatus(row.status)?.color}> {teacherStatus(row.status)?.name}</Badge>
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
                    <Button outline color="warning" onClick={() => {
                        setTeacher(row);
                        setModal({
                            partial: true,
                            upload: false,
                        });
                    }}><Icon name="pen"/></Button>
                    <Button outline color="danger" onClick={() => {
                        setLoading(row.id)
                        destroyTeacher(row.id).finally(() => setLoading(false))
                    }}>{loading === row.id ? <Spinner size="sm"/> : <Icon name="trash"/>}</Button>
                </ButtonGroup>
            )
        },
    ];

    const statusOptions: OptionsType[] = [
        {value: 0, label: 'Semua'},
        ...TEACHER_STATUS_OPTIONS
    ]

    const params = useCallback(() => {
        let query: any = {list: 'table'}
        if (institutionSelected?.value !== 0) {
            query.institutionId = institutionSelected?.value;
        }
        if (statusSelected?.value !== 0) {
            query.status = statusSelected?.value;
        }
        return query;
    }, [institutionSelected, statusSelected]);

    useEffect(() => {
        const fetchData = async () => {
            const institutions = await getInstitution<OptionsType>({type: 'select', ladder: 'alias'})
            setInstitutionOptions([
                {value: 0, label: 'Semua'},
                ...institutions
            ])
        }
        fetchData()
    }, [])
    useEffect(() => {
        loadData && getTeacher<TeacherType>(params()).then((resp) => {
            setTeachers(resp);
        }).finally(() => {
            setLoading(false);
            setLoadData(false);
        });
    }, [loadData, params])
    return (
        <React.Fragment>
            <Head title="Data Guru"/>
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Data Guru</BlockTitle>
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
                                                <Button color="danger" size={"sm"} outline className="btn-white"
                                                        onClick={() => setModal({
                                                            partial: false,
                                                            upload: true,
                                                        })}>
                                                    <Icon name="upload"></Icon>
                                                    <span>UNGGAH</span>
                                                </Button>
                                            </li>
                                            <li>
                                                <Button color="primary" size={"sm"} outline className="btn-white"
                                                        onClick={() => setModal({
                                                            partial: true,
                                                            upload: false,
                                                        })}>
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
                                        options={institutionOptions}
                                        value={institutionSelected}
                                        onChange={(val) => {
                                            setInstitutionSelected(val);
                                            setLoadData(true);
                                        }}
                                        placeholder="Pilih Lembaga"
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div className="form-control-wrap">
                                    <RSelect
                                        options={statusOptions}
                                        value={statusSelected}
                                        onChange={(val) => {
                                            setStatusSelected(val);
                                            setLoadData(true);
                                        }}
                                        placeholder="Pilih Status"
                                    />
                                </div>
                            </div>
                        </Row>
                        <ReactDataTable data={teachers} columns={Column} pagination progressPending={loadData}/>
                    </PreviewCard>
                    <Partial
                        modal={modal}
                        setModal={setModal}
                        teacher={teacher}
                        setTeacher={setTeacher}
                        setLoadData={setLoadData}
                        institutionOptions={institutionOptions}
                    />
                    {/*<Upload*/}
                    {/*    modal={modal}*/}
                    {/*    setModal={setModal}*/}
                    {/*    setLoadData={setLoadData}*/}
                    {/*    institutionOptions={institutionOptions}*/}
                    {/*/>*/}
                </Block>
            </Content>
        </React.Fragment>
    )
}

export default Teacher;
