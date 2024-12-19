// Генерация списка стилей из пакета https://github.com/chalk/ansi-styles
import fs from "fs"
import styles from "ansi-styles"
import { modifierNames, foregroundColorNames, backgroundColorNames } from "ansi-styles"
// Инициализировать
styles.modifierNames = modifierNames;
styles.foregroundColorNames = foregroundColorNames;
styles.backgroundColorNames = backgroundColorNames;
// Сохранить
fs.writeFileSync(
    process.env.fileSaveStyles,
    JSON.stringify(styles, null, 2)
);