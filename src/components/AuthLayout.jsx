import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"


export default function Protected({children, authentication}){

    const navigate = useNavigate()
    const [loder, setLoader] = useState(true)
    const authStatus = useSelector(state => state.auth.status)

    useEffect(() => {
        //TODO: commented code is easy to understand but not

        // if(authStatus === true){
        //     navigate("/")
        // }else if(authStatus === false){
        //     navigate("/login")
        // }

        if(authentication && authStatus !== authentication){
            navigate("/login")
        }else if(!authentication && authStatus !==authentication){
            navigate("/")
        }
        setLoader(false)
    }, [authStatus, navigate, authentication])

    return loader ? <h1>loading</h1> : <>{children}</>
}
