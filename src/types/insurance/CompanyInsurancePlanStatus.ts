export enum CompanyInsurancePlanStatus {
  Current = 'current',
  Expired = 'expired',
  Cancelled = 'cancelled',
  Reinstated = 'reinstated',
  PendingCancellation = 'pending-cancellation',
  Draft = 'draft', // this is a special state.  There can be only one!
  Unknown = 'unknown', // could be pending BOR
  Archived = 'archived', // special status for display purposes
}
