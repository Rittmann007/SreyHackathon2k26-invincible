import { useState } from 'react';
import {
  acceptPitch,
  advanceTask,
  createTask,
  deleteTask,
  getBusinessProfile,
  getMyTasks,
  getTask,
  getTaskPitches,
  getTasks,
  releasePayment,
  rejectPitch,
  shortlistPitch,
  updateBasicProfile,
  updateBusinessProfile,
  updateTask,
  uploadAssets,
} from '../api/business.api';

function useBusiness() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = async (action) => {
    setLoading(true);
    setError(null);
    try {
      return await action();
    } catch (error) {
      const responseMessage = error?.response?.data?.message || 'Request failed';
      const validationDetails = error?.response?.data?.errors;
      setError(
        Array.isArray(validationDetails) && validationDetails.length > 0
          ? `${responseMessage}: ${validationDetails.join(', ')}`
          : responseMessage
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    uploadAssets: (files) => run(() => uploadAssets(files)),
    createTask: (payload) => run(() => createTask(payload)),
    getTasks: (filters) => run(() => getTasks(filters)),
    getMyTasks: () => run(() => getMyTasks()),
    getTask: (id) => run(() => getTask(id)),
    updateTask: (id, payload) => run(() => updateTask(id, payload)),
    advanceTask: (id, payload) => run(() => advanceTask(id, payload)),
    deleteTask: (id) => run(() => deleteTask(id)),
    getTaskPitches: (taskId) => run(() => getTaskPitches(taskId)),
    shortlistPitch: (id) => run(() => shortlistPitch(id)),
    acceptPitch: (id) => run(() => acceptPitch(id)),
    rejectPitch: (id, payload) => run(() => rejectPitch(id, payload)),
    releasePayment: (id) => run(() => releasePayment(id)),
    getBusinessProfile: () => run(() => getBusinessProfile()),
    updateBasicProfile: (payload) => run(() => updateBasicProfile(payload)),
    updateBusinessProfile: (payload) => run(() => updateBusinessProfile(payload)),
  };
}

export default useBusiness;