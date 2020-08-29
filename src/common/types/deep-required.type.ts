export declare type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends Array<infer U>
    ? Array<DeepRequired<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepRequired<U>>
    : DeepRequired<T[P]>;
};
