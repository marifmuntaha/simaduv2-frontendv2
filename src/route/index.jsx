import React, {useEffect} from "react";
import {ToastContainer} from "react-toastify";
import {Routes, Route, useLocation, BrowserRouter} from "react-router-dom";
import ThemeProvider from "@/layout/provider";
import {NoSidebar, WithSidebar} from "@/layout";
import PrivateRoute from "@/route/PrivateRoute";
import Dashboard from "@/pages/dashboard";
import ForgotPassword from "@/pages/auth/forget-password";
import Login from "@/pages/auth/login";
import Error404 from "@/pages/error/Error404";
import Error504 from "@/pages/error/Error504";
import Ladder from "@/pages/master/ladder";
import Logout from "@/pages/auth/Logout";
import ResetPassword from "@/pages/auth/reset-password";
import Level from "@/pages/master/level";
import Major from "@/pages/master/major";
import Year from "@/pages/master/year";
import Institution from "@/pages/institution";
import Program from "@/pages/institution/program";
import Rombel from "@/pages/institution/rombel";
import Teacher from "@/pages/teacher";
import {List as ListStudent, Add as AddStudent, Edit as EditStudent, View as ViewStudent} from "@/pages/student"
import MoveRombel from "@/pages/student/academic/moveRombel";
import MutationOut from "@/pages/student/mutation/out/index.jsx";
import Account from "@/pages/finance/account/index.jsx";
import Item from "@/pages/finance/item/index.jsx";
import Transaction from "@/pages/finance/transaction/index.jsx";
import Neraca from "@/pages/finance/report/neraca/index.jsx";
import Invoice from "@/pages/finance/invoice/index.jsx";
import Setting from "@/pages/setting/index.jsx";

const ScrollToTop = (props) => {
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return <>{props.children}</>
};

const Router = () => {
    return (
        <BrowserRouter future={{v7_startTransition: true, v7_relativeSplatPath: true,}}>
            <ScrollToTop>
                <Routes>
                    <Route element={<ThemeProvider/>}>
                        <Route element={<PrivateRoute/>}>
                            <Route element={<WithSidebar/>}>
                                <Route index element={<Dashboard/>}/>
                                <Route path="master-data">
                                    <Route path="jenjang" element={<Ladder/>}/>
                                    <Route path="tingkat" element={<Level/>}/>
                                    <Route path="jurusan" element={<Major/>}/>
                                    <Route path="tahun-pelajaran" element={<Year/>}/>
                                </Route>
                                <Route path="data-lembaga" >
                                    <Route index element={<Institution/>}/>
                                    <Route path="program" element={<Program/>}/>
                                    <Route path="rombongan-belajar" element={<Rombel/>}/>
                                </Route>
                                <Route path="data-siswa">
                                    <Route index element={<ListStudent/>}/>
                                    <Route path="tambah" element={<AddStudent/>}/>
                                    <Route path=":id/ubah" element={<EditStudent/>}/>
                                    <Route path=":id/lihat" element={<ViewStudent/>}/>
                                    <Route path="mutasi">
                                        <Route path="keluar" element={<MutationOut/>}/>
                                    </Route>
                                    <Route path="akademik">
                                        <Route path="pindah-kelas" element={<MoveRombel/>} />
                                    </Route>
                                </Route>
                                <Route path="keuangan">
                                    <Route path="data-rekening" element={<Account/>}/>
                                    <Route path="item-pembayaran" element={<Item/>}/>
                                    <Route path="transaksi" element={<Transaction/>}/>
                                    <Route path="tagihan" element={<Invoice/>}/>
                                    <Route path="laporan">
                                        <Route path="neraca" element={<Neraca/>}/>
                                    </Route>
                                </Route>
                                <Route path="data-guru" element={<Teacher/>}/>
                                <Route path="pengaturan/:institutionId" element={<Setting/>}/>
                            </Route>
                        </Route>
                        <Route element={<NoSidebar/>}>
                            <Route path="auth">
                                <Route path="keluar" element={<Logout/>}/>
                                <Route path="lupa-sandi" element={<ForgotPassword/>}/>
                                <Route path="reset-sandi/:token" element={<ResetPassword/>}/>
                                <Route path="masuk" element={<Login/>}></Route>
                            </Route>
                            <Route path="errors">
                                <Route path="404" element={<Error404/>}></Route>
                                <Route path="504" element={<Error504/>}></Route>
                            </Route>
                            <Route path="*" element={<Error404/>}></Route>
                        </Route>
                    </Route>
                </Routes>
            </ScrollToTop>
            <ToastContainer />
        </BrowserRouter>
    )
}

export default Router;
