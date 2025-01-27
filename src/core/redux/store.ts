import { init, RematchDispatch, RematchRootState, Models } from "@rematch/core";
import loadingPlugin, { ExtraModelsFromLoading } from "@rematch/loading";
import auth from "./auth";
import screen from "./screen";
import contact from "./contact";
import doc from "./doc";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import multidoc from "./multidoc";

export interface RootModel extends Models<RootModel> {
  auth: typeof auth;
  screen: typeof screen;
  contact: typeof contact;
  doc: typeof doc;
  multidoc: typeof multidoc;
}

type FullModel = ExtraModelsFromLoading<RootModel>;

export const models: RootModel = {
  auth,
  screen,
  contact,
  doc,
  multidoc
};

export const store = init<RootModel, FullModel>({
  models,
  plugins: [loadingPlugin({})],
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel, FullModel>;
export const useAppDispatch: () => Dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
