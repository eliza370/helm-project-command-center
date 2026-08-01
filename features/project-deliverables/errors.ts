export function getSafeDeliverableError(error:{code?:string}){if(error.code==="23514"||error.code==="22023")return"Review the owner, milestone, and lifecycle details and try again.";return"We could not save this deliverable. Refresh and try again."}

