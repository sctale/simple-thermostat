import * as Sqrl from 'squirrelly'
import { html, nothing } from 'lit'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import formatNumber from '../formatNumber'
import renderInfoItem from './infoItem'

const renderIcon = (icon: string) => `<ha-icon icon="${icon}"></ha-icon>`

Sqrl.defaultConfig.autoEscape = false
Sqrl.filters.define('icon', renderIcon)
Sqrl.filters.define('join', (arr: string[], delimiter = ', ') => arr.join(delimiter))
Sqrl.filters.define('css', (str: string, css: Record<string, string>) => {
  const styles = Object.entries(css).reduce((memo, [key, val]) => `${memo}${key}:${val};`, '')
  return `<span style="${styles}">${str}</span>`
})
Sqrl.filters.define('debug', (data: unknown) => {
  try { return JSON.stringify(data) }
  catch { return `Not able to read valid JSON object from: ${data}` }
})

export function wrapSensors(config: any, content: any) {
  const { type, labels: showLabels } = config?.layout?.sensors ?? { type: 'table', labels: true }
  const classes = [
    showLabels ? 'with-labels' : 'without-labels',
    type === 'list' ? 'as-list' : 'as-table',
  ]
  return html` <div class="sensors ${classes.join(' ')}">${content}</div> `
}

export default function renderTemplated({
  context,
  entityId,
  template = '{{state.text}}',
  label,
  hass,
  variables = {},
  config,
  localize,
  openEntityPopover,
}) {
  const { state, attributes } = context

  const [domain] = entityId.split('.')
  const lang = hass.selectedLanguage || hass.language
  const trPrefix = 'ui.card.climate.'
  const translations = Object.entries(hass.resources[lang] || {}).reduce(
    (memo, [key, value]) => {
      if (key.startsWith(trPrefix)) memo[key.replace(trPrefix, '')] = value
      return memo
    },
    {}
  )

  const data = {
    ...attributes,
    state: {
      raw: state,
      text: localize(state, `component.${domain}.state._.`),
    },
    ui: translations,
    v: variables,
  }

  Sqrl.filters.define(
    'formatNumber',
    (str: string, opts: any = { decimals: config.decimals }) => String(formatNumber(str, opts))
  )
  Sqrl.filters.define('relativetime', (str: string) =>
    `<ha-relative-time fwd-datetime=${str} with-hass></ha-relative-time>`
  )
  Sqrl.filters.define('translate', (str: string, prefix = '') => {
    if (!prefix && (domain === 'climate' || domain === 'humidifier')) {
      return localize(str, `state_attributes.${domain}.${str}`)
    }
    return localize(str, prefix)
  })

  const render = (tmpl: string) => Sqrl.render(tmpl, data, { useWith: true })
  const value = render(template)

  if (label === false || config?.layout?.sensors?.labels === false) {
    return html`<div class="sensor-value">${unsafeHTML(value)}</div>`
  }

  const safeLabel = label || '{{friendly_name}}'
  const heading = safeLabel.match(/^(mdi|hass):.*/)
    ? renderIcon(safeLabel)
    : render(safeLabel)

  return html`
    <div class="sensor-heading">${unsafeHTML(heading)}</div>
    <div class="sensor-value">${unsafeHTML(value)}</div>
  `
}
