import React, {useEffect, useState} from "react";
import {Card} from "reactstrap";
import {DataTableHead, DataTableRow, DataTableItem} from "@/components";
import {get as getNotification} from "@/api/notification";
import moment from "moment/moment";

const Notification = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        getNotification().then((resp) => {
            setNotifications(resp)
        })
    }, [])
    return (
        <Card className="card-full">
            <div className="card-inner">
                <div className="card-title-group">
                    <div className="card-title">
                        <h6 className="title">Aktifitas</h6>
                    </div>
                </div>
            </div>
            <div className="nk-tb-list mt-n2">
                <DataTableHead>
                    <DataTableRow>
                        <span>Tanggal</span>
                    </DataTableRow>
                    <DataTableRow size="sm">
                        <span>Aktifitas</span>
                    </DataTableRow>
                </DataTableHead>
                {notifications?.map((item, idx) => (
                    <DataTableItem key={idx}>
                        <DataTableRow size="md">
                            <span className="tb-sub">{moment(item.updated_at).format('D/MM/yyyy HH:mm:ss')}</span>
                        </DataTableRow>
                        <DataTableRow>
                            <span className="tb-sub">{item.data.message}</span>
                        </DataTableRow>
                    </DataTableItem>
                ))}
            </div>
        </Card>
    )
}

export default Notification;
