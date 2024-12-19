// https://sky.pro/wiki/javascript/sravnenie-process-stdout-write-i-console-log-v-node-js/
const fs = require("fs");
const path = require("path");
const _each = require("./_each");
const _ucfirst = require("./_ucfirst");
const theme = require("./theme");
const getCloseTagValue = require("./getCloseTagValue");
const styles = require("./ansiStyles");

// Короткие имена для тегов
const shortName = {
    Bold: 'b',
    Italic: 'i',
    Underline: 'u',
    Strikethrough: 's'
};

const tags = {};
console.log('Значения по умолчанию');
_each(theme, (value, name) => {
    tags[name] = value;
    const closeTag = getCloseTagValue(value);
    if (closeTag) {
        tags['/' + name] = closeTag;
    }
});
//
function _addTag(name, tag) {
    if (tag) {
        tags[name] = tag.open;
        if (tag.open !== tag.close) {
            tags['/' + name] = tag.close;
        }
        if (shortName[name]) {
            _addTag(shortName[name], tag);
        }
    }
}
console.log('Добавить цвета текста');
_each(styles.foregroundColorNames, (name) => {
    const tag = styles[name];
    name = 'Fg' + _ucfirst(name);
    _addTag(name, tag);
});
console.log('Добавить цвет фона');
_each(styles.backgroundColorNames, (name) => {
    const tag = styles[name];
    name = _ucfirst(name);
    _addTag(name, tag);
});
console.log('Добавить модификаторы');
_each(styles.modifierNames, (name) => {
    const tag = styles[name];
    name = _ucfirst(name);
    _addTag(name, tag);
});
tags["/"] = '<Reset>';
// Вывести цветной
function printText(text, color) {
    console.log(tags[color] + text + tags['/' + color]);
}
// Сохранить
const content = JSON.stringify(tags, null, 2);
const filepathTheme = path.resolve(__dirname, 'theme.json');
if (!fs.existsSync(filepathTheme) || fs.readFileSync(filepathTheme) != content) {
    printText('Цветовая схема сохранена', 'FgGreen');
    fs.writeFileSync(
        filepathTheme,
        content
    );
} else {
    printText('Цветовая схема не изменилась', 'FgYellow');
}