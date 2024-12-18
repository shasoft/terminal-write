const { EOL } = require("os");
const _each = require("./_each");
const _ucfirst = require("./_ucfirst");
const strip_ansi = require("./strip_ansi");
const strip_tags = require("./strip_tags");
const styles = require("./ansiStyles");

function nameToOut(name) {
    return name.substring(2).replace('Bright', '`')
}
function help(terminal) {
    const tags = terminal.allTags();
    //
    const modifierNames = {};
    _each(styles.modifierNames, (name) => {
        modifierNames[_ucfirst(name)] = 1;
    });
    // Определить список цветов текста
    const FgColors = [];
    const BgColors = [];
    const themeTags = [];
    const modifier = [];
    _each(tags, (value, name) => {
        if (name.substring(0, 1) != '/') {
            const prefix = name.substring(0, 2);
            switch (prefix) {
                case 'Fg': FgColors.push(name); break;
                case 'Bg': BgColors.push(name); break;
                default: {
                    if (strip_ansi(value).length == 0) {
                        if (name != 'Reset') {
                            modifier.push(name);
                        }
                    } else {
                        themeTags.push(name);
                    }
                }
            }
        }
    })
    FgColors.sort();
    BgColors.sort();
    // Цвета
    console.log('');
    var maxLength = 0;
    BgColors.forEach((name) => {
        name = nameToOut(name);
        maxLength = Math.max(name.length, maxLength);
    });
    process.stdout.write(" ".repeat(maxLength));
    BgColors.forEach((_name) => {
        var name = nameToOut(_name);
        terminal.write('|' + '<' + _name + '>' + name + '</' + _name + '>');
    });
    process.stdout.write(EOL);
    FgColors.forEach((_nameFg) => {
        var nameFg = nameToOut(_nameFg);
        terminal.write(" ".repeat(maxLength - nameFg.length) + '<' + _nameFg + '>' + nameFg + '</' + _nameFg + '>');
        BgColors.forEach((_nameBg) => {
            nameBg = nameToOut(_nameBg);
            terminal.write('|' + '<' + _nameFg + '>' + '<' + _nameBg + '>' + nameBg + '</' + _nameBg + '>' + '</' + _nameFg + '>');
        });
        process.stdout.write(EOL);
    });

    // Модификаторы
    console.log('');
    maxLength = 0;
    _each(modifier, (name) => {
        maxLength = Math.max(maxLength, name.length * 3 + 2 + 3);
    });
    //s_dd(maxLength);
    _each(modifier, (name) => {
        const length = name.length * 3 + 2 + 3;
        const tagOpen = "<" + name + ">";
        const tagClose = "</" + name + ">";
        process.stdout.write(" ".repeat((maxLength - length) / 2));
        process.stdout.write(tagOpen);
        terminal.write(tagOpen + name + tagClose);
        process.stdout.write(tagClose);
        process.stdout.write(EOL);
    });
    // Схема по умолчанию
    console.log('');
    maxLength = 0;
    _each(themeTags, (name) => {
        maxLength = Math.max(maxLength, name.length);
    });
    _each(themeTags, (name) => {
        const value = tags[name];
        terminal.write();
        var tag = "<" + name + ">";
        if (strip_tags(value).length != 0) {
            tag = '';
        }
        terminal.write(" ".repeat(maxLength - name.length) + tag + name);
        process.stdout.write(" " + value);
        if (tag.length == 0) {
            terminal.write(" " + value);
        }
        process.stdout.write(EOL);
    });
}
module.exports = help
