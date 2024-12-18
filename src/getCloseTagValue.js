const strip_tags = require("./strip_tags");
// Получить значение закрывающего тега 
function getCloseTagValue(str) {
    if (strip_tags(str).length == 0) {
        return '<' + str
            .split('<')
            .slice(1)
            .reverse()
            .map((line) => {
                return '/' + line;
            })
            .join('<')
            ;
    }
    return null;
}
module.exports = getCloseTagValue;