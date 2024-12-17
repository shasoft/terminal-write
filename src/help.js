if (0) {
    const terminal = require("../index");
    const { write, strip } = require("../index");

    const text = '<FgGreen>terminal</><fgRed>-</><BgGreen>write</>';
    terminal.hr('<Info>', '#', terminal.strip(text).length);
    terminal.write(text);
    write(text);
    terminal.hr('<BgYellow>', '@', terminal.strip(text).length);

    const tags = terminal.allTags();
    var maxLength = 0;
    tags.forEach((name) => {
        maxLength = Math.max(maxLength);
    });
    //
    const colors = [];
    tags.forEach((name) => {
        if (name.startsWith('Fg')) {
            colors.push(name.substring(2));
        }
    });
    //
    function _name(name) {
        return name + " ".repeat(maxLength - name.length)
    }
    //
    terminal.write('<Underscore>' + _name('color') + _name('Bright') + _name('Bg color') + '</>');
    colors.forEach((color) => {
        terminal.write(
            '<Fg' + color + '>' + _name('Fg' + color) + '</>' +
            '<Bright><Fg' + color + '>' + _name('Fg' + color) + '</>' +
            '<Bg' + color + '>' + _name('Bg' + color) + '</>' +
            '<Bright><Bg' + color + '>' + _name('Bg' + color) + '</>'
        );
    });
    //
    console.log();
    terminal.allTags().map((name) => {
        if (!name.startsWith('Fg') && !name.startsWith('Bg')) {
            terminal.write(name + " ".repeat(maxLength - name.length) + ' <' + name + '>' + name + '</>');
        }
    });
}
function pushItem(terminal, name, inColors, maxLength, outColors, prefix) {
    var str = '';
    const tagName = prefix + name;
    const item = inColors[tagName];
    if (typeof (item) != 'undefined') {
        //
        var text = terminal.strip_ansi(terminal.strip_tags(item.value));
        if (text.length == 0) {
            text = tagName;
        } else {
            text = '';
        }
        //
        const tagOpen = '<' + tagName + '>';
        var tagClose = ' '.repeat(tagName.length);
        var tagClosePrefix = '</>';
        if (item.close) {
            tagClose = '</' + tagName + '>';
            tagClosePrefix = '';
        }
        str = tagOpen + terminal.parse('</> ' + tagOpen + text + tagClosePrefix + tagClose + ' ') + tagClose;
    }
    outColors.push(str);
    return Math.max(terminal.strip_ansi(str).length, maxLength);
}
function alignColors(terminal, colors, maxLength) {
    return colors.map((str) => {
        const cnt = (maxLength - terminal.strip_ansi(str).length) / 2;
        return ' '.repeat(cnt) + str;
    });

}
function helpItems(terminal, inItems) {
    console.log();
    var items = [];
    var maxLength = 0;
    for (var name in inItems) {
        maxLength = pushItem(terminal, name, inItems, maxLength, items, '');
    }
    items = alignColors(terminal, items, maxLength);
    for (var i in items) {
        console.log(items[i]);
    }
}
function help(terminal) {
    const tags = terminal.tags();
    //console.log(tags); process.exit(1);
    //*
    const colors = [];
    for (var name in tags.colors) {
        colors.push(name.substring(2));
    }
    colors.sort();
    var fgColors = [];
    var maxLengthFg = 0;
    var bgColors = [];
    var maxLengthBg = 0;
    for (var name of colors) {
        maxLengthFg = pushItem(terminal, name, tags.colors, maxLengthFg, fgColors, 'Fg');
        maxLengthBg = pushItem(terminal, name, tags.bgColors, maxLengthBg, bgColors, 'Bg');
    }
    fgColors = alignColors(terminal, fgColors, maxLengthFg);
    bgColors = alignColors(terminal, bgColors, maxLengthBg);

    console.log();
    for (var i in fgColors) {
        console.log(fgColors[i], ' '.repeat(maxLengthFg - terminal.strip_ansi(fgColors[i]).length), ' | ', bgColors[i]);
    }
    helpItems(terminal, tags.modifier);

    helpItems(terminal, tags.theme);

}
module.exports = help
