/**
 * 
 * @param {Array} error 
 * @returns {Array}
 */
export const formatingErrorZod = (error) => error.reduce(
    (temp, err) => {
        const field = err.path[0];

        // check apakah index field sudah ada di temporary
        if (!temp['errors'][field]) {
            temp['errors'][field] = [];
        }

        // prevent message double pada satu field
        if (temp['errors'][field].findIndex((value) => value == err.message) < 0) {
            temp['errors'][field].push(err.message);
        }

        if (!temp['message']) temp['message'] = err.message;
        return temp;
    }, { 'errors': {} });