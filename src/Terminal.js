const styles = require("./ansiStyles");
const ansiRegex = require("./ansiRegex");
const help = require("./help");
// ПредНастроенные теги
const tags = require("./tags");
function strip_tags(s) {
    return s.replace(/\<.+?\>/g, '');
}
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
const tagsClose = {};
for (var name in tags) {
    const closeTag = getCloseTagValue(tags[name]);
    if (closeTag) {
        tagsClose['/' + name] = closeTag;
    }
}
for (var name in tagsClose) {
    tags[name] = tagsClose[name];
}
//console.log(tagsClose); process.exit(1);
//
const colorTags = {};
for (const name of styles._names.color) {
    colorTags[name.toLowerCase()] = 1;
}
//
const shortName = {
    bold: 'b',
    italic: 'i',
    underline: 'u',
    strikethrough: 's'
};
//
const modifierTags = {};
for (var name of styles._names.modifier) {
    name = name.toLowerCase()
    modifierTags[name] = 1;
    if (shortName[name]) {
        modifierTags[shortName[name]] = 1;
    }
}
//console.log(styles); process.exit(1);
// Добавить теги
for (var name in styles) {
    if (!name.startsWith('_')) {
        const item = styles[name];
        name = name.charAt(0).toUpperCase() + name.slice(1)
        //
        var nameShort = shortName[name.toLowerCase()] ? shortName[name.toLowerCase()] : null;
        //
        if (colorTags[name.toLowerCase()]) {
            name = 'Fg' + name;
        }
        //
        tags[name] = item.open;
        if (nameShort) {
            tags[nameShort] = item.open;
        }
        if (item.open != item.close) {
            tags['/' + name] = item.close;
            if (nameShort) {
                tags['/' + nameShort] = item.close;
            }
        }
    }
}
// </>
tags["/"] = '<Reset>';
//console.log(tags); process.exit(1);
//
class Terminal {
    m_rules = [];
    constructor(source) {
        if (source) {
            this.m_rules = [].concat(source.m_rules);
        } else {
            for (const tag in tags) {
                this.m_rules.push(
                    this.#createRule(tag, tags[tag])
                );
            }
        }
    }

    #createRule(name, value) {
        return {
            tag: name,
            name: name.toLowerCase(),
            re: new RegExp('<' + name + '>', "gmi"),
            value: value
        };
    }

    #findTag(name) {
        name = name.toLowerCase();
        for (var i in this.m_rules) {
            if (this.m_rules[i].name == name) {
                return i;
            }
        }
        return -1;
    }

    parse(...args) {
        var ret = args.join(' ');
        // Сделать все замены
        var saveRet = ret;
        do {
            saveRet = ret;
            this.m_rules.forEach((item) => {
                ret = ret.replace(item.re, item.value);
            });
        } while (saveRet != ret);
        return ret;
    }

    strip_tags(...args) {
        return strip_tags(args.join(' '));
    }

    strip_ansi(...args) {
        return args.join(' ').replace(ansiRegex(), '');
    }

    write(...args) {
        console.log(this.parse(...args) + tags.Reset);
        return this;
    }

    hr(color, ch, length) {
        ch = ch || '*';
        length = length || 80;
        return this.write(color + ch.repeat(length) + '</>');
    }

    clone() {
        return new Terminal(this);
    }

    replace(source) {
        this.m_rules = [].concat(source.m_rules);
    }

    setTag(name, value) {
        const rule = this.#createRule(name, value);
        const index = this.#findTag(name);
        if (index < 0) {
            this.m_rules.push(rule);
        } else {
            this.m_rules[index] = rule;
        }
        const nameClose = '/' + name;
        const indexClose = this.#findTag(nameClose);
        if (indexClose < 0) {
            const valueClose = getCloseTagValue(value);
            if (valueClose) {
                this.m_rules.push(
                    this.#createRule(nameClose, valueClose)
                );
            }
        }
        return this;
    }

    getTag(name) {
        const index = this.#findTag(name);
        if (index >= 0) {
            return this.m_rules[index].value;
        }
        return null;
    }

    removeTag(name) {
        const index = this.#findTag(name);
        if (index >= 0) {
            this.m_rules.splice(index, 1);
        }
        return this;
    }

    tags() {
        var ret = {
            colors: {},
            bgColors: {},
            modifier: {},
            theme: {}
        };
        const closeTags = {};
        for (var rule of this.m_rules) {
            if (rule.tag.startsWith('/')) {
                closeTags[rule.tag.substring(1, rule.tag.length)] = 1;
            }
        }
        for (var rule of this.m_rules) {
            if (!rule.tag.startsWith('/')) {
                var obj = null;
                if (rule.tag.startsWith('Fg')) {
                    obj = ret.colors;
                }
                else if (rule.tag.startsWith('Bg')) {
                    obj = ret.bgColors;
                }
                else if (modifierTags[rule.name]) {
                    obj = ret.modifier;
                } else {
                    obj = ret.theme;
                }
                if (obj) {
                    obj[rule.tag] = {
                        close: !!closeTags[rule.tag],
                        value: rule.value
                    };
                }
            }
        }
        return ret;
    }

    help() {
        help(this);
    }
}
//
module.exports = Terminal;