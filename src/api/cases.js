import { http } from './http.js'

export const casesApi = {
  getList: (status) => http.get(status ? `/cases?status=${status}` : '/cases'),
  getDetail: (caseId) => http.get(`/cases/${caseId}`),
  getSummary: () => http.get('/cases/summary'),
  patchStatus: (caseId, status) => http.patch(`/cases/${caseId}/status`, { status }),
}
