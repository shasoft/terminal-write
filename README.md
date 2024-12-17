## Вывод разноцветного текста в консоль с помощью тегов

Пакет основан на пакете [chalk/ansi-styles](https://github.com/chalk/ansi-styles) и добавляет возможность выводить разноцветный текст с использованием тегов

```js
const terminal = require("terminal-write");

const text = '<FgBlue>terminal</FgBlue><Success>-</><BgBlue>write</>';
terminal.hr('<Title>', '#', terminal.strip_tags(text).length);
terminal.write(text);
terminal.hr('<Warning>', '@', terminal.strip_ansi(terminal.parse(text)).length);
```
![](example/example.png)

Теги могут содержать закрывающий тег который заканчивает действие открывающего тега. Тег `</>` / `<Reset>` позволяет закончить действие всех тегов. Теги регистронезависимы. 
```js
// Код ниже выведет одно и тоже
terminal.write('<fgRed>zzz');
terminal.write('<FGRED>zzz');
terminal.write('<fgred>zzz');
```
![](example/ignoreCase.png)


### Поддерживаемые цвета
![](example/colors.png)


### Модификаторы
![](example/modifier.png)


### Преднастройки
![](example/theme.png)


### Добавление своих настроек
```js
// Добавляем новый тег
terminal.setTag('Test', '<fgRed><bgCyan>')
terminal.write('<Test>Test</> <string>string</>');
// Удаляем тег
terminal.removeTag('test')
terminal.write('<Test>Test</> <string>string</>');
```
![](example/setRemoveTag.png)

```js
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
```
![](example/clone.png)