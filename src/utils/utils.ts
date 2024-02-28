import { type Ref, toRef } from 'vue';
import _ from 'lodash';

import { fetchCategoryList } from '@/api/index';

const isNullStr = (str: string | Ref<string> | undefined) => {
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
};

async function getCategoryPath(categoriId: string) {
  let result = '';
  const { data } = await fetchCategoryList();
  if (data.tistory.status == '200') {
    const currentCategory = _.find(data.tistory.item.categories, [
      'id',
      categoriId,
    ]);
    if (currentCategory != undefined) {
      result = currentCategory.label.replace(/\//g, ' > ');
    }
    return result;
  }
}

const handleNewLine = (str: string) => str.replace(/(?:\r\n|\r|\n)/g, '</br>');

const setValue = <T>(obj: T, key: keyof T, value: T[keyof T]) => {
  obj[key] = value;
};

export { isNullStr, getCategoryPath, handleNewLine, setValue };
