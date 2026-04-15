import { Button, ButtonGroup, Spinner, UncontrolledTooltip } from "reactstrap";
import { Icon } from "@/components";
import React from "react";


type ButtonActionType = {
    show: boolean;
    edit: boolean;
    destroy: boolean
}
interface ButtonActionProps<T extends { id?: number }> {
    types: ButtonActionType;
    data: T;
    setData: (row: T) => void;
    setModal: (modal: boolean) => void;
    loading: boolean | number | undefined;
    setLoading: (loading: boolean) => void;
    destroyData: (id: number | undefined) => Promise<unknown>;
    setReloadData: (reloadData: boolean) => void;
}

const ButtonAction = <T extends { id?: number }>({
    types,
    data,
    setData,
    setModal,
    loading,
    setLoading,
    destroyData,
    setReloadData
}: ButtonActionProps<T>) => {
    const editId = `edit-${data?.id}`;
    const destroyId = `destroy-${data?.id}`;

    return (
        <ButtonGroup size="sm">
            {types.edit && (
                <React.Fragment>
                    <Button outline color="warning" id={editId} onClick={() => {
                        setData(data);
                        setModal(true);
                    }}><Icon name="pen" /></Button>
                    <UncontrolledTooltip placement="top" target={editId}>
                        Ubah Data
                    </UncontrolledTooltip>
                </React.Fragment>
            )}
            {types.destroy && (
                <React.Fragment>
                    <Button outline color="danger" id={destroyId} onClick={() => {
                        setLoading(data?.id as unknown as boolean)
                        destroyData(data?.id).then(() => {
                            setLoading(false);
                            setReloadData(true);
                        }).catch(() => setLoading(false))
                    }}>
                        {loading === data?.id ? <Spinner size="sm" /> : <Icon name="trash" />}
                    </Button>
                    <UncontrolledTooltip placement="top" target={destroyId}>
                        Hapus Data
                    </UncontrolledTooltip>
                </React.Fragment>
            )}
        </ButtonGroup>
    )
}

export default ButtonAction