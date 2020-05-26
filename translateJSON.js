const translator = require('@vitalets/google-translate-api');
const { isObject } = require('./helpers')

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
    async translate(content, parent_key = null) {
        let result = this.result
        for (var key in content) {
            let tmp_content = content[key]
            if (isObject(tmp_content)) {
                this.translate(tmp_content, key)
            } else {
                if (parent_key) {
                    if (result[parent_key] === undefined) {
                        result[parent_key] = {}
                    };
                    //result[parent_key][key] = "child test"
                    this.result[parent_key][key] = await translator(tmp_content, { to: this.lang }).then(translated => translated.text)
                } else {
                    //result[key] = "test"
                    this.result[key] = await translator(tmp_content, { to: this.lang }).then(translated => translated.text)
                }
            }
        }
        return result
    }
}