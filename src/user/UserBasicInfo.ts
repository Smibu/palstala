import type { UserVisibleInfo } from "./UserVisibleInfo";

export type UserBasicInfo = {
  id: string;
} & UserVisibleInfo;
