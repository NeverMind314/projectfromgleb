module.exports = {
    responseObj(data, error) {
        return {
            current_timestamp: new Date(),
            error: error || null,
            data: data || null
        }
    }, 

    errConstructor(msg, errCode) {
        return {
            err_code: errCode || 500,
            message: msg || 'Internal server error'
        }
    }
}