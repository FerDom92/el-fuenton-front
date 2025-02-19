import axios from 'axios';

export const baseApi = axios.create({
  baseURL: 'https://67b1f847bc0165def8cc5f8f.mockapi.io/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});