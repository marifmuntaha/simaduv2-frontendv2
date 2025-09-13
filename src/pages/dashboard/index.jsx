import React, {useState} from "react";
import Head from "@/layout/head";
import {Block, BlockBetween, BlockHead, BlockHeadContent, BlockTitle, Button, Col, Row} from "@/components";
import Content from "@/layout/content";
import {Icon} from "@/components/index.jsx";
import Notification from "@/pages/dashboard/Notification.jsx";

const Dashboard = () => {
    const [sm, updateSm] = useState(false)
    return (
        <React.Fragment>
            <Head title="Dashboard" />
            <Content>
                <BlockHead size="sm">
                    <BlockBetween>
                        <BlockHeadContent>
                            <BlockTitle page tag="h3">
                                Dashboard
                            </BlockTitle>
                        </BlockHeadContent>
                        <BlockHeadContent>
                            <div className="toggle-wrap nk-block-tools-toggle">
                                <Button
                                    className={`btn-icon btn-trigger toggle-expand me-n1 ${sm ? "active" : ""}`}
                                    onClick={() => updateSm(!sm)}
                                >
                                    <Icon name="more-v" />
                                </Button>
                                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                                    <ul className="nk-block-tools g-3">
                                        <li className="nk-block-tools-opt">
                                            <Button color="primary">
                                                <Icon name="reports" />
                                                <span>Reports</span>
                                            </Button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </BlockHeadContent>
                    </BlockBetween>
                </BlockHead>
                <Block>
                    <Row className="g-gs">
                        <Col xxl="6">
                            <Notification />
                        </Col>
                    </Row>
                </Block>
            </Content>
        </React.Fragment>
    )
}

export default Dashboard;