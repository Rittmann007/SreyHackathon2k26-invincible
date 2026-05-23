import {createContext,useState} from "react"

// using context api

const Authcontext = createContext() 

function Authprovider({children}) {
    // the variables we are using it for
    const [user, setuser] = useState(null)
    const [loading, setloading] = useState(true)

    return (
        <Authcontext.Provider value={{user,setuser,loading,setloading}}>
            {children}
        </Authcontext.Provider>
    )
}

export {
    Authcontext,
    Authprovider
}