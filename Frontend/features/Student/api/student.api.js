import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

async function request(method, url, data, config = {}) {
  const response = await axios.request({
    method,
    url: `${API_BASE}${url}`,
    data,
    withCredentials: true,
    ...config,
  });
  return response.data;
}

async function uploadMedia(files) {
  const formData = new FormData();
  Array.from(files || []).forEach((file) => formData.append('attachments', file));

  const response = await axios.post(`${API_BASE}/upload`, formData, {
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
}

function buildParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
  );
}

async function getTasks(filters = {}) {
  return request('get', '/task', undefined, { params: buildParams(filters) });
}

async function getTask(id) {
  return request('get', `/task/${id}`);
}

async function getAppliedTasks() {
  return request('get', '/task/applied');
}

async function createPitch(payload) {
  return request('post', '/pitch', payload);
}

async function improvePitch(payload) {
  return request('post', '/pitch/improve', payload);
}

async function getMyPitches() {
  return request('get', '/pitch/my');
}

async function getPitch(id) {
  return request('get', `/pitch/${id}`);
}

async function getStudentProfile() {
  return request('get', '/profile/me');
}

async function updateBasicProfile(payload) {
  return request('patch', '/profile/me/basic', payload);
}

async function updateStudentProfile(payload) {
  return request('patch', '/profile/student', payload);
}

async function getPublicStudentProfile(userId) {
  return request('get', `/profile/student/${userId}`);
}

async function addPortfolioItem(payload) {
  return request('post', '/profile/portfolio', payload);
}

async function getPortfolioItems(userId, type) {
  return request('get', `/profile/portfolio/${userId}`, undefined, { params: buildParams({ type }) });
}

async function updatePortfolioItem(itemId, payload) {
  return request('patch', `/profile/portfolio/${itemId}`, payload);
}

async function featurePortfolioItem(itemId) {
  return request('patch', `/profile/portfolio/${itemId}/feature`);
}

async function deletePortfolioItem(itemId) {
  return request('delete', `/profile/portfolio/${itemId}`);
}

export {
  uploadMedia,
  getTasks,
  getTask,
  getAppliedTasks,
  createPitch,
  improvePitch,
  getMyPitches,
  getPitch,
  getStudentProfile,
  updateBasicProfile,
  updateStudentProfile,
  getPublicStudentProfile,
  addPortfolioItem,
  getPortfolioItems,
  updatePortfolioItem,
  featurePortfolioItem,
  deletePortfolioItem,
};