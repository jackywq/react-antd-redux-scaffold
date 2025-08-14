import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// 使用类型化的hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// 添加类型安全的selector hook
export const useAppSelectorTyped = <TSelected>(
  selector: (state: RootState) => TSelected
): TSelected => {
  return useSelector(selector);
};
