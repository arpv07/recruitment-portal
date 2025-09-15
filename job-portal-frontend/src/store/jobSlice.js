import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../services/api';

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async () => {
  const jobs = await apiClient.getAvailableJobs();
  return jobs;
});

export const postJob = createAsyncThunk('jobs/postJob', async (jobData) => {
    const response = await apiClient.postJob(jobData);
    return response;
});
export const updateJob = createAsyncThunk('jobs/updateJob', async ({ jobId, jobData }) => {
  const updatedJob = await apiClient.updateJob(jobId, jobData);
  return updatedJob;
});


const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    postings: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.postings = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(postJob.fulfilled, (state, action) => {
        state.postings.unshift(action.payload);
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        const index = state.postings.findIndex(job => job._id === action.payload._id);
        if (index !== -1) {
        state.postings[index] = action.payload;
     }
     });

  },
});

export default jobSlice.reducer;