const axios = require('axios');
const API_URL = "http://api.melihcaliskan.com/"
const translate = require('@vitalets/google-translate-api');

const data = { "en": "Camera Issue", "tr": "Ekran sorunu", "fr": "Problème d'écran", "de": null, "es": null, "ja": null, "hi": null, "pt": null, "ru": null, "ko": null }
console.log(data.en)

const start = async () => {
    for (key in data) {
        if (data.hasOwnProperty(key)) {
            data[key] = await translate(data.en, { to: key }).then(res => res.text)
        }
    }
    console.log(JSON.stringify([data]))
    return [data]
}

start();

const post = async (data) => {
    axios.post(`${API_URL}issues/14`, {
        name: data,
    }).then(function (response) {
        console.log(response);
    }).catch(function (error) {
        console.log(error);
    });
}