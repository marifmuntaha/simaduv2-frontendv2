import React, {useEffect, useState} from "react";
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
import {ButtonGroup, Spinner} from "reactstrap";
import {get as getRombel, destroy as destroyRombel} from "@/common/api/institution/rombel";
import {get as getYear} from "@/common/api/master/year";
import {get as getInstitution} from "@/common/api/institution";
import {get as getLevel} from "@/common/api/master/level";
import Partial from "@/pages/institution/rombel/partial";
import {useAuthContext} from "@/common/hooks/useAuthContext";
import {ColumnType, OptionsType, RombelType} from "@/common/types";
import {useYearContext} from "@/common/hooks/useYearContext";

const Rombel = () => {
    const year = useYearContext();
    const {user} = useAuthContext();
    const [sm, updateSm] = useState(false);
    const [reloadData, setReloadData] = useState(true);
    const [loading, setLoading] = useState<boolean|number|undefined>(false);
    const [modal, setModal] = useState(false);
    const [yearOptions, setYearOptions] = useState<OptionsType[]>([]);
    const [institutionOptions, setInstitutionOptions] = useState<OptionsType[]>([]);
    const [institutionSelected, setInstitutionSelected] = useState<OptionsType|null>();
    const [levelOptions, setLevelOptions] = useState<OptionsType[]>([]);
    const [rombels, setRombels] = useState<RombelType[]>([]);
    const [rombel, setRombel] = useState<RombelType>({
        id: undefined,
        yearId: year?.id,
        institutionId: user?.role === 1 ? undefined : user?.institution?.id,
        levelId: undefined,
        majorId: undefined,
        teacherId: undefined,
        name: "",
        alias: ""
    });
    const Column: ColumnType<RombelType>[] = [
        {
            name: "Tahun Pelajaran",
            selector: (row) => row.year?.name,
            sortable: false
        },
        {
            name: "Lembaga",
            selector: (row) => row.institution?.alias,
            sortable: false,

        },
        {
            name: "Tingkat",
            selector: (row) => row.level?.name,
            sortable: false,

        },
        {
            name: "Jurusan",
            selector: (row) => row.major?.name,
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
            name: "Wali Kelas",
            selector: (row) => row.teacher?.name,
            sortable: false,

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
                        setRombel(row);
                        setModal(true);
                    }}><Icon name="pen"/></Button>
                    <Button outline color="danger" onClick={() => {
                        setLoading(row.id)
                        destroyRombel(row.id).then(() => {
                            setLoading(false);
                            setReloadData(true);
                        }).catch(() => setLoading(false))
                    }}>{loading === row.id ? <Spinner size="sm"/> : <Icon name="trash"/>}</Button>
                </ButtonGroup>
            )
        },
    ];

    useEffect(() => {
        getYear<OptionsType>({type: 'select'}).then(year => setYearOptions(year));
        getInstitution<OptionsType>({type: 'select', ladder: 'alias', with: 'ladder'}).then(institution => {
            setInstitutionOptions(institution);
            if (user?.role !== 1) {
                setInstitutionSelected(institution?.find((item) => item.value === user?.institution?.id));
            }
        });
    }, [user]);

    useEffect(() => {
        institutionSelected?.value !== undefined && getLevel<OptionsType>({
            type: 'select',
            ladderId: institutionSelected.data.id
        }).then(level => setLevelOptions(level));
    }, [institutionSelected]);

    useEffect(() => {
        reloadData && getRombel<RombelType[]>({
            type: 'datatable',
            ...(rombel.yearId !== undefined && { yearId: rombel.yearId }),
            ...(rombel.institutionId !== undefined && { institutionId: rombel.institutionId }),
            ...(rombel.levelId !== undefined && {levelId: rombel.levelId})
        }).then((resp) => {
            setRombels(resp);
            setReloadData(false);
        }).catch(() => setLoading(false));
    }, [reloadData, rombel])

    return (
        <React.Fragment>
            <Head title="Data Rombongan Belajar"/>
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Data Rombongan Belajar</BlockTitle>
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
                        <Row className="gy-0">
                            <div className={`form-group col-md-${user?.role === 1 ? 4 : 6}`}>
                                <div className="form-control-wrap">
                                    <RSelect
                                        options={yearOptions}
                                        value={yearOptions.find((item) => item.value === rombel.yearId)}
                                        onChange={(val) => {
                                            setRombel({...rombel, yearId: val?.value});
                                            setReloadData(true);
                                        }}
                                        placeholder="Pilih Tahun Pelajaran"
                                    />
                                </div>
                            </div>
                            {user?.role === 1 && (
                                <div className="form-group col-md-4">
                                    <div className="form-control-wrap">
                                        <RSelect
                                            options={institutionOptions}
                                            value={institutionOptions.find((item) => item.value === rombel.institutionId)}
                                            onChange={(val) => {
                                                setRombel({...rombel, institutionId: val?.value});
                                                setInstitutionSelected(val);
                                                setReloadData(true);
                                            }}
                                            placeholder="Pilih Lembaga"
                                        />
                                    </div>
                                </div>
                            )}
                            <div className={`form-group col-md-${user?.role === 1 ? 4 : 6}`}>
                                <div className="form-control-wrap">
                                    <RSelect
                                        options={levelOptions}
                                        value={levelOptions.find((item) => item.value === rombel.levelId)}
                                        onChange={(val) => {
                                            setRombel({...rombel, levelId: val?.value});
                                            setReloadData(true);
                                        }}
                                        placeholder="Pilih Tingkat"
                                    />
                                </div>
                            </div>
                            <ReactDataTable data={rombels} columns={Column} pagination progressPending={reloadData}/>
                        </Row>
                    </PreviewCard>
                    <Partial
                        modal={modal}
                        setModal={setModal}
                        data={rombel}
                        setData={setRombel}
                        setReloadData={setReloadData}
                        yearOptions={yearOptions}
                        institutionOptions={institutionOptions}
                    />
                </Block>
            </Content>
        </React.Fragment>
    )
}

export default Rombel;
