import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://sreyhackathon2k26-invincible.onrender.com/api';

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

async function uploadAssets(files) {
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

async function createTask(payload) {
  return request('post', '/task', payload);
}

async function getTasks(filters = {}) {
  return request('get', '/task', undefined, { params: buildParams(filters) });
}

async function getMyTasks() {
  return request('get', '/task/my');
}

async function getTask(id) {
  return request('get', `/task/${id}`);
}

async function updateTask(id, payload) {
  return request('patch', `/task/${id}`, payload);
}

async function advanceTask(id, payload) {
  return request('patch', `/task/${id}/status`, payload);
}

async function deleteTask(id) {
  return request('delete', `/task/${id}`);
}

async function getTaskPitches(taskId) {
  return request('get', `/pitch/task/${taskId}`);
}

async function shortlistPitch(id) {
  return request('patch', `/pitch/${id}/shortlist`);
}

async function acceptPitch(id) {
  return request('patch', `/pitch/${id}/accept`);
}

async function rejectPitch(id, payload = {}) {
  return request('patch', `/pitch/${id}/reject`, payload);
}

async function releasePayment(id) {
  return request('patch', `/pitch/${id}/release-payment`);
}

async function getBusinessProfile() {
  return request('get', '/profile/me');
}

async function updateBasicProfile(payload) {
  return request('patch', '/profile/me/basic', payload);
}

async function updateBusinessProfile(payload) {
  return request('patch', '/profile/business', payload);
}

export {
  uploadAssets,
  createTask,
  getTasks,
  getMyTasks,
  getTask,
  updateTask,
  advanceTask,
  deleteTask,
  getTaskPitches,
  shortlistPitch,
  acceptPitch,
  rejectPitch,
  releasePayment,
  getBusinessProfile,
  updateBasicProfile,
  updateBusinessProfile,
};