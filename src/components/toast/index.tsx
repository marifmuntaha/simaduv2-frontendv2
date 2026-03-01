import { toast, ToastOptions } from "react-toastify";

interface RToastProps {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info' | string;
}

export const RToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' | string = 'error') => {
    const config: ToastOptions = {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
    }

    switch (type) {
        case "success":
            toast.success(message, config);
            break;
        case "info":
            toast.info(message, config);
            break;
        case "warning":
            toast.warning(message, config);
            break;
        case "error":
            toast.error(message, config);
            break;
        default:
            toast.error(message, config);
    }
};
