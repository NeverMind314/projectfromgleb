'use strict'

module.exports = {
    responseOk(data) {
        return {
            current_timestamp: new Date(),
            error: null,
            data: data || null
        }
    }, 

    responseErr(errMsg, errorCode,  data) {
        return {
            current_timestamp: new Date(),
            error: {
                err_code: errorCode || 500,
                message: errMsg || 'Internal server error'
            } || null,
            data: data || null
        }
    }
}