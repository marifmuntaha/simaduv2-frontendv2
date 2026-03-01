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
    ReactDataTable, Row, RSelect
} from "@/components";
import { get as getProgram, destroy as destroyProgram } from "@/common/api/institution/program";
import { get as getYear } from "@/common/api/master/year";
import { get as getInstitution } from "@/common/api/institution";
import Partial from "@/pages/institution/program/partial";
import { useAuthContext } from "@/common/hooks/useAuthContext";
import { ColumnType, OptionsType, ProgramType } from "@/common/types";
import { useYearContext } from "@/common/hooks/useYearContext";

const Program = () => {
    const { user } = useAuthContext();
    const year = useYearContext();
    const [sm, updateSm] = useState(false);
    const [reloadData, setReloadData] = useState(true);
    const [loading, setLoading] = useState<boolean | number | undefined>(false);
    const [yearOptions, setYearOptions] = useState<OptionsType[]>([]);
    const [institutionOptions, setInstitutionOptions] = useState<OptionsType[]>([]);
    const [modal, setModal] = useState(false);
    const [programs, setPrograms] = useState<ProgramType[]>([]);
    const [program, setProgram] = useState<ProgramType>({
        id: undefined,
        yearId: year?.id,
        institutionId: user?.role === 1 ? undefined : user?.institution?.id,
        name: "",
        alias: ""
    });
    const Column: ColumnType<ProgramType>[] = [
        {
            name: "Tahun Pelajaran",
            selector: (row) => row.year?.name,
            sortable: false,
        },
        {
            name: "Lembaga",
            selector: (row) => row.institution?.alias,
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
            name: "Aksi",
            selector: (row) => row.id,
            sortable: false,
            width: "150px",
            cell: (row) => (
                <ButtonGroup size="sm">
                    <Button outline color="warning" onClick={() => {
                        setProgram(row);
                        setModal(true);
                    }}><Icon name="pen" /></Button>
                    <Button outline color="danger" onClick={() => {
                        setLoading(row.id)
                        destroyProgram(row.id).then(() => {
                            setLoading(false);
                            setReloadData(true);
                        }).catch(() => setLoading(false))
                    }}>{loading === row.id ? <Spinner size="sm" /> : <Icon name="trash" />}</Button>
                </ButtonGroup>
            )
        },
    ];

    useEffect(() => {
        getYear<OptionsType>({ type: 'select' }).then(year => {
            setYearOptions(year);
        });
        getInstitution<OptionsType>({ type: 'select', ladder: 'alias' }).then(institution => {
            setInstitutionOptions(institution);
        });
    }, [user]);

    useEffect(() => {
        reloadData && getProgram<ProgramType[]>({
            type: 'datatable',
            ...(program.yearId !== undefined && { yearId: program.yearId }),
            ...(program.institutionId !== undefined && { institutionId: program.institutionId }),
        }).then((resp) => {
            setPrograms(resp)
            setReloadData(false);
        }).finally(() => setLoading(false));
    }, [reloadData, program]);
    return (
        <React.Fragment>
            <Head title="Data Program" />
            <Content page="component">
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Data Program</BlockTitle>
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
                        <Row className="gy-0">
                            <div className={`form-group col-md-${user?.role === 1 ? 6 : 12}`}>
                                <div className="form-control-wrap">
                                    <RSelect
                                        options={yearOptions}
                                        value={yearOptions?.find((item) => item.value === program.yearId)}
                                        onChange={(val) => {
                                            setProgram({ ...program, yearId: val?.value });
                                            setReloadData(true);
                                        }}
                                        placeholder="Pilih Tahun Pelajaran"
                                    />
                                </div>
                            </div>
                            {user?.role === 1 && (
                                <div className="form-group col-md-6">
                                    <div className="form-control-wrap">
                                        <RSelect
                                            options={institutionOptions}
                                            value={institutionOptions.find((item) => item.value === program.institutionId)}
                                            onChange={(val) => {
                                                setProgram({ ...program, institutionId: val?.value });
                                                setReloadData(true);
                                            }}
                                            placeholder="Pilih Lembaga"
                                        />
                                    </div>
                                </div>
                            )}
                            <ReactDataTable data={programs} columns={Column} pagination progressPending={reloadData} />
                        </Row>
                    </PreviewCard>
                    <Partial
                        modal={modal}
                        setModal={setModal}
                        data={program}
                        setData={setProgram}
                        setReloadData={setReloadData}
                        yearOptions={yearOptions}
                        institutionOptions={institutionOptions}
                    />
                </Block>
            </Content>
        </React.Fragment>
    )
}

export default Program;
