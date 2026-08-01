export const lifecyclePhases = ["Initiation", "Planning", "Execution", "Monitoring and Control", "Closing", "Closed"] as const;
export const projectStatuses = ["Draft", "Active", "On Hold", "At Risk", "Completed", "Cancelled"] as const;
export const healthValues = ["Not Assessed", "Green", "Amber", "Red"] as const;

export type LifecyclePhase = (typeof lifecyclePhases)[number];
export type ProjectStatus = (typeof projectStatuses)[number];
export type HealthValue = (typeof healthValues)[number];
