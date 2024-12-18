function strip_tags(s) {
    return s.replace(/\<.+?\>/g, '');
}
module.exports = strip_tags;