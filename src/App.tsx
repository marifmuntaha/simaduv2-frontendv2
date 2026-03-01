import Router from "./route";
import {AuthProvider} from "@/layout/provider/auth";
import {YearProvider} from "@/layout/provider/year";
const App = () => {
    return (
        <YearProvider>
            <AuthProvider>
                <Router />
            </AuthProvider>
        </YearProvider>
    )
};
export default App;