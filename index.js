const fs = require('fs');
const path = require('path');
const glob = require("glob")
const translator = require('@vitalets/google-translate-api');
const dotenv = require('dotenv');
const languages = require('./languages')
const { wait, isObject, getFilename, readJSON, writeJSON } = require('./helpers')
const translateJSON = require('./translateJSON')
dotenv.config();

locales_path = `${process.env.LONGUS_FRONT_END_PATH}/public/static/locales/`
en_locales_path = `${process.env.LONGUS_FRONT_END_PATH}/public/static/locales/en/`

skip_languages = ['en', 'tr']

glob(`${locales_path}en/**/*.json`, function (er, files) {
  languages.filter(language => !skip_languages.includes(language.value)).map((language, index) => {
    console.log(`\n\n[${index + 1}/${languages.length}] 🈯️ Current language is: ${language.name}\n`)

    files.map(filePath => {
      console.log("🔍 Reading file...")
      readJSON(filePath).then(async file => {
        console.log("📖 Translating content...")
        let json = new translateJSON
        let result = await json.to(language.value).translate(file)
        console.log(result)
        console.log("💾 Saving translated content...")
        writeJSON(language.value, getFilename(filePath), result)
      })
    })
  })
})