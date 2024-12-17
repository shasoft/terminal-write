const Terminal = require("./src/Terminal");
const terminal = new Terminal;
for (const methodName of [
    'write',
    'parse',
    'strip_tags',
    'strip_ansi'
]) {
    const saveOriginMethod = terminal[methodName];
    terminal[methodName] = function (...args) {
        return saveOriginMethod.apply(terminal, args);
    };
}
module.exports = terminal;
