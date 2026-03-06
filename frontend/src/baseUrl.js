export const baseApiURL = () => {
  // Use Docker backend container name and port
  return process.env.REACT_APP_APILINK || 'http://backend:5000';
};