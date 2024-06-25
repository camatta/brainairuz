export type LIST = {
  id: string;
  name: string;
}

export type COMPANY = {
  id: string;
  name: string;
  list: LIST[];
}

export type TEAM = {
  id: string;
  name: string;
  list: LIST[];
}

export type PROJECT = {
  id: string;
  name: string;
  list: LIST[]
}

export type SERVICE = {
  id: string;
  name: string;
  list: LIST[]
}
