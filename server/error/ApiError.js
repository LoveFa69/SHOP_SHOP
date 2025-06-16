// error/ApiError.js
class ApiError extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }

    static badRequest(message) {
        // ИСПРАВЛЕНО: 404 -> 400
        return new ApiError(400, message); 
    }

    static internal(message) {
        return new ApiError(500, message);
    }

    static forbidden(message) {
        return new ApiError(403, message);
    }

    // Добавим популярные статусы
    static unauthorized(message) {
        return new ApiError(401, message);
    }

    static notFound(message) {
        return new ApiError(404, message);
    }
}

module.exports = ApiError;