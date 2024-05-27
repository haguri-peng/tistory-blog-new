import { storeToRefs } from 'pinia';
import { useSpinnerStore } from '@/store/spinner';

export const spinnerControl = () => {
  const spinnerStore = useSpinnerStore();
  const { getLoading } = storeToRefs(spinnerStore);
  const { setLoading, toggleLoading } = spinnerStore;

  return { getLoading, setLoading, toggleLoading };
};
