export default (arr1, arr2) => {
  const result = (arr1 || []).concat(
    arr2
  );

  return result.filter((elem, index) =>
    result.indexOf(elem) === index
  );
};
