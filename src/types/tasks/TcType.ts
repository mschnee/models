export enum TcPolicyType {
  REVIEW_REQUEST = 'review-request',
  CREATE_POLICY = 'create-policy',
  REVIEW_REQUESTED_POLICY = 'review-requested-policy',
  UPDATE_POLICY = 'update-policy',
  APPROVE_REQUESTED_POLICY = 'approve-requested-policy',
  IMPLEMENT_POLICY = 'implement-policy',
  COMPLETE_CASE = 'complete-case',
}

export enum TcDocumentType {
  SIGN_DOCUMENT = 'sign-document',
  COUNTERSIGN_DOCUMENT = 'countersign-document',
}

export declare type TcType = TcPolicyType | TcDocumentType;
