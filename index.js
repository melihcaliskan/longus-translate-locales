const fs = require('fs');
const path = require('path');
const glob = require("glob")
const translator = require('@vitalets/google-translate-api');
const dotenv = require('dotenv');
const languages = require('./languages')
const { wait, isObject, getFilename, readJSON, writeJSON } = require('./helpers')
const translateJSON = require('./translateJSON')
dotenv.config();

const locales_path = `${process.env.LONGUS_FRONT_END_PATH}/public/static/locales/`
const en_locales_path = `${locales_path}en/`

//active: ja
const skip_languages = ['en', 'tr', 'es', 'de', 'fr', 'hi', 'ru', 'ko', 'sv']
//skip_files = ['detail.json', 'common.json', 'commonheader.json', 'header.json', 'login.json', 'home.json', 'issue_card.json']
const skip_files = []
glob(`${en_locales_path}/**/*.json`, function (er, files) {
  languages.filter(language => !skip_languages.includes(language.value)).map((language, index) => {
    console.log(`\n\n[${index + 1}/${languages.length}] 🈯️ Current language is: ${language.name}\n`)

    console.log(files.filter(filePath => !skip_files.includes(getFilename(filePath))))

    files.filter(filePath => !skip_files.includes(getFilename(filePath))).map(filePath => {
      console.log("🔍 Reading file...")
      readJSON(filePath).then(async file => {
        console.log(file)
        console.log("📖 Translating content...")
        let json = new translateJSON
        let result = await json.to(language.value).translate(file)
        console.log(result)
        console.log("💾 Saving translated content...")
        writeJSON(language.value, getFilename(filePath), result)
        wait(3000)
      })
    })
  })
})