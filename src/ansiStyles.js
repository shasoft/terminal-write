// Сгенерировать список стилей из пакета https://github.com/chalk/ansi-styles
const child_process = require("child_process");
const path = require("path");
const os = require("os");
const fs = require("fs");
const env = structuredClone(process.env);
env.fileSaveStyles = path.resolve(os.tmpdir(), '~styles.json');
child_process.execSync("node --input-type=module <generateStyles.js", {
    cwd: __dirname,
    env: env,
    stdio: ['inherit', 1, 'inherit']
});
const styles = JSON.parse(fs.readFileSync(env.fileSaveStyles).toString());
fs.unlinkSync(env.fileSaveStyles);
module.exports = styles;