import { describe, expect, it } from "vitest";
import { correctDecisionSchema, createDecisionSchema } from "../../features/project-decisions/schemas";
import { getSafeDecisionError } from "../../features/project-decisions/errors";

const valid = { projectId:"10000000-0000-4000-8000-000000000001",title:"Hosting platform",context:"The service needs a production host.",decision:"Use the managed platform.",rationale:"It meets reliability needs.",alternativesConsidered:"Self-hosting and two cloud vendors.",consequences:"Operating costs become predictable.",decisionMakerName:"Architecture steering committee",decisionDate:"2026-08-01",effectiveDate:"2026-08-15",followUpNotes:"Create a rollout Action." };

describe("decision validation",()=>{
  it("accepts valid creation and trims input",()=>{const result=createDecisionSchema.parse({...valid,title:"  Hosting platform  "});expect(result.title).toBe("Hosting platform")});
  it("accepts optional dates and notes",()=>{const result=createDecisionSchema.parse({...valid,effectiveDate:"",followUpNotes:"  "});expect(result.effectiveDate).toBeNull();expect(result.followUpNotes).toBeNull()});
  it("enforces required fields",()=>expect(createDecisionSchema.safeParse({...valid,alternativesConsidered:" "}).success).toBe(false));
  it("enforces 200 character boundaries",()=>{expect(createDecisionSchema.safeParse({...valid,title:"x".repeat(200),decisionMakerName:"x".repeat(200)}).success).toBe(true);expect(createDecisionSchema.safeParse({...valid,title:"x".repeat(201)}).success).toBe(false)});
  it("enforces 4000 character boundaries",()=>{expect(createDecisionSchema.safeParse({...valid,context:"x".repeat(4000)}).success).toBe(true);expect(createDecisionSchema.safeParse({...valid,context:"x".repeat(4001)}).success).toBe(false)});
  it("rejects invalid identifiers and unexpected audit fields",()=>{expect(createDecisionSchema.safeParse({...valid,projectId:"bad"}).success).toBe(false);expect(createDecisionSchema.safeParse({...valid,createdBy:valid.projectId}).success).toBe(false)});
  it("rejects invalid and future decision dates",()=>{expect(createDecisionSchema.safeParse({...valid,decisionDate:"08/01/2026"}).success).toBe(false);expect(createDecisionSchema.safeParse({...valid,decisionDate:"2999-01-01",effectiveDate:""}).success).toBe(false)});
  it("rejects an effective date before the decision",()=>expect(createDecisionSchema.safeParse({...valid,effectiveDate:"2026-07-31"}).success).toBe(false));
  it("accepts a complete correction",()=>expect(correctDecisionSchema.safeParse({...valid,decisionId:"20000000-0000-4000-8000-000000000001",correctionReason:"The committee name was recorded incorrectly.",confirmCorrection:"confirmed"}).success).toBe(true));
  it("requires correction reason and confirmation",()=>{const base={...valid,decisionId:"20000000-0000-4000-8000-000000000001",correctionReason:" ",confirmCorrection:""};expect(correctDecisionSchema.safeParse(base).success).toBe(false)});
  it("rejects correction audit injection",()=>expect(correctDecisionSchema.safeParse({...valid,decisionId:"20000000-0000-4000-8000-000000000001",correctionReason:"Fix",confirmCorrection:"confirmed",lastCorrectedBy:valid.projectId}).success).toBe(false));
});
describe("decision errors",()=>{it("maps errors without exposing database details",()=>{expect(getSafeDecisionError({code:"42501"})).toMatch(/permission/);expect(getSafeDecisionError({code:"23514"})).toMatch(/Review/);expect(getSafeDecisionError({code:"XX000"})).toMatch(/could not be saved/)})});
