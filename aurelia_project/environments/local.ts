import { ISettings } from 'model'

export default {
  debug: false,
  testing: false,
};

export const Settings : ISettings = {
  name: 'local',
  clientUrl: 'http://localhost:9000',
  serverUrl: 'http://localhost:9002',
  apiPath: '/api'
}
