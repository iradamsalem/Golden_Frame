

const LOCAL_IP = 'http://192.168.2.102:3001';

export const API_BASE_URL = LOCAL_IP;

// if you want to expand in the future:
export const config = {
  apiBaseUrl: LOCAL_IP,
  uploadEndpoint: `${LOCAL_IP}/api/photos`,
};