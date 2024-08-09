import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

//creates a custom hook called useAppDispatch that wraps useDispatch hook with AppDispatch type
export const useAppDispatch = () => useDispatch<AppDispatch>();

//creates a custom hook called useAppSelector that wraps useSelector hook with RootState type
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
