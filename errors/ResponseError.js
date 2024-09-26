export default class ResponseError extends Error{
    constructor(object, statusCode){
        super('');
        this.name = "ResponseError";
        this.object = object;
        this.statusCode = statusCode;
    }
}