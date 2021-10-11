export enum TcItemRelatedObjectType {
  POLICY = 'Policy',
  DOCUMENT = 'Document',
}

export interface TcItemMeta {
  related_obj_type: TcItemRelatedObjectType;
  related_obj_id: string;
  [prop: string]: string;
}
