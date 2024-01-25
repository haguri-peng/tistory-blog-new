function isNullStr(str = '') {
  str = str.trim();
  if (
    str == null ||
    str == 'undefined' ||
    str.length == 0 ||
    typeof str == 'undefined' ||
    str == ''
  ) {
    return true;
  } else {
    return false;
  }
}

export { isNullStr };
