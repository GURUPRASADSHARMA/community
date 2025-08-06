import { toast } from "react-toastify"

 const handleSucess=(message)=>{
    toast.success(message,{
        position:'top-right'
    })
}

const handleError=(message)=>{
    toast.success(message,{
        position:'top-right'
    })
}

export default {handleSucess,handleError}