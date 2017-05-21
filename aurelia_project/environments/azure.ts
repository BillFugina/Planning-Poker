import { ISettings } from 'model'

export default {
  debug: false,
  testing: false,
}

export const Settings : ISettings = {
  name: 'azure',
  clientUrl: 'http://planningpoker-client.azurewebsites.net/',
  serverUrl: 'http://planningpoker-api.azurewebsites.net',
  apiPath: '/api'
}
