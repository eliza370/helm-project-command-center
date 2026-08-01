import { describe, expect, it } from "vitest";
import { createProjectSchema } from "../../features/projects/schemas";
import { updateProjectSchema } from "../../features/projects/schemas";
import { getSafeProjectError, getSafeProjectUpdateError } from "../../features/projects/errors";

const valid={name:"Project Atlas",description:"",businessObjective:"Deliver a controlled outcome",sponsorName:"Morgan Lee",sponsorEmail:"",lifecyclePhase:"Initiation",status:"Draft",startDate:"2026-08-01",targetCompletionDate:"2026-12-01",overallHealth:"Not Assessed",scopeHealth:"Green",scheduleHealth:"Amber",budgetHealth:"Red",resourceHealth:"Not Assessed",riskHealth:"Green"};
describe("project validation",()=>{
  it("accepts valid values and optional sponsor email",()=>{expect(createProjectSchema.safeParse(valid).success).toBe(true);expect(createProjectSchema.safeParse({...valid,sponsorEmail:"sponsor@example.com"}).success).toBe(true)});
  it.each([["name",""],["businessObjective"," "],["sponsorName",""]])("requires %s",(field,value)=>expect(createProjectSchema.safeParse({...valid,[field]:value}).success).toBe(false));
  it("rejects invalid sponsor email",()=>expect(createProjectSchema.safeParse({...valid,sponsorEmail:"invalid"}).success).toBe(false));
  it("rejects reversed dates",()=>expect(createProjectSchema.safeParse({...valid,targetCompletionDate:"2026-07-01"}).success).toBe(false));
  it.each([["lifecyclePhase","Unknown"],["status","Unknown"],["overallHealth","Blue"]])("rejects an undocumented %s",(field,value)=>expect(createProjectSchema.safeParse({...valid,[field]:value}).success).toBe(false));
  it("enforces Draft and Initiation",()=>expect(createProjectSchema.safeParse({...valid,lifecyclePhase:"Planning"}).success).toBe(false));
  it.each([["Closed","Active"],["Execution","Completed"],["Execution","Cancelled"]])("rejects invalid lifecycle %s and status %s",(lifecyclePhase,status)=>expect(createProjectSchema.safeParse({...valid,lifecyclePhase,status}).success).toBe(false));
  it.each([["Closed","Completed"],["Closed","Cancelled"]])("accepts valid terminal lifecycle %s and status %s",(lifecyclePhase,status)=>expect(createProjectSchema.safeParse({...valid,lifecyclePhase,status}).success).toBe(true));
});
describe("safe project errors",()=>{it("maps authorization, validation, duplicate, and unknown errors",()=>{expect(getSafeProjectError({code:"42501"})).toContain("permission");expect(getSafeProjectError({code:"23514"})).toContain("Review");expect(getSafeProjectError({code:"23505"})).toContain("already");expect(getSafeProjectError({code:"XX000"})).not.toContain("XX000")})});

describe("project update validation",()=>{
  it("retains ordinary field, sponsor email, date, health, and lifecycle validation",()=>{expect(updateProjectSchema.safeParse({...valid,confirmTerminal:""}).success).toBe(true);expect(updateProjectSchema.safeParse({...valid,sponsorEmail:"bad"}).success).toBe(false);expect(updateProjectSchema.safeParse({...valid,targetCompletionDate:"2026-01-01"}).success).toBe(false);expect(updateProjectSchema.safeParse({...valid,riskHealth:"Blue"}).success).toBe(false);expect(updateProjectSchema.safeParse({...valid,lifecyclePhase:"Planning"}).success).toBe(false)});
  it.each(["Completed","Cancelled"])("requires explicit confirmation for %s",status=>{expect(updateProjectSchema.safeParse({...valid,lifecyclePhase:"Closed",status}).success).toBe(false);expect(updateProjectSchema.safeParse({...valid,lifecyclePhase:"Closed",status,confirmTerminal:"confirmed"}).success).toBe(true)});
  it.each(["id","organizationId","createdBy","projectManagerId","createdAt"])("rejects immutable %s input",field=>expect(updateProjectSchema.safeParse({...valid,[field]:"00000000-0000-4000-8000-000000000000"}).success).toBe(false));
  it("maps update failures safely",()=>{expect(getSafeProjectUpdateError({code:"42501"})).toContain("permission");expect(getSafeProjectUpdateError({code:"23514"})).toContain("Review");expect(getSafeProjectUpdateError({code:"XX000"})).not.toContain("XX000")});
});
