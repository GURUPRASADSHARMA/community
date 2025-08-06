

const asyncHandler = (reqhandler)=>{
    return (req,res,next)=>{
        Promise.resolve(reqhandler(req,res,next))
        .catch((err)=>{
            console.log(err)
        })
    }
}

export  {asyncHandler}


 
