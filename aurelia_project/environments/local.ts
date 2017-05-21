import { ISettings } from 'model'

export default {
  debug: true,
  testing: true,
};

export const Settings : ISettings = {
  name: 'local',
  clientUrl: 'http://localhost:9000',
  serverUrl: 'http://localhost:9002',
  apiPath: '/api'
}
