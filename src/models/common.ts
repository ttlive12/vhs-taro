import { Rank } from '@/constants';

export type Ranked<T> = {
  [key in Rank]: T;
};

export type RankedResponse<T> = {
  data: Ranked<T>;
  message: string;
  success: boolean;
};
