module.exports = {
    responceObj(data) {
        return {
            current_timestamp: new Date(),
            error: data.error || null,
            data: data
        }
    } 
}