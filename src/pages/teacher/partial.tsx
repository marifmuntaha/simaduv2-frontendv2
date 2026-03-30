import React, {useEffect, useState} from "react";
import DatePicker, {registerLocale} from "react-datepicker";
import {useOutletContext} from "react-router";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {useForm} from "react-hook-form";
import moment from "moment/moment";

import {Icon, Row, RSelect, RToast} from "@/components";
import {store as storeActivity} from "@/common/api/teacher/activity";
import {store as storeTeacher, update as updateTeacher, destroy as destroyTeacher} from "@/common/api/teacher";
import {store as storeUser, update as updateUser, destroy as destroyUser} from "@/common/api/user";
import {OptionsType, PartialModalProps, TeacherType, UserType} from "@/common/types";
import {useAuthContext} from "@/common/hooks/useAuthContext";
import TeacherForm from "@/components/form/teacher";
import {useYearContext} from "@/common/hooks/useYearContext";



export interface TeacherFormType extends TeacherType {
    institutionSelected: OptionsType[]
    birthdateSelected: Date
}

interface PartialTeacherProps extends Omit<PartialModalProps<TeacherType>, 'modal' | 'setModal'> {
    modal: {
        partial: boolean;
        upload: boolean;
    };
    setModal: (modal: {
        partial: boolean;
        upload: boolean;
    }) => void;
}

const Partial = ({modal, setModal, data, setData, setReloadData} : PartialTeacherProps) => {
    const {user} = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [birthdateSelected, setBirthdateSelected] = useState(new Date());
    const [institutionSelected, setInstitutionSelected] = useState([]);
    const year = useYearContext();
    const genderOptions = [
        {value: 'L', label: 'Laki-laki'},
        {value: 'P', label: 'Perempuan'},
    ]
    const methods = useForm<TeacherFormType>()
    const {
        reset,
        handleSubmit,
        setValue
    } = methods;

    const onSubmit = (values: TeacherFormType) => {
        data.id === undefined ? onStore(values) : onUpdate(values);
    }
    const onStore = async (values: TeacherFormType) => {
        setLoading(true);
        try {
            const userData: UserType = {
                name: values.name,
                email: values.email,
                username: values.pegId,
                password: values.birthplace,
                password_confirmation: values.birthplace,
                role: 4,
                phone: values.phone,
            };
            const respUser = await storeUser(userData, false);
            if (respUser.status !== 'success') {
                throw new Error('Gagal menyimpan User');
            }
            const user = respUser.result;

            const teacherData: TeacherType = {
                userId: user.id,
                name: values.name,
                pegId: values.pegId,
                birthplace: values.birthplace,
                birthdate: moment(values.birthdateSelected).format('YYYY-MM-DD'),
                gender: values.gender,
                frontTitle: values.frontTitle,
                backTitle: values.backTitle,
                phone: values.phone,
                email: values.email,
                address: values.address,
                status: values.status,
            };

            const respTeacher = await storeTeacher(teacherData, false);
            if (respTeacher.status !== 'success') {
                await destroyUser(user?.id)
                throw new Error('Gagal menyimpan Data Guru');
            }
            const teacher = respTeacher.result;
            const promises = values.institutionSelected.map((institution) => {
                return storeActivity({
                    yearId: year?.id,
                    institutionId: institution.value,
                    teacherId: teacher.id,
                    statusCode: 5,
                    status: true
                });
            });

            await Promise.all(promises);

            RToast('Data guru berhasil ditambahkan.', 'success');
            setReloadData(true);
            toggle();

        } catch (error) {
            RToast('Terjadi kesalahan saat memproses data.', 'error');
        } finally {
            setLoading(false);
        }
    }
    const onUpdate = async () => {
        setLoading(true);
        await updateUser({
            id: teacher.userId,
            name: teacher.name,
            email: teacher.email,
            username: teacher.pegId,
            password: teacher.birthplace,
            phone: teacher.phone,
            role: '4'
        }, false).then(async (respUser) => {
            const update = await updateTeacher({
                id: teacher.id,
                userId: respUser.id,
                name: teacher.name,
                pegId: teacher.pegId,
                birthplace: teacher.birthplace,
                birthdate: moment(teacher.birthdate).format('YYYY-MM-DD'),
                gender: teacher.gender,
                frontTitle: teacher.frontTitle,
                backTitle: teacher.backTitle,
                phone: teacher.phone,
                email: teacher.email,
                address: teacher.address,
            });
            if (update !== false) {
                setLoading(false);
                setLoadData(true);
                toggle();
            } else {
                setLoading(false);
            }
        }).catch(() => setLoading(false));
    }
    const handleReset = () => {
        setTeacher({
            id: null,
            userId: null,
            institution: [],
            name: "",
            pageId: "",
            birthplace: "",
            birthdate: new Date(),
            gender: "",
            frontTitle: "",
            backTitle: "",
            phone: "",
            email: "",
            address: "",
        });
        setBirthdateSelected(new Date());
        setInstitutionSelected([]);
        reset();
    }
    const toggle = () => {
        setModal({
            partial: false,
            upload: false,
        });
        handleReset();
    };

    useEffect(() => {
        setValue('id', teacher?.id);
        setValue('userId', teacher?.userId);
        setValue('name', teacher?.name);
        setValue('pegId', teacher?.pegId);
        setValue('birthplace', teacher?.birthplace);
        setValue('birthdate', teacher?.birthdate);
        setValue('gender', teacher?.gender);
        setValue('frontTitle', teacher?.frontTitle ? teacher.frontTitle : '');
        setValue('backTitle', teacher?.backTitle ? teacher.backTitle : '');
        setValue('phone', teacher?.phone);
        setValue('email', teacher?.email);
        setValue('address', teacher?.address);
        teacher.institution !== undefined && setInstitutionSelected(() => {
            return teacher?.institution?.map((i) => {
                return institutionOptions.find((c) => c.value === i.id);
            });
        });
    }, [teacher, setValue, institutionOptions]);

    return (
        <Modal isOpen={modal.partial} toggle={toggle} size="md">
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross"/>
                </button>
            }>
                {teacher.id === null ? 'TAMBAH' : 'UBAH'}
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <TeacherForm methods={methods} />
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
