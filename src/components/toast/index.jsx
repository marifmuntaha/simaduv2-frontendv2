import { toast } from "react-toastify";

const RToast = (message, type) => {
    const config = {
        position: "top-right",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: false,
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
        default:
            toast.error(message, config);
    }
};

export default RToast;