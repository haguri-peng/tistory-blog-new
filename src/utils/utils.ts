import { type Ref, toRef } from 'vue';

function isNullStr(str: string | Ref<string> | undefined) {
  const orgnMsg = toRef((str || '').toString().trim());
  if (
    orgnMsg.value == null ||
    orgnMsg.value == 'undefined' ||
    orgnMsg.value.length == 0 ||
    typeof orgnMsg.value == 'undefined' ||
    orgnMsg.value == ''
  ) {
    return true;
  } else {
    return false;
  }
}

export { isNullStr };
