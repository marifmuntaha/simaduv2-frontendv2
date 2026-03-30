import {ReactNode, useEffect, useState} from "react";
import {YearType} from "@/common/types";
import {Loading} from "@/components";
import {YearContext} from "@/common/hooks/useYearContext";
import {getYear} from "@/common/api/public";

export const YearProvider = ({children}: {children?: ReactNode}) => {
    const [loading, setLoading] = useState(true)
    const [year, setYear] = useState<YearType>()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                await getYear({active: true}).then((resp) => setYear(resp[0]))
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, []);

    if (loading) return <Loading />;

    return (
        <YearContext.Provider value={year}>
            {children}
        </YearContext.Provider>
    )
}