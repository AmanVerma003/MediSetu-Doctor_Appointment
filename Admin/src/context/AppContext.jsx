import { createContext } from "react";

export const AppContext =  createContext();

export const AppContextProvider = (props) =>{
    
    const calculateAge = (dob) => {
        const [day, month, year] = dob.split("/").map(Number);
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();
 
        let age = today.getFullYear() - birthDate.getFullYear();
        return age;
    };

    const value = { 
        calculateAge
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

