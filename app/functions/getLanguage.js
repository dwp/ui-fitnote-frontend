function getLanguage(lang) {
    let l;
    if (lang === 'en' || lang === 'cy') {
        l = lang;
    } else {
        // defaults to "en" if it is other than en or cy
        l = 'en';
    }
    return l;
}

module.exports = getLanguage;