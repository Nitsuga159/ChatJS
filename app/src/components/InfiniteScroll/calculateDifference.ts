export default ({
  scrollHeight,
  prevScrollHeight,
  scrollTop,
  loadingHeight,
  up,
}: {
  scrollHeight: number;
  prevScrollHeight: number;
  scrollTop: number;
  loadingHeight: number;
  up: boolean;
}) => {
  const scrollDiff = scrollHeight - prevScrollHeight;
  const diffUp = scrollTop > scrollDiff ? 0 : scrollDiff;
  const diffDown = scrollHeight - scrollTop <= scrollDiff ? scrollDiff : 0;

  let diff = up ? diffUp : diffDown;

  let diffLoading = up
    ? loadingHeight - scrollTop
    : loadingHeight - (scrollHeight - scrollTop);

  diffLoading = diffLoading < 0 ? 0 : diffLoading;

  return up ? diff + diffLoading : -(diff + diffLoading);
};
