const fs = require('fs');
const path = require('path');
const glob = require("glob")
const translate = require('@vitalets/google-translate-api');
const dotenv = require('dotenv');
const languages = require('./languages')

dotenv.config();

locales_path = `${process.env.LONGUS_FRONT_END_PATH}/public/static/locales/`
en_locales_path = `${process.env.LONGUS_FRONT_END_PATH}/public/static/locales/en/`


glob(`${locales_path}en/**/*.json`, function (er, files) {
  languages.map((language, index) => {
    // TODO: Exclude languages from an array
    if (language.value != 'en' || language.value != 'tr') {
      console.log(`\n\n[${index + 1}/${languages.length}] 🈯️ Current language is: ${language.name}\n`)
      files.map(filePath => {
        console.log("[1/3] 🔍 Reading file...")
        readJSON(filePath).then(file => {
          console.log("[2/3] 📖 Translating content...")
          translateJSON(file, language.value).then(translated => {
            console.log("[3/3] 📖 Saving translated content...")
            writeJSON(language.value, getFilename(filePath), translated)
            wait(3000);
          })
        })
      })
    }
  })
})

function readJSON(filename) {
  return new Promise(async (resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) reject(err);
      resolve(JSON.parse(data));
    });
  })
}

function writeJSON(lang, filename, content) {
  let data = JSON.stringify(content);
  let dir = `${locales_path}${lang}`

  !fs.existsSync(dir) && fs.mkdirSync(dir);
  let path = `${dir}/${filename}`
  fs.writeFileSync(path, data);
}

function translateJSON(content, lang, parent_key = null, translatedJSON = {}) {
  return new Promise(async (resolve, reject) => {
    current_language = lang

    for (var key in content) {
      value = content[key]
      if (isObject(value)) {
        resolve(translateJSON(value, lang, key, translatedJSON))
      } else {

        // TODO: Optional chaining.
        // translatedJSON[parent_key]?[key] = value

        // If key is an object
        if (parent_key) {
          if (translatedJSON[parent_key] === undefined) {
            translatedJSON[parent_key] = {}
          };
          translatedJSON[parent_key][key] = await translate(value, { to: current_language }).then(translated => translated.text)
        } else {
          translatedJSON[key] = await translate(value, { to: current_language }).then(translated => translated.text)
        }
      }
    }
    resolve(translatedJSON)
  })
}

function getFilename(dir) {
  return path.parse(dir).base;
}

function isObject(o) {
  return o !== null && typeof o === 'object' && Array.isArray(o) === false;
}

function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}