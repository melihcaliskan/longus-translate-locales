const translator = require('@vitalets/google-translate-api');
const { isObject, wait } = require('./helpers')
const tunnel = require('tunnel');

let config = {
    /*
    agent: tunnel.httpsOverHttp({
        proxy: {
            host: '104.244.75.26',
            port: '8080',
            headers: {
                'User-Agent': 'Node'
            }
        }
    })
    */
}
module.exports = class translateJSON {
    constructor(content, lang) {
        this.translate = this.translate.bind(this)

        this.content = content;
        this.lang = lang;
        this.result = {}
    }
    to(value) {
        this.lang = value;
        return this
    }
    skip(values) {
        this.skip = values
        return this
    }
    async translate(content, parent_key = null) {
        let result = this.result
        for (var key in content) {
            wait(1000)
            let tmp_content = content[key]
            if (isObject(tmp_content)) {
                this.translate(tmp_content, key)
            } else {
                if (parent_key) {
                    if (result[parent_key] === undefined) {
                        result[parent_key] = {}
                    };
                    console.log("Translating (child): ", this.lang, tmp_content)
                    //this.result[parent_key][key] = "child"
                    this.result[parent_key][key] = await translator(tmp_content, { to: this.lang }, config).then(translated => translated.text)
                } else {
                    console.log("Translating (parent): ", tmp_content)
                    this.result[key] = "parent"
                    this.result[key] = await translator(tmp_content, { to: this.lang }, config).then(translated => {
                        console.log(translated)
                        return translated.text
                    })
                }
            }
        }
        return result
    }
}