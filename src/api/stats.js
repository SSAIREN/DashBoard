import { http } from './http.js'

export const statsApi = {
  getOverview: () => http.get('/stats/overview'),
  getKeywords: () => http.get('/stats/keywords'),
  getAgeGroups: () => http.get('/stats/age-groups'),
  getPhoneNumbers: () => http.get('/stats/phone-numbers'),
  getFrozenAccounts: () => http.get('/stats/frozen-accounts'),
}
