import React, {useState} from "react";
import Head from "@/layout/head/index.jsx";
import Content from "@/layout/content/index.jsx";
import {
    Block,
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle, Col,
    Icon,
    PreviewCard,
    Row
} from "@/components/index.jsx";
import {Button} from "reactstrap";

const Neraca = () => {
    const [sm, updateSm] = useState(false);
    const [modal, setModal] = useState(false);
    return (
        <React.Fragment>
            <Head title="Neraca" />
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h4">Item Tagihan</BlockTitle>
                                <p>
                                    Just import <code>ReactDataTable</code> from <code>components</code>, it is built in
                                    for react dashlite.
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
                            <Col size="6">
                                <table className="table table-bordered">
                                    <tbody>
                                    <tr>
                                        <td colSpan={3}>AKTIVA</td>
                                    </tr>
                                    <tr>
                                        <td>101</td>
                                        <td colSpan={2}>AKTIVA LANCAR</td>
                                    </tr>
                                    <tr>
                                        <td>10101</td>
                                        <td>Kas</td>
                                        <td>166.563.500</td>
                                    </tr>
                                    <tr>
                                        <td>1010101</td>
                                        <td>Kas Teller</td>
                                        <td>166.041.000</td>
                                    </tr>
                                    <tr>
                                        <td>10102</td>
                                        <td>Bank</td>
                                        <td>989.156.113</td>
                                    </tr>
                                    <tr>
                                        <td>1010204</td>
                                        <td>KSP PELOPOR ( UANG BANGKU )</td>
                                        <td>-373.450.000</td>
                                    </tr>
                                    <tr>
                                        <td>1010205</td>
                                        <td>KSP PELOPOR ( SPP )</td>
                                        <td>45.610.000</td>
                                    </tr>
                                    <tr>
                                        <td>1010211</td>
                                        <td>KSP PELOPOR ( LKS GASAL )</td>
                                        <td>-32.583.000</td>
                                    </tr>
                                    <tr>
                                        <td>1010218</td>
                                        <td>KSP PELOPOR ( SUBSIDI TAHFIDZ )</td>
                                        <td>-491.224.000</td>
                                    </tr>
                                    <tr>
                                        <td>1010219</td>
                                        <td>KSP PELOPOR (LKS GENAP)</td>
                                        <td>-87.713.000</td>
                                    </tr>
                                    <tr>
                                        <td>102</td>
                                        <td colSpan={2}>AKTIVA TETAP</td>
                                    </tr>
                                    <tr>
                                        <td>10202</td>
                                        <td>Inventaris MTs</td>
                                        <td>142.278.500</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                        <Row className="gy-0">
                            <Col size="6">
                                <table className="table table-bordered">
                                    <tbody>
                                    <tr>
                                        <td>2</td>
                                        <td colSpan={2}>AKTIVA LANCAR</td>
                                    </tr>
                                    <tr>
                                        <td>2010504</td>
                                        <td>Almari Ponpes</td>
                                        <td>166.563.500</td>
                                    </tr>
                                    <tr>
                                        <td>1010101</td>
                                        <td>Kas Teller</td>
                                        <td>166.041.000</td>
                                    </tr>
                                    <tr>
                                        <td>10102</td>
                                        <td>Bank</td>
                                        <td>989.156.113</td>
                                    </tr>
                                    <tr>
                                        <td>1010204</td>
                                        <td>KSP PELOPOR ( UANG BANGKU )</td>
                                        <td>-373.450.000</td>
                                    </tr>
                                    <tr>
                                        <td>1010205</td>
                                        <td>KSP PELOPOR ( SPP )</td>
                                        <td>45.610.000</td>
                                    </tr>
                                    <tr>
                                        <td>1010211</td>
                                        <td>KSP PELOPOR ( LKS GASAL )</td>
                                        <td>-32.583.000</td>
                                    </tr>
                                    <tr>
                                        <td>1010218</td>
                                        <td>KSP PELOPOR ( SUBSIDI TAHFIDZ )</td>
                                        <td>-491.224.000</td>
                                    </tr>
                                    <tr>
                                        <td>1010219</td>
                                        <td>KSP PELOPOR (LKS GENAP)</td>
                                        <td>-87.713.000</td>
                                    </tr>
                                    <tr>
                                        <td>102</td>
                                        <td colSpan={2}>AKTIVA TETAP</td>
                                    </tr>
                                    <tr>
                                        <td>10202</td>
                                        <td>Inventaris MTs</td>
                                        <td>142.278.500</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                    </PreviewCard>
                </Block>
            </Content>
        </React.Fragment>
    )
}

export default Neraca;