import { toast } from "react-toastify";

const RToast = (message, type) => {
    const config = {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
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
