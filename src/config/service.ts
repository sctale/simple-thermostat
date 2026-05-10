import { LooseObject } from '../types'

export interface Service {
  domain: string
  service: string
  data?: LooseObject
}

export default function parseService(service: false | Service): Service {
  if (service === false) {
    return { domain: 'climate', service: 'set_temperature' }
  }
  return service
}
