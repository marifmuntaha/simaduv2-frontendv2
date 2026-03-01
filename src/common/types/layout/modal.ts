export interface PartialModalProps<T> {
    modal: boolean;
    setModal: (modal: boolean) => void;
    data: T;
    setData: (data: T) => void;
    reloadData?: boolean;
    setReloadData: (reload: boolean) => void;
}