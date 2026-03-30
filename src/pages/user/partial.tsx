import React, {useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {useForm} from "react-hook-form";
import {Icon} from "@/components";
import {store as storeUser, update as updateUser} from "@/common/api/user";
import {OptionsType, PartialModalProps, UserType} from "@/common/types";
import UserForm from "@/components/form/user";

export interface UserFormInterface extends UserType {
    institutionSelected: OptionsType[]
}
const Partial = ({
                     modal,
                     setModal,
                     data,
                     setData,
                     setReloadData
} : PartialModalProps<UserType>) => {
    const [loading, setLoading] = useState(false);
    const methods = useForm<UserFormInterface>();
    const {reset, handleSubmit, setValue} = methods;

    const onSubmit = (values: UserFormInterface) => {
        const formData: UserType = {
            id: values.id,
            name: values.name,
            email: values.email,
            username: values.username,
            password: values.password,
            password_confirmation: values.password_confirmation,
            phone: values.phone,
            role: values.role,
            institution: values.institutionSelected.map((item) => {
                return {id: item.value}
            }),
        }
        data.id === undefined ? onStore(formData) : onUpdate(formData);
    }
    const onStore = async (formData: UserType) => {
        setLoading(true);
        const store = await storeUser(formData).then((resp) => resp);
        if (store.status === 'success') {
            setLoading(false);
            setReloadData(true);
            toggle();
        } else {
            setLoading(false);
        }
    }
    const onUpdate = async (formData: UserType) => {
        setLoading(true)
        const update = await updateUser(formData).then((resp) => resp);
        if (update) {
            setLoading(false);
            setReloadData(true);
            toggle();
        } else {
            setLoading(false);
        }
    }
    const handleReset = () => {
        setData({
            id: undefined,
            name: '',
            email: '',
            username: '',
            password: '',
            password_confirmation: '',
            phone: '',
            role: 0,
            institution: []
        });
        reset();
    }
    const toggle = () => {
        setModal(false);
        handleReset();
    };
    useEffect(() => {
        const institutionSelected: OptionsType[]|undefined = data.institution?.map((item): OptionsType => {
            return {value: item?.id ? item.id : 0, label: item.name ? item.name : ''}
        })
        setValue('id', data.id);
        setValue('name', data.name);
        setValue('email', data.email);
        setValue('username', data?.username);
        setValue('role', data.role);
        setValue('phone', data.phone);
        setValue('institutionSelected', institutionSelected !== undefined ? institutionSelected : [])
    }, [data, setValue]);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross"/>
                </button>
            }>
                {data.id === undefined ? 'TAMBAH' : 'UBAH'}
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <UserForm methods={methods}/>
                    <div className="form-group">
                        <Button color="primary" type="submit" size="md">
                            {loading ? <Spinner size="sm"/> : 'SIMPAN'}
                        </Button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    )
}

export default Partial;
