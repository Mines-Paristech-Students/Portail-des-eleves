export interface Namespace {
  id: string;
  name: string;
  scopedToPk: string;
  scopedToModel: string;
}

export interface Tag {
  id: string;
  value: string;
  namespace: Namespace;
}

export interface ShortTag {
  id: string;
  value: string;
  namespace: string;
}
