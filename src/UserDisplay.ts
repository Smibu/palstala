export type UserDisplay = {
  id: string;
  name?: string | null;
  image?: string | null;
};

export type UserDisplayNoId = {
  name?: string | null;
  image?: string | null;
};
