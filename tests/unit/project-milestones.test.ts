import { describe, expect, it } from "vitest";
import { milestoneInputSchema, milestoneTransitionSchema } from "../../features/project-milestones/schemas";
import { getMilestoneScheduleLabel } from "../../features/project-milestones/schedule";

const valid={operation:"create",projectId:"11111111-1111-4111-8111-111111111111",title:"Design approved",description:"",targetDate:"2026-08-15"};
describe("milestone validation",()=>{
  it("accepts the documented title and description boundaries",()=>{expect(milestoneInputSchema.safeParse({...valid,title:"x".repeat(200),description:"x".repeat(4000)}).success).toBe(true)});
  it("rejects blank and overlong values",()=>{expect(milestoneInputSchema.safeParse({...valid,title:" "}).success).toBe(false);expect(milestoneInputSchema.safeParse({...valid,title:"x".repeat(201)}).success).toBe(false);expect(milestoneInputSchema.safeParse({...valid,description:"x".repeat(4001)}).success).toBe(false)});
  it("rejects impossible dates and update requests without an id",()=>{expect(milestoneInputSchema.safeParse({...valid,targetDate:"2026-02-30"}).success).toBe(false);expect(milestoneInputSchema.safeParse({...valid,operation:"update"}).success).toBe(false)});
  it("rejects injected immutable fields",()=>{expect(milestoneInputSchema.safeParse({...valid,status:"Completed",createdBy:valid.projectId}).success).toBe(false)});
  it("requires explicit terminal confirmation",()=>{expect(milestoneTransitionSchema.safeParse({projectId:valid.projectId,milestoneId:valid.projectId,status:"Completed",confirm:""}).success).toBe(false);expect(milestoneTransitionSchema.safeParse({projectId:valid.projectId,milestoneId:valid.projectId,status:"Cancelled",confirm:"confirmed"}).success).toBe(true)});
});
describe("milestone schedule labels",()=>{
  it.each([["2026-07-31","Overdue"],["2026-08-01","Due today"],["2026-08-02","Upcoming"],["2026-08-15","Upcoming"],["2026-08-16","Scheduled"]])("labels %s as %s",(date,label)=>expect(getMilestoneScheduleLabel(date,"Planned","2026-08-01")).toBe(label));
  it("uses terminal lifecycle status regardless of date",()=>{expect(getMilestoneScheduleLabel("2020-01-01","Completed","2026-08-01")).toBe("Completed");expect(getMilestoneScheduleLabel("2020-01-01","Cancelled","2026-08-01")).toBe("Cancelled")});
});
