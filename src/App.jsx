import Router from "./route";
import {GoogleReCaptchaProvider} from "react-google-recaptcha-v3";

const App = () => {
    return (
        <GoogleReCaptchaProvider reCaptchaKey="6LdRcLgrAAAAAMi5nlelWwrH-c8ShS3viUdomc9i">
            <Router />
        </GoogleReCaptchaProvider>
    );
};
export default App;