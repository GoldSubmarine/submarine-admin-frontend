import language from './chinese'

export default function translate(template, replacements) {
  replacements = replacements || {}

  // Translate
  template = language[template] || template

  // Replace
  return template.replace(/{([^}]+)}/g, function(_, key) {
    var str = replacements[key]
    if (
      language[replacements[key]] !== null &&
      language[replacements[key]] !== 'undefined'
    ) {
      str = language[replacements[key]]
    }
    return str || '{' + key + '}'
  })
}
