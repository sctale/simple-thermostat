import { html, nothing } from 'lit'
import formatNumber from '../formatNumber'
import { LooseObject } from '../types'

interface InfoItemDetails extends LooseObject {
  heading?: string | false
  icon?: string
  unit?: string
  decimals?: number
  type?: string
}

interface InfoItemOptions {
  hide?: boolean
  state: any
  hass: any
  localize?
  openEntityPopover?
  details: InfoItemDetails
}

export default function renderInfoItem({
  hide = false,
  hass,
  state,
  details,
  localize,
  openEntityPopover,
}: InfoItemOptions) {
  if (hide || typeof state === 'undefined') return nothing

  const { type, heading, icon, unit, decimals } = details

  if (type === 'relativetime') {
    return html`
      <div class="sensor-value">
        <ha-relative-time .datetime=${state} .hass=${hass}></ha-relative-time>
      </div>
    `
  }

  if (typeof state === 'object') {
    const [domain] = state.entity_id.split('.')
    const prefix = [
      'component', domain, 'state',
      state.attributes?.device_class ?? '_',
      '',
    ].join('.')
    let value = localize(state.state, prefix)
    if (typeof decimals === 'number') {
      value = formatNumber(value, { decimals })
    }
    return html`
      <div
        class="sensor-value clickable"
        @click=${() => openEntityPopover && openEntityPopover(state.entity_id)}
      >
        ${value} ${unit || state.attributes.unit_of_measurement}
      </div>
    `
  }

  let value = typeof decimals === 'number' ? formatNumber(state, { decimals }) : state
  return html`<div class="sensor-value">${value}${unit || ''}</div>`
}
