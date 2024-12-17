const terminal = require("../index");
//*
const text = '<FgBlue>terminal</FgBlue><Success>-</><BgBlue>write</>';
terminal.hr('<Title>', '#', terminal.strip_tags(text).length);
terminal.write(text);
terminal.hr('<Warning>', '@', terminal.strip_ansi(terminal.parse(text)).length);
console.log();

// Добавляем новый тег
terminal.setTag('Test', '<fgRed><bgCyan>')
terminal.write('<Test>Test</> <string>string</>');
// Удаляем тег
terminal.removeTag('test')
terminal.write('<Test>Test</> <string>string</>');

console.log();
// Клонируем
const terminalTest = terminal.clone();
// Добавляем новый тег
terminalTest.setTag('Test', '<fgRed><bgCyan>')
// Выводим
terminalTest.write('<Test>terminalTest</>');
terminal.write('<Test>terminal</>');
// Заменяем исходный терминал клонированным
terminal.replace(terminalTest);
terminal.write('<Test>terminal after replace</>');

terminal.write('<fgRed>zzz');
terminal.write('<FGRED>zzz');
terminal.write('<fgred>zzz');
//*/
// Вывести справку
terminal.setTag('Test', '<Info>');
terminal.setTag('Test2', '111<Info>222');
terminal.help();
