const fs = require('fs');
const path = require('path');
const translator = require('@vitalets/google-translate-api');
const dotenv = require('dotenv');
dotenv.config();
locales_path = `${process.env.LONGUS_FRONT_END_PATH}/public/static/locales/`
en_locales_path = `${process.env.LONGUS_FRONT_END_PATH}/public/static/locales/en/`

module.exports = {
    getFilename(dir) {
        return path.parse(dir).base;
    },
    isObject(o) {
        return o !== null && typeof o === 'object' && Array.isArray(o) === false;
    },
    wait(ms) {
        var start = new Date().getTime();
        var end = start;
        while (end < start + ms) {
            end = new Date().getTime();
        }
    },
    readJSON(filename) {
        return new Promise(async (resolve, reject) => {
            fs.readFile(filename, (err, data) => {
                if (err) reject(err);
                resolve(JSON.parse(data));
            });
        })
    },
    writeJSON(lang, filename, content) {
        let data = JSON.stringify(content);
        let dir = `${locales_path}${lang}`

        !fs.existsSync(dir) && fs.mkdirSync(dir);
        let path = `${dir}/${filename}`
        fs.writeFileSync(path, data);
    }
}