import { useState } from 'react';
import {
  addPortfolioItem,
  createPitch,
  deletePortfolioItem,
  featurePortfolioItem,
  getAppliedTasks,
  getMyPitches,
  getPortfolioItems,
  getPublicStudentProfile,
  getStudentProfile,
  getTask,
  getTasks,
  improvePitch,
  updateBasicProfile,
  updatePortfolioItem,
  updateStudentProfile,
  uploadMedia,
} from '../api/student.api';

function useStudent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = async (action) => {
    setLoading(true);
    setError(null);
    try {
      return await action();
    } catch (error) {
      setError(error?.response?.data?.message || 'Request failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    uploadMedia: (files) => run(() => uploadMedia(files)),
    getTasks: (filters) => run(() => getTasks(filters)),
    getTask: (id) => run(() => getTask(id)),
    getAppliedTasks: () => run(() => getAppliedTasks()),
    createPitch: (payload) => run(() => createPitch(payload)),
    improvePitch: (payload) => run(() => improvePitch(payload)),
    getMyPitches: () => run(() => getMyPitches()),
    getPitch: (id) => run(() => getPitch(id)),
    getStudentProfile: () => run(() => getStudentProfile()),
    updateBasicProfile: (payload) => run(() => updateBasicProfile(payload)),
    updateStudentProfile: (payload) => run(() => updateStudentProfile(payload)),
    getPublicStudentProfile: (userId) => run(() => getPublicStudentProfile(userId)),
    addPortfolioItem: (payload) => run(() => addPortfolioItem(payload)),
    getPortfolioItems: (userId, type) => run(() => getPortfolioItems(userId, type)),
    updatePortfolioItem: (itemId, payload) => run(() => updatePortfolioItem(itemId, payload)),
    featurePortfolioItem: (itemId) => run(() => featurePortfolioItem(itemId)),
    deletePortfolioItem: (itemId) => run(() => deletePortfolioItem(itemId)),
  };
}

export default useStudent;