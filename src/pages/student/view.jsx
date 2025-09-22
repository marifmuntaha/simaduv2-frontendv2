import React, {useEffect, useState} from "react";
import moment from "moment/moment";
import "moment/locale/id"
import {useNavigate, useParams} from "react-router-dom";
import {Badge, Button, Card} from "reactstrap";
import Head from "@/layout/head";
import Content from "@/layout/content";
import {
    Block,
    BlockBetween,
    BlockDes,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Icon,
    Sidebar,
    UserAvatar
} from "@/components";
import {findUpper, role} from "@/utils";
import {show as showStudent} from "@/api/student";
import {get as getActivity} from "@/api/student/activity";

const View = () => {
    const {id} = useParams();
    const [student, setStudent] = useState([]);
    const [sideBar, setSideBar] = useState(true);
    const [tab, setTab] = useState(1)
    const [province, setProvince] = useState({});
    const [city, setCity] = useState({});
    const [district, setDistrict] = useState({});
    const [village, setVillage] = useState({});
    const [activities, setActivities] = useState([]);
    const navigate = useNavigate();
    const parentStatus = (e) => {
        switch (e) {
            case "1":
                return "Masih Hidup"
            case "2":
                return "Meninggal"
            default:
                return "Tidak diketahui"
        }
    }
    const studentStatus = (e) => {
        switch (e) {
            case "1":
                return "Aktif"
            case "2":
                return "Keluar"
            case "4":
                return "Pindah Kelas"
            default:
                return "Alumni"
        }
    }
    const boardingStatus = (e) => {
        switch (e) {
            case '1':
                return "Non Boarding"
            case '2':
                return "Tahfidz"
            case '3':
                return "Kitab"
            default:
                return ""
        }
    }
    const toggle = () => {
        setSideBar(!sideBar);
    }

    useEffect(() => {
        showStudent(id).then((resp) => {
            setStudent(resp);
            resp.address.provinceId && fetch(`https://marifmuntaha.github.io/api-wilayah-indonesia/api/province/${resp.address.provinceId}.json`)
                .then(response => response.json())
                .then((resp) => {
                    setProvince(resp);
                });
            resp.address.cityId && fetch(`https://marifmuntaha.github.io/api-wilayah-indonesia/api/regency/${resp.address.cityId}.json`)
                .then(response => response.json())
                .then((resp) => {
                    setCity(resp);
                });
            resp.address.districtId && fetch(`https://marifmuntaha.github.io/api-wilayah-indonesia/api/district/${resp.address.districtId}.json`)
                .then(response => response.json())
                .then((resp) => {
                    setDistrict(resp);
                });
            resp.address.villageId && fetch(`https://marifmuntaha.github.io/api-wilayah-indonesia/api/village/${resp.address.villageId}.json`)
                .then(response => response.json())
                .then((resp) => {
                    setVillage(resp);
                });
            getActivity({studentId: resp.id}).then((resp) => setActivities(resp));
        });
    }, [id]);

    return (
        <React.Fragment>
            <Head title={`Data Siswa - ${student.name}`} />
            <Content>
                <BlockHead size="sm">
                    <BlockBetween>
                        <BlockHeadContent>
                            <BlockTitle tag="h3" page>
                                Siswa / <strong className="text-primary small">{student.name}</strong>
                            </BlockTitle>
                            <BlockDes className="text-soft">
                                <ul className="list-inline">
                                    <li>
                                        Nama Pengguna: <span className="text-base">{student?.user?.username}</span>
                                    </li>
                                    <li>
                                        NISN: <span className="text-base">{student.nisn}</span>
                                    </li>
                                    <li>
                                        NISM: <span className="text-base">{student.nism}</span>
                                    </li>
                                </ul>
                            </BlockDes>
                        </BlockHeadContent>
                        <BlockHeadContent>
                            <Button
                                color="light"
                                outline
                                className="bg-white d-none d-sm-inline-flex"
                                onClick={() => navigate(-1)}
                            >
                                <Icon name="arrow-left"></Icon>
                                <span>Kembali</span>
                            </Button>
                            <a
                                href={"#back"}
                                onClick={(ev) => {
                                    ev.preventDefault();
                                    navigate(-1);
                                }}
                                className="btn btn-icon btn-outline-light bg-white d-inline-flex d-sm-none"
                            >
                                <Icon name="arrow-left"></Icon>
                            </a>
                        </BlockHeadContent>
                    </BlockBetween>
                </BlockHead>
                <Block>
                    <Card>
                        <div className="card-aside-wrap" id="user-detail-block">
                            <div className="card-content">
                                <ul className="nav nav-tabs nav-tabs-mb-icon nav-tabs-card">
                                    <li className="nav-item">
                                        <a
                                            className={`nav-link ${tab === 1 && "active"}`}
                                            href={"#personal"}
                                            onClick={() => setTab(1)}
                                        >
                                            <Icon name="user-circle"></Icon>
                                            <span>Informasi Pribadi</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a
                                            className={`nav-link ${tab === 2 && "active"}`}
                                            href={"#parent"}
                                            onClick={() => setTab(2)}
                                        >
                                            <Icon name="repeat"></Icon>
                                            <span>Informasi Orangtua</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a
                                            className={`nav-link ${tab === 3 && "active"}`}
                                            href={"#parent"}
                                            onClick={() => setTab(3)}
                                        >
                                            <Icon name="file-text"></Icon>
                                            <span>Informasi Tempat Tinggal</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a
                                            className={`nav-link ${tab === 4 && "active"}`}
                                            href={"#parent"}
                                            onClick={() => setTab(4)}
                                        >
                                            <Icon name="activity"></Icon>
                                            <span>Aktifitas</span>
                                        </a>
                                    </li>
                                    <li className="nav-item nav-item-trigger d-xxl-none">
                                        <Button className={`toggle btn-icon btn-trigger ${sideBar && "active"}`} onClick={toggle}>
                                            <Icon name="user-list-fill"></Icon>
                                        </Button>
                                    </li>
                                </ul>
                                {tab === 1 && (
                                    <div className="card-inner">
                                        <Block>
                                            <BlockHead>
                                                <BlockTitle tag="h5">Informasi Pribadi</BlockTitle>
                                                <p>Basic info, like your name and address, that you use on Nio Platform.</p>
                                            </BlockHead>
                                            <div className="profile-ud-list">
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Nama Lengkap</span>
                                                        <span className="profile-ud-value">{student.name}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">NIK</span>
                                                        <span className="profile-ud-value">{student.nik}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">NISN</span>
                                                        <span className="profile-ud-value">{student.nisn}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">NISM</span>
                                                        <span className="profile-ud-value">{student.nism}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Jenis Kelamin</span>
                                                        <span className="profile-ud-value">{student.gender === "L" ? 'Laki-laki' : 'Perempuan'}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Agama</span>
                                                        <span className="profile-ud-value">-</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Tempat Lahir</span>
                                                        <span className="profile-ud-value">{student.birthplace}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Tanggal Lahir</span>
                                                        <span className="profile-ud-value">{moment(student.birthdate).locale('id').format("DD MMMM YYYY")}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Block>
                                        <Block>
                                            <BlockHead className="nk-block-head-line">
                                                <BlockTitle tag="h6" className="overline-title text-base">
                                                    Informasi Tambahan
                                                </BlockTitle>
                                            </BlockHead>
                                            <div className="profile-ud-list">
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Nama Pengguna</span>
                                                        <span className="profile-ud-value">{student.user?.username}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Hak Akses</span>
                                                        <span className="profile-ud-value">{role(student.user?.role)}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Nomor HP</span>
                                                        <span className="profile-ud-value">{student.user?.phone}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Alamat Email</span>
                                                        <span className="profile-ud-value">{student.user?.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Block>
                                    </div>
                                )}
                                {tab === 2 && (
                                    <div className="card-inner">
                                        <Block>
                                            <BlockHead>
                                                <BlockTitle tag="h5">Informasi Orangtua</BlockTitle>
                                                <p>Basic info, like your name and address, that you use on Nio Platform.</p>
                                            </BlockHead>
                                            <div className="profile-ud-list">
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Nomor KK</span>
                                                        <span className="profile-ud-value">{student.parent.numberKk}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Kepala Keluarga</span>
                                                        <span className="profile-ud-value">{student.parent.headFamily}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Block>
                                        <Block>
                                            <BlockHead className="nk-block-head-line">
                                                <BlockTitle tag="h6" className="overline-title text-base">
                                                    Orangtua
                                                </BlockTitle>
                                            </BlockHead>
                                            <div className="profile-ud-list">
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Status Ayah</span>
                                                        <span className="profile-ud-value">{parentStatus(student.parent?.fatherStatus)}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Status Ibu</span>
                                                        <span className="profile-ud-value">{parentStatus(student.parent?.motherStatus)}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Nama Ayah</span>
                                                        <span className="profile-ud-value">{student.parent?.fatherName}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Nama Ibu</span>
                                                        <span className="profile-ud-value">{student.parent?.motherName}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">NIK Ayah</span>
                                                        <span className="profile-ud-value">{student.parent?.fatherNIK}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">NIK Ibu</span>
                                                        <span className="profile-ud-value">{student.parent?.motherNIK}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Tempat Lahir Ayah</span>
                                                        <span className="profile-ud-value">{student.parent?.fatherBirthplace}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Tempat Lahir Ibu</span>
                                                        <span className="profile-ud-value">{student.parent?.motherBirthplace}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Tanggal Lahir Ayah</span>
                                                        <span className="profile-ud-value">{moment(student.parent?.fatherBirthdate).locale('id').format("DD MMMM YYYY")}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Tanggal Lahir Ibu</span>
                                                        <span className="profile-ud-value">{moment(student.parent?.motherBirthdate).locale('id').format("DD MMMM YYYY")}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Nomor HP Ayah</span>
                                                        <span className="profile-ud-value">{student.parent?.fatherPhone}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Nomor HP Ibu</span>
                                                        <span className="profile-ud-value">{student.parent?.motherPhone}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Block>
                                        <Block>
                                            <BlockHead className="nk-block-head-line">
                                                <BlockTitle tag="h6" className="overline-title text-base">
                                                    Wali Siswa
                                                </BlockTitle>
                                            </BlockHead>
                                            <div className="profile-ud-list">
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Nama Wali</span>
                                                        <span className="profile-ud-value">{student.parent?.guardName}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">NIK Wali</span>
                                                        <span className="profile-ud-value">{student.parent?.guardNIK}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Tempat Lahir Wali</span>
                                                        <span className="profile-ud-value">{student.parent?.guardBirthplace}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Tanggal Lahir Wali</span>
                                                        <span className="profile-ud-value">{moment(student.parent?.guardBirthdate).locale('id').format("DD MMMM YYYY")}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">EmailWali</span>
                                                        <span className="profile-ud-value">{student.parent?.guardEmail}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Nomor HP Wali</span>
                                                        <span className="profile-ud-value">{student.parent?.guardPhone}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Block>
                                    </div>
                                )}
                                {tab === 3 && (
                                    <div className="card-inner">
                                        <Block>
                                            <BlockHead>
                                                <BlockTitle tag="h5">Informasi Tempat Tinggal</BlockTitle>
                                                <p>Basic info, like your name and address, that you use on Nio Platform.</p>
                                            </BlockHead>
                                            <div className="profile-ud-list">
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Provinsi</span>
                                                        <span className="profile-ud-value">{province?.name}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Kabupaten/Kota</span>
                                                        <span className="profile-ud-value">{city?.name}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Kecamatan</span>
                                                        <span className="profile-ud-value">{district?.name}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Kelurahan/Desa</span>
                                                        <span className="profile-ud-value">{village?.name}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Alamat</span>
                                                        <span className="profile-ud-value">{student?.address?.address}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Block>
                                    </div>
                                )}
                                {tab === 4 && (
                                    <div className="card-inner">
                                        <Block>
                                            <BlockHead>
                                                <BlockTitle tag="h5">Informasi Aktifitas</BlockTitle>
                                                <p>Basic info, like your name and address, that you use on Nio Platform.</p>
                                            </BlockHead>
                                            <div className="profile-ud-list">
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Lembaga</span>
                                                        <span className="profile-ud-value">
                                                            {student?.activity?.institution?.ladder?.alias +". "+ student?.activity?.institution?.name}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Status</span>
                                                        <span className="profile-ud-value">{studentStatus(student?.activity?.status)}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Tingkat</span>
                                                        <span className="profile-ud-value">{student?.activity?.rombel?.level?.name}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Rombel</span>
                                                        <span className="profile-ud-value">{student?.activity?.rombel?.alias}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Program</span>
                                                        <span className="profile-ud-value">{student?.activity?.program?.name}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Boarding</span>
                                                        <span className="profile-ud-value">{boardingStatus(student?.activity?.boardingId)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Block>
                                        <Block>
                                            <BlockHead className="nk-block-head-line">
                                                <BlockTitle tag="h6" className="overline-title text-base">
                                                    Riwayat Aktifitas Siswa
                                                </BlockTitle>
                                            </BlockHead>
                                            <table className="table table-bordered">
                                                <thead>
                                                <tr>
                                                    <th scope="col">Tanggal</th>
                                                    <th scope="col">Lembaga</th>
                                                    <th scope="col">Status</th>
                                                    <th scope="col">Tingkat</th>
                                                    <th scope="col">Jurusan</th>
                                                    <th scope="col">Rombel</th>
                                                    <th scope="col">Program</th>
                                                    <th scope="col">Boarding</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {activities.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td>{moment(item.created_at).format('D/MM/yyyy')}</td>
                                                        <td>{item.institution.ladder.alias +". "+ item.institution.name}</td>
                                                        <td>{studentStatus(item.status)}</td>
                                                        <td>{item?.rombel?.level?.name}</td>
                                                        <td>{item?.rombel?.major?.alias}</td>
                                                        <td>{item?.rombel?.alias}</td>
                                                        <td>{item?.program?.name}</td>
                                                        <td>{boardingStatus(item.boardingId)}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </Block>
                                    </div>
                                )}
                            </div>
                            <Sidebar toggleState={sideBar}>
                                <div className="card-inner">
                                    <div className="user-card user-card-s2 mt-5 mt-xxl-0">
                                        <UserAvatar className="lg" theme="primary" text={findUpper((String(student.name)))} />
                                        <div className="user-info">
                                            <Badge color="outline-light" pill className="ucap">{role(student?.user?.role)}</Badge>
                                            <h5>{student.name}</h5>
                                            <span className="sub-text">{student.email}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-inner card-inner-sm">
                                    <ul className="btn-toolbar justify-center gx-1">
                                        <li>
                                            <Button href="#tool" onClick={(ev) => {
                                                ev.preventDefault();
                                            }}
                                                    className="btn-trigger btn-icon"
                                            >
                                                <Icon name="shield-off"></Icon>
                                            </Button>
                                        </li>
                                        <li>
                                            <Button
                                                href="#mail"
                                                onClick={(ev) => {
                                                    ev.preventDefault();
                                                }}
                                                className="btn-trigger btn-icon"
                                            >
                                                <Icon name="mail"></Icon>
                                            </Button>
                                        </li>
                                        <li>
                                            <Button
                                                href="#download"
                                                onClick={(ev) => {
                                                    ev.preventDefault();
                                                }}
                                                className="btn-trigger btn-icon"
                                            >
                                                <Icon name="download-cloud"></Icon>
                                            </Button>
                                        </li>
                                        <li>
                                            <Button
                                                href="#bookmark"
                                                onClick={(ev) => {
                                                    ev.preventDefault();
                                                }}
                                                className="btn-trigger btn-icon"
                                            >
                                                <Icon name="bookmark"></Icon>
                                            </Button>
                                        </li>
                                        <li>
                                            <Button
                                                href="#cancel"
                                                onClick={(ev) => {
                                                    ev.preventDefault();
                                                }}
                                                className="btn-trigger btn-icon text-danger"
                                            >
                                                <Icon name="na"></Icon>
                                            </Button>
                                        </li>
                                    </ul>
                                </div>
                                <div className="card-inner">
                                    <div className="overline-title-alt mb-2">In Account</div>
                                    <div className="profile-balance">
                                        <div className="profile-balance-group gx-4">
                                            <div className="profile-balance-sub">
                                                <div className="profile-balance-amount">
                                                    <div className="number">
                                                        2,500.00 <small className="currency currency-usd">USD</small>
                                                    </div>
                                                </div>
                                                <div className="profile-balance-subtitle">Invested Amount</div>
                                            </div>
                                            <div className="profile-balance-sub">
                          <span className="profile-balance-plus text-soft">
                            <Icon className="ni-plus"></Icon>
                          </span>
                                                <div className="profile-balance-amount">
                                                    <div className="number">1,643.76</div>
                                                </div>
                                                <div className="profile-balance-subtitle">Profit Earned</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/*        <div className="card-inner">*/}
                                {/*            <Row className="text-center">*/}
                                {/*                <Col size="4">*/}
                                {/*                    <div className="profile-stats">*/}
                                {/*                        <span className="amount">{user.tasks}</span>*/}
                                {/*                        <span className="sub-text">Total Order</span>*/}
                                {/*                    </div>*/}
                                {/*                </Col>*/}
                                {/*                <Col size="4">*/}
                                {/*                    <div className="profile-stats">*/}
                                {/*                        <span className="amount">{user.projects}</span>*/}
                                {/*                        <span className="sub-text">Complete</span>*/}
                                {/*                    </div>*/}
                                {/*                </Col>*/}
                                {/*                <Col size="4">*/}
                                {/*                    <div className="profile-stats">*/}
                                {/*                        <span className="amount">{user.performed}</span>*/}
                                {/*                        <span className="sub-text">Progress</span>*/}
                                {/*                    </div>*/}
                                {/*                </Col>*/}
                                {/*            </Row>*/}
                                {/*        </div>*/}
                                {/*        <div className="card-inner">*/}
                                {/*            <h6 className="overline-title-alt mb-2">Additional</h6>*/}
                                {/*            <Row className="g-3">*/}
                                {/*                <Col size="6">*/}
                                {/*                    <span className="sub-text">User ID:</span>*/}
                                {/*                    <span>UD003054</span>*/}
                                {/*                </Col>*/}
                                {/*                <Col size="6">*/}
                                {/*                    <span className="sub-text">Last Login:</span>*/}
                                {/*                    <span>{user.lastLogin} 01:02 PM</span>*/}
                                {/*                </Col>*/}
                                {/*                <Col size="6">*/}
                                {/*                    <span className="sub-text">KYC Status:</span>*/}
                                {/*                    <span*/}
                                {/*                        className={`lead-text text-${*/}
                                {/*                            user.kycStatus === "success"*/}
                                {/*                                ? "success"*/}
                                {/*                                : user.kycStatus === "pending"*/}
                                {/*                                    ? "info"*/}
                                {/*                                    : user.kycStatus === "warning"*/}
                                {/*                                        ? "warning"*/}
                                {/*                                        : "secondary"*/}
                                {/*                        }`}*/}
                                {/*                    >*/}
                                {/*  {user.kycStatus?.toUpperCase()}*/}
                                {/*</span>*/}
                                {/*                </Col>*/}
                                {/*                <Col size="6">*/}
                                {/*                    <span className="sub-text">Register At:</span>*/}
                                {/*                    <span>Nov 24, 2019</span>*/}
                                {/*                </Col>*/}
                                {/*            </Row>*/}
                                {/*        </div>*/}
                                {/*        <div className="card-inner">*/}
                                {/*            <OverlineTitle tag="h6" className="mb-3">*/}
                                {/*                Groups*/}
                                {/*            </OverlineTitle>*/}
                                {/*            <ul className="g-1">*/}
                                {/*                <li className="btn-group">*/}
                                {/*                    <Button*/}
                                {/*                        color="light"*/}
                                {/*                        size="xs"*/}
                                {/*                        className="btn-dim"*/}
                                {/*                        onClick={(ev) => {*/}
                                {/*                            ev.preventDefault();*/}
                                {/*                        }}*/}
                                {/*                    >*/}
                                {/*                        investor*/}
                                {/*                    </Button>*/}
                                {/*                    <Button*/}
                                {/*                        color="light"*/}
                                {/*                        size="xs"*/}
                                {/*                        className="btn-icon btn-dim"*/}
                                {/*                        onClick={(ev) => {*/}
                                {/*                            ev.preventDefault();*/}
                                {/*                        }}*/}
                                {/*                    >*/}
                                {/*                        <Icon className="ni-cross"></Icon>*/}
                                {/*                    </Button>*/}
                                {/*                </li>*/}
                                {/*                <li className="btn-group">*/}
                                {/*                    <Button*/}
                                {/*                        color="light"*/}
                                {/*                        size="xs"*/}
                                {/*                        className="btn-dim"*/}
                                {/*                        onClick={(ev) => {*/}
                                {/*                            ev.preventDefault();*/}
                                {/*                        }}*/}
                                {/*                    >*/}
                                {/*                        support*/}
                                {/*                    </Button>*/}
                                {/*                    <Button*/}
                                {/*                        color="light"*/}
                                {/*                        size="xs"*/}
                                {/*                        className="btn-icon btn-dim"*/}
                                {/*                        onClick={(ev) => {*/}
                                {/*                            ev.preventDefault();*/}
                                {/*                        }}*/}
                                {/*                    >*/}
                                {/*                        <Icon className="ni-cross"></Icon>*/}
                                {/*                    </Button>*/}
                                {/*                </li>*/}
                                {/*                <li className="btn-group">*/}
                                {/*                    <Button*/}
                                {/*                        color="light"*/}
                                {/*                        size="xs"*/}
                                {/*                        className="btn-dim"*/}
                                {/*                        onClick={(ev) => {*/}
                                {/*                            ev.preventDefault();*/}
                                {/*                        }}*/}
                                {/*                    >*/}
                                {/*                        another tag*/}
                                {/*                    </Button>*/}
                                {/*                    <Button*/}
                                {/*                        color="light"*/}
                                {/*                        size="xs"*/}
                                {/*                        className="btn-icon btn-dim"*/}
                                {/*                        onClick={(ev) => {*/}
                                {/*                            ev.preventDefault();*/}
                                {/*                        }}*/}
                                {/*                    >*/}
                                {/*                        <Icon className="ni-cross"></Icon>*/}
                                {/*                    </Button>*/}
                                {/*                </li>*/}
                                {/*            </ul>*/}
                                {/*        </div>*/}
                            </Sidebar>
                            {/*{sideBar && <div className="toggle-overlay" onClick={() => toggle()}></div>}*/}
                        </div>
                    </Card>
                </Block>
            </Content>
        </React.Fragment>
    )
}

export default View
