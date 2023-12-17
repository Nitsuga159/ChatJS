export default (accessToken: string) => ({
  headers: { Authorization: `Bearer ${accessToken}` },
});
