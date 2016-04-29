export const lang = () => {
  let locale = 'zh'
  if (navigator.language) {
    locale = navigator.language.split('-')[0]
  }
  if (navigator.languages && navigator.languages[0]) {
    locale = navigator.languages[0].split('-')[0]
  }
  if (locale !== 'zh') {
    return 'en'
  } else {
    return locale
  }
}
