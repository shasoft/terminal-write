global.s_dd = function (...args) {
    console.log(...args); process.exit(1);
}
const { EOL } = require("os");
const getCloseTagValue = require("./getCloseTagValue");
const theme = require("./theme.json");
const strip_tags = require("./strip_tags");
const strip_ansi = require("./strip_ansi");
const help = require("./help");
//
class Terminal {
    m_rules = [];
    constructor(source) {
        if (source) {
            this.m_rules = [].concat(source.m_rules);
        } else {
            for (const name in theme) {
                this.m_rules.push(
                    this.#createRule(name, theme[name])
                );
            }
        }
    }

    #createRule(name, value) {
        return {
            name: name,
            tag: name.toLowerCase(),
            re: new RegExp('<' + name + '>', "gmi"),
            value: value
        };
    }

    #findTag(name) {
        const tag = name.toLowerCase();
        for (var i in this.m_rules) {
            if (this.m_rules[i].tag == tag) {
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
        return strip_ansi(args.join(' '));
    }

    clear() {
        // clear console
        process.stdout.write('\x1Bc')
        return this;
    }

    write(...args) {
        if (args.length) {
            process.stdout.write(this.parse(...args) + theme.Reset);
        }
        return this;
    }

    writeLn(...args) {
        this.write(...args);
        process.stdout.write(EOL);
        return this;
    }

    hr(color, ch, length) {
        ch = ch || '*';
        length = length || 80;
        return this.writeLn(color + ch.repeat(length));
    }

    clone() {
        return new Terminal(this);
    }

    replace(source) {
        this.m_rules = [].concat(source.m_rules);
    }

    addTag(name, value) {
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

    removeTag(name) {
        const index = this.#findTag(name);
        if (index >= 0) {
            this.m_rules.splice(index, 1);
        }
        return this;
    }

    allTags() {
        const ret = {};
        for (var i in this.m_rules) {
            const rule = this.m_rules[i];
            ret[rule.name] = rule.value;
        }
        return ret;
    }

    help() {
        help(this);
    }
}
//
module.exports = Terminal;