export const hasAccessToken = () => {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }

  const accessToken = localStorage.getItem('access_token');
  return accessToken !== null;
};