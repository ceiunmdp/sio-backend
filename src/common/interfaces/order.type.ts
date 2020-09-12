export type Order<T> = {
  [P in keyof T]?: 'ASC' | 'DESC' | 1 | -1;
};
