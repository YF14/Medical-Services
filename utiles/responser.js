const success = (code = 200, data, message)=>{
    return {
        code:code,
        data:data,
        success:true,
        message:message
    }
}

const error = (code,message)=>{
    return {
        code:code  || 500,
        success:false,
        message:message
    }
}

module.exports = {
    success, error
}