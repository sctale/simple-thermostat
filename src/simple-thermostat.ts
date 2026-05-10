import { name as CARD_NAME, version } from '../package.json'
import SimpleThermostatEditor from './editor'
import SimpleThermostat from './main'

customElements.define(CARD_NAME, SimpleThermostat)
customElements.define(`${CARD_NAME}-editor`, SimpleThermostatEditor)

console.info(`%c${CARD_NAME}: ${version}`, 'font-weight: bold')
;(window as any).customCards = (window as any).customCards || []
;(window as any).customCards.push({
  type: CARD_NAME,
  name: '小空调 Simple Thermostat ZH',
  preview: false,
  description: 'Home Assistant 温控卡片（lit v3 / HASS 2026.x 兼容，中文界面）',
})
