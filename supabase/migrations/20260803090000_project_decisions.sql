create table public.project_decisions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete restrict,
  title text not null,
  context text not null,
  decision text not null,
  rationale text not null,
  alternatives_considered text not null,
  consequences text not null,
  decision_maker_name text not null,
  decision_date date not null,
  effective_date date,
  follow_up_notes text,
  correction_reason text,
  last_corrected_by uuid references public.profiles(id) on delete restrict,
  last_corrected_at timestamptz,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint project_decisions_title_check check (char_length(btrim(title)) between 1 and 200),
  constraint project_decisions_context_check check (char_length(btrim(context)) between 1 and 4000),
  constraint project_decisions_decision_check check (char_length(btrim(decision)) between 1 and 4000),
  constraint project_decisions_rationale_check check (char_length(btrim(rationale)) between 1 and 4000),
  constraint project_decisions_alternatives_check check (char_length(btrim(alternatives_considered)) between 1 and 4000),
  constraint project_decisions_consequences_check check (char_length(btrim(consequences)) between 1 and 4000),
  constraint project_decisions_maker_check check (char_length(btrim(decision_maker_name)) between 1 and 200),
  constraint project_decisions_date_check check (decision_date <= current_date),
  constraint project_decisions_effective_date_check check (effective_date is null or effective_date >= decision_date),
  constraint project_decisions_follow_up_check check (follow_up_notes is null or char_length(btrim(follow_up_notes)) between 1 and 4000),
  constraint project_decisions_correction_reason_check check (correction_reason is null or char_length(btrim(correction_reason)) between 1 and 4000),
  constraint project_decisions_correction_audit_check check (
    (correction_reason is null and last_corrected_by is null and last_corrected_at is null)
    or (correction_reason is not null and last_corrected_by is not null and last_corrected_at is not null)
  )
);

create index project_decisions_project_date_idx
  on public.project_decisions(project_id, decision_date desc, created_at desc, id);

create function private.protect_project_decision() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    if new.created_by <> auth.uid() or new.decision_date > current_date
      or new.correction_reason is not null or new.last_corrected_by is not null or new.last_corrected_at is not null then
      raise exception 'New decisions must use trusted initial audit values.' using errcode = '23514';
    end if;
  elsif new.id is distinct from old.id or new.project_id is distinct from old.project_id
    or new.created_by is distinct from old.created_by or new.created_at is distinct from old.created_at then
    raise exception 'Decision identity fields cannot be changed.' using errcode = '42501';
  end if;
  new.title := btrim(new.title);
  new.context := btrim(new.context);
  new.decision := btrim(new.decision);
  new.rationale := btrim(new.rationale);
  new.alternatives_considered := btrim(new.alternatives_considered);
  new.consequences := btrim(new.consequences);
  new.decision_maker_name := btrim(new.decision_maker_name);
  new.follow_up_notes := nullif(btrim(new.follow_up_notes), '');
  new.correction_reason := nullif(btrim(new.correction_reason), '');
  new.updated_at := now();
  return new;
end;
$$;

create trigger project_decisions_protect before insert or update on public.project_decisions
for each row execute function private.protect_project_decision();

alter table public.project_decisions enable row level security;
create policy project_decisions_select_project_access on public.project_decisions
for select to authenticated using (private.has_project_access(project_id));
revoke all on public.project_decisions from anon, authenticated;
grant select on public.project_decisions to authenticated;

create function public.create_project_decision(
  p_project_id uuid, p_title text, p_context text, p_decision text, p_rationale text,
  p_alternatives_considered text, p_consequences text, p_decision_maker_name text,
  p_decision_date date, p_effective_date date, p_follow_up_notes text
) returns public.project_decisions
language plpgsql security definer set search_path = '' as $$
declare result public.project_decisions%rowtype;
begin
  if auth.uid() is null or not private.can_manage_project(p_project_id) then
    raise exception 'Decision creation is not permitted.' using errcode = '42501';
  end if;
  if p_decision_date > current_date then
    raise exception 'Decision date cannot be in the future.' using errcode = '22023';
  end if;
  if p_effective_date is not null and p_effective_date < p_decision_date then
    raise exception 'Effective date cannot precede decision date.' using errcode = '22023';
  end if;
  insert into public.project_decisions(project_id,title,context,decision,rationale,alternatives_considered,consequences,decision_maker_name,decision_date,effective_date,follow_up_notes,created_by)
  values(p_project_id,p_title,p_context,p_decision,p_rationale,p_alternatives_considered,p_consequences,p_decision_maker_name,p_decision_date,p_effective_date,nullif(btrim(p_follow_up_notes),''),auth.uid())
  returning * into result;
  return result;
end;
$$;

create function public.correct_project_decision(
  p_decision_id uuid, p_title text, p_context text, p_decision text, p_rationale text,
  p_alternatives_considered text, p_consequences text, p_decision_maker_name text,
  p_decision_date date, p_effective_date date, p_follow_up_notes text, p_correction_reason text
) returns public.project_decisions
language plpgsql security definer set search_path = '' as $$
declare existing public.project_decisions%rowtype; result public.project_decisions%rowtype;
begin
  if auth.uid() is null then raise exception 'Authentication is required.' using errcode = '42501'; end if;
  select * into existing from public.project_decisions where id = p_decision_id for update;
  if existing.id is null or not private.can_manage_project(existing.project_id) then
    raise exception 'Decision correction is not permitted.' using errcode = '42501';
  end if;
  if nullif(btrim(p_correction_reason),'') is null then
    raise exception 'A correction reason is required.' using errcode = '22023';
  end if;
  if p_decision_date > current_date or (p_effective_date is not null and p_effective_date < p_decision_date) then
    raise exception 'Decision dates are invalid.' using errcode = '22023';
  end if;
  update public.project_decisions set title=p_title,context=p_context,decision=p_decision,rationale=p_rationale,
    alternatives_considered=p_alternatives_considered,consequences=p_consequences,decision_maker_name=p_decision_maker_name,
    decision_date=p_decision_date,effective_date=p_effective_date,follow_up_notes=nullif(btrim(p_follow_up_notes),''),
    correction_reason=p_correction_reason,last_corrected_by=auth.uid(),last_corrected_at=now()
  where id=p_decision_id returning * into result;
  return result;
end;
$$;

revoke all on function private.protect_project_decision() from public;
revoke all on function public.create_project_decision(uuid,text,text,text,text,text,text,text,date,date,text) from public;
revoke all on function public.correct_project_decision(uuid,text,text,text,text,text,text,text,date,date,text,text) from public;
grant execute on function public.create_project_decision(uuid,text,text,text,text,text,text,text,date,date,text) to authenticated;
grant execute on function public.correct_project_decision(uuid,text,text,text,text,text,text,text,date,date,text,text) to authenticated;
