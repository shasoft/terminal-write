function _each(items, cb) {
    for (const key in items) {
        cb(items[key], key);
    }
}
module.exports = _each;