import { LitElement, html } from 'lit'
import { property, state } from 'lit/decorators.js'
import styles from './styles.css'
import fireEvent from './fireEvent'
import { name } from '../package.json'
import { CardConfig } from './config/card'
import { HASS } from './types'

function setValue(obj: any, path: string, value: any) {
  const pathFragments = path.split('.')
  let o = obj
  while (pathFragments.length - 1) {
    const fragment = pathFragments.shift()!
    if (!o.hasOwnProperty(fragment)) o[fragment] = {}
    o = o[fragment]
  }
  o[pathFragments[0]] = value
}

const OptionsDecimals = [0, 1]
const OptionsStepSize = [0.5, 1]
const OptionsStepLayout = ['column', 'row']
const includeDomains = ['climate']
const GithubReadMe = 'https://github.com/sctale/simple-thermostat/blob/master/README.md'

const stub: any = {
  header: {},
  layout: { mode: {} },
}

const cloneDeep = (obj: any) => JSON.parse(JSON.stringify(obj))

export default class SimpleThermostatEditor extends LitElement {
  @property({ type: Object }) config: CardConfig = {} as CardConfig
  @property({ type: Object }) hass!: HASS

  static styles = styles

  static getConfigElement() {
    return window.document.createElement(`${name}-editor`)
  }

  setConfig(config: CardConfig) {
    this.config = config || { ...stub }
  }

  _openLink() {
    window.open(GithubReadMe)
  }

  render() {
    if (!this.hass) return html``

    return html`
      <div class="card-config">
        <div class="overall-config">
          <div class="side-by-side">
            <ha-entity-picker
              label="实体（必选）"
              .hass=${this.hass}
              .value=${this.config.entity || ''}
              .configValue="entity"
              .includeDomains=${includeDomains}
              @change=${this.valueChanged}
              allow-custom-entity
            ></ha-entity-picker>
          </div>

          <ha-formfield label="显示标题栏？">
            <ha-switch
              .checked=${this.config.header !== false}
              @change=${this.toggleHeader}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield label="显示模式名称？">
            <ha-switch
              .checked=${this.config?.layout?.mode?.names !== false}
              configValue="layout.mode.names"
              @change=${this.valueChanged}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield label="显示模式图标？">
            <ha-switch
              .checked=${this.config?.layout?.mode?.icons !== false}
              configValue="layout.mode.icons"
              @change=${this.valueChanged}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield label="显示模式分类标题？">
            <ha-switch
              .checked=${this.config?.layout?.mode?.headings !== false}
              configValue="layout.mode.headings"
              @change=${this.valueChanged}
            ></ha-switch>
          </ha-formfield>

          ${this.config.header !== false ? html`
            <div class="side-by-side">
              <paper-input
                label="名称（可选）"
                .value=${this.config.header?.name || ''}
                configValue="header.name"
                @value-changed=${this.valueChanged}
              ></paper-input>
              <ha-icon-input
                label="图标（可选）"
                .value=${this.config.header?.icon || ''}
                configValue="header.icon"
                @value-changed=${this.valueChanged}
              ></ha-icon-input>
            </div>
            <div class="side-by-side">
              <ha-entity-picker
                label="开关实体（可选）"
                .hass=${this.hass}
                .value=${this.config?.header?.toggle?.entity || ''}
                configValue="header.toggle.entity"
                @change=${this.valueChanged}
                allow-custom-entity
              ></ha-entity-picker>
              <paper-input
                label="开关标签"
                .value=${this.config?.header?.toggle?.name || ''}
                configValue="header.toggle.name"
                @value-changed=${this.valueChanged}
              ></paper-input>
            </div>
          ` : ''}

          <div class="side-by-side">
            <paper-input
              label="占位文本（可选）"
              .value=${this.config.fallback || ''}
              configValue="fallback"
              @value-changed=${this.valueChanged}
            ></paper-input>
          </div>

          <div class="side-by-side">
            <paper-dropdown-menu
              label="小数位数（可选）"
              configValue="decimals"
              @value-changed=${this.valueChanged}
              class="dropdown"
            >
              <paper-listbox
                slot="dropdown-content"
                .selected=${Object.values(OptionsDecimals).indexOf(+this.config.decimals)}
              >
                ${Object.values(OptionsDecimals).map(
                  (item) => html`<paper-item>${item}</paper-item>`
                )}
              </paper-listbox>
            </paper-dropdown-menu>

            <paper-input
              label="单位（可选）"
              .value=${this.config.unit || ''}
              configValue="unit"
              @value-changed=${this.valueChanged}
            ></paper-input>
          </div>

          <div class="side-by-side">
            <paper-dropdown-menu
              label="布局方向（可选）"
              configValue="layout.step"
              @value-changed=${this.valueChanged}
              class="dropdown"
            >
              <paper-listbox
                slot="dropdown-content"
                .selected=${Object.values(OptionsStepLayout).indexOf(this.config.layout?.step)}
              >
                ${Object.values(OptionsStepLayout).map(
                  (item) => html`<paper-item>${item}</paper-item>`
                )}
              </paper-listbox>
            </paper-dropdown-menu>

            <paper-dropdown-menu
              label="步进值（可选）"
              configValue="step_size"
              @value-changed=${this.valueChanged}
              class="dropdown"
            >
              <paper-listbox
                slot="dropdown-content"
                .selected=${Object.values(OptionsStepSize).indexOf(+this.config.step_size)}
              >
                ${Object.values(OptionsStepSize).map(
                  (item) => html`<paper-item>${item}</paper-item>`
                )}
              </paper-listbox>
            </paper-dropdown-menu>
          </div>

          <div class="side-by-side">
            <mwc-button @click=${this._openLink}>
              配置选项说明
            </mwc-button>
            <span>标签、控制、传感器、故障和隐藏选项只能在代码编辑器中配置</span>
          </div>
        </div>
      </div>
    `
  }

  valueChanged(ev: any) {
    if (!this.config || !this.hass) return
    const { target } = ev
    const copy = cloneDeep(this.config)
    if (target.configValue) {
      if (target.value === '') {
        delete copy[target.configValue]
      } else {
        setValue(
          copy,
          target.configValue,
          target.checked !== undefined ? target.checked : target.value
        )
      }
    }
    fireEvent(this, 'config-changed', { config: copy })
  }

  toggleHeader(ev: any) {
    this.config.header = ev.target.checked ? {} : false
    fireEvent(this, 'config-changed', { config: this.config })
  }
}
