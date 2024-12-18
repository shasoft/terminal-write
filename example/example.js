const terminal = require("../index");
//*
const text = '<FgBlue>terminal</FgBlue><Success>-</><BgBlue>write</>';
terminal.hr('<Title>', '#', terminal.strip_tags(text).length);
terminal.writeLn(text);
terminal.hr('<Warning>', '@', terminal.strip_ansi(terminal.parse(text)).length);
console.log();

// Добавляем новый тег
terminal.addTag('Test', '<fgRed><bgCyan>')
terminal.writeLn('<Test>addTag</> <string>string</>');
// Удаляем тег
terminal.removeTag('test')
terminal.writeLn('<Test>removeTag</> <string>string</>');

console.log();
// Клонируем
const terminalTest = terminal.clone();
// Добавляем новый тег
terminalTest.addTag('Test', '<fgRed><bgCyan>')
// Выводим
terminalTest.writeLn('<Test>terminalTest</>');
terminal.writeLn('<Test>terminal</>');
// Заменяем исходный терминал клонированным
terminal.replace(terminalTest);
terminal.writeLn('<Test>terminal after replace</>');

terminal.writeLn('<fgRed>zzz');
terminal.writeLn('<FGRED>zzz');
terminal.writeLn('<fgred>zzz');
//*/
// Вывести справку
terminal.addTag('Test', '<Info>');
terminal.addTag('Test2', '[<Info>X</Info>]');
terminal.help();
