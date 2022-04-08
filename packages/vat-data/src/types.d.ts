import type {
  MapStore,
  SetStore,
  StoreOptions,
  WeakMapStore,
  WeakSetStore,
} from '@agoric/store';
import { Context } from 'vm';

type Tail<T extends any[]> = T extends [head: any, ...tail: infer Tail_]
  ? Tail_
  : never;

type MinusContext<
  F extends (context, ...rest: any[]) => any,
  P extends any[] = Parameters<F>, // P: are the parameters of F
  R = ReturnType<F>, // R: the return type of F
> = (...args: Tail<P>) => R;

type FunctionsMinusContext<O> = { [K in keyof O]: MinusContext<O[K]> };

interface KindDefiner {
  <P, S, B>(
    tag: string,
    init: (...args: P) => S,
    behavior: B,
    finish?: () => void,
  ): (...args: P) => { [Facet in keyof B]: FunctionsMinusContext<B[Facet]> };
}

export type VatData = {
  defineKind: KindDefiner;
  defineDurableKind: KindDefiner;

  makeKindHandle: (descriptionTag: string) => unknown;

  makeScalarBigMapStore: <K, V>(
    label: string,
    options?: StoreOptions,
  ) => MapStore<K, V>;
  makeScalarBigWeakMapStore: <K, V>(
    label: string,
    options?: StoreOptions,
  ) => WeakMapStore<K, V>;

  makeScalarBigSetStore: <K>(
    label: string,
    options?: StoreOptions,
  ) => SetStore<K>;
  makeScalarBigWeakSetStore: <K>(
    label: string,
    options?: StoreOptions,
  ) => WeakSetStore<K>;
};