export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      deliverables: {
        Row: {
          acceptance_criteria: string
          accepted_at: string | null
          accepted_by: string | null
          cancelled_at: string | null
          created_at: string
          created_by: string
          description: string | null
          due_date: string
          id: string
          milestone_id: string | null
          owner_membership_id: string
          project_id: string
          review_feedback: string | null
          status: string
          submitted_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          acceptance_criteria: string
          accepted_at?: string | null
          accepted_by?: string | null
          cancelled_at?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          due_date: string
          id?: string
          milestone_id?: string | null
          owner_membership_id: string
          project_id: string
          review_feedback?: string | null
          status?: string
          submitted_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          acceptance_criteria?: string
          accepted_at?: string | null
          accepted_by?: string | null
          cancelled_at?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string
          id?: string
          milestone_id?: string | null
          owner_membership_id?: string
          project_id?: string
          review_feedback?: string | null
          status?: string
          submitted_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deliverables_accepted_by_fkey"
            columns: ["accepted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliverables_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliverables_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliverables_owner_membership_id_fkey"
            columns: ["owner_membership_id"]
            isOneToOne: false
            referencedRelation: "project_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliverables_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          cancelled_at: string | null
          completed_at: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          project_id: string
          status: string
          target_date: string
          title: string
          updated_at: string
        }
        Insert: {
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          project_id: string
          status?: string
          target_date: string
          title: string
          updated_at?: string
        }
        Update: {
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          project_id?: string
          status?: string
          target_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          id: string
          joined_at: string
          organization_id: string
          role: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          joined_at?: string
          organization_id: string
          role: string
          status: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          joined_at?: string
          organization_id?: string
          role?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          job_title: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          job_title?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          job_title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_actions: {
        Row: {
          cancelled_at: string | null
          cancelled_by: string | null
          completed_at: string | null
          completed_by: string | null
          completion_notes: string | null
          created_at: string
          created_by: string
          description: string | null
          due_date: string
          id: string
          owner_membership_id: string
          priority: string
          project_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          cancelled_at?: string | null
          cancelled_by?: string | null
          completed_at?: string | null
          completed_by?: string | null
          completion_notes?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          due_date: string
          id?: string
          owner_membership_id: string
          priority: string
          project_id: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          cancelled_at?: string | null
          cancelled_by?: string | null
          completed_at?: string | null
          completed_by?: string | null
          completion_notes?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string
          id?: string
          owner_membership_id?: string
          priority?: string
          project_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_actions_cancelled_by_fkey"
            columns: ["cancelled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_actions_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_actions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_actions_owner_membership_id_fkey"
            columns: ["owner_membership_id"]
            isOneToOne: false
            referencedRelation: "project_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_actions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_assumptions: {
        Row: {
          category: string
          confidence: string
          created_at: string
          created_by: string
          description: string
          id: string
          impact_if_false: string
          invalidated_at: string | null
          invalidated_by: string | null
          outcome_notes: string | null
          owner_membership_id: string
          planning_rationale: string
          project_id: string
          recorded_date: string
          retired_at: string | null
          retired_by: string | null
          status: string
          title: string
          updated_at: string
          validated_at: string | null
          validated_by: string | null
          validation_due_date: string
          validation_evidence: string | null
          validation_method: string
        }
        Insert: {
          category: string
          confidence: string
          created_at?: string
          created_by: string
          description: string
          id?: string
          impact_if_false: string
          invalidated_at?: string | null
          invalidated_by?: string | null
          outcome_notes?: string | null
          owner_membership_id: string
          planning_rationale: string
          project_id: string
          recorded_date?: string
          retired_at?: string | null
          retired_by?: string | null
          status?: string
          title: string
          updated_at?: string
          validated_at?: string | null
          validated_by?: string | null
          validation_due_date: string
          validation_evidence?: string | null
          validation_method: string
        }
        Update: {
          category?: string
          confidence?: string
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          impact_if_false?: string
          invalidated_at?: string | null
          invalidated_by?: string | null
          outcome_notes?: string | null
          owner_membership_id?: string
          planning_rationale?: string
          project_id?: string
          recorded_date?: string
          retired_at?: string | null
          retired_by?: string | null
          status?: string
          title?: string
          updated_at?: string
          validated_at?: string | null
          validated_by?: string | null
          validation_due_date?: string
          validation_evidence?: string | null
          validation_method?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_assumptions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_assumptions_invalidated_by_fkey"
            columns: ["invalidated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_assumptions_owner_membership_id_fkey"
            columns: ["owner_membership_id"]
            isOneToOne: false
            referencedRelation: "project_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_assumptions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_assumptions_retired_by_fkey"
            columns: ["retired_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_assumptions_validated_by_fkey"
            columns: ["validated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_change_requests: {
        Row: {
          budget_impact: string | null
          category: string
          created_at: string
          created_by: string
          decided_at: string | null
          decided_by: string | null
          decision_notes: string | null
          description: string
          id: string
          implementation_outcome_notes: string | null
          implementation_owner_membership_id: string | null
          implementation_plan_updated_at: string | null
          implementation_plan_updated_by: string | null
          implementation_started_at: string | null
          implementation_started_by: string | null
          implementation_target_date: string | null
          last_edited_at: string
          last_edited_by: string
          outcome_recorded_at: string | null
          outcome_recorded_by: string | null
          project_id: string
          quality_impact: string | null
          reason: string
          recommendation: string | null
          requested_date: string
          requester_name: string
          resource_impact: string | null
          risk_impact: string | null
          schedule_impact: string | null
          scope_impact: string | null
          status: string
          submitted_at: string | null
          submitted_by: string | null
          title: string
          updated_at: string
          withdrawal_notes: string | null
          withdrawn_at: string | null
          withdrawn_by: string | null
        }
        Insert: {
          budget_impact?: string | null
          category: string
          created_at?: string
          created_by: string
          decided_at?: string | null
          decided_by?: string | null
          decision_notes?: string | null
          description: string
          id?: string
          implementation_outcome_notes?: string | null
          implementation_owner_membership_id?: string | null
          implementation_plan_updated_at?: string | null
          implementation_plan_updated_by?: string | null
          implementation_started_at?: string | null
          implementation_started_by?: string | null
          implementation_target_date?: string | null
          last_edited_at?: string
          last_edited_by: string
          outcome_recorded_at?: string | null
          outcome_recorded_by?: string | null
          project_id: string
          quality_impact?: string | null
          reason: string
          recommendation?: string | null
          requested_date: string
          requester_name: string
          resource_impact?: string | null
          risk_impact?: string | null
          schedule_impact?: string | null
          scope_impact?: string | null
          status?: string
          submitted_at?: string | null
          submitted_by?: string | null
          title: string
          updated_at?: string
          withdrawal_notes?: string | null
          withdrawn_at?: string | null
          withdrawn_by?: string | null
        }
        Update: {
          budget_impact?: string | null
          category?: string
          created_at?: string
          created_by?: string
          decided_at?: string | null
          decided_by?: string | null
          decision_notes?: string | null
          description?: string
          id?: string
          implementation_outcome_notes?: string | null
          implementation_owner_membership_id?: string | null
          implementation_plan_updated_at?: string | null
          implementation_plan_updated_by?: string | null
          implementation_started_at?: string | null
          implementation_started_by?: string | null
          implementation_target_date?: string | null
          last_edited_at?: string
          last_edited_by?: string
          outcome_recorded_at?: string | null
          outcome_recorded_by?: string | null
          project_id?: string
          quality_impact?: string | null
          reason?: string
          recommendation?: string | null
          requested_date?: string
          requester_name?: string
          resource_impact?: string | null
          risk_impact?: string | null
          schedule_impact?: string | null
          scope_impact?: string | null
          status?: string
          submitted_at?: string | null
          submitted_by?: string | null
          title?: string
          updated_at?: string
          withdrawal_notes?: string | null
          withdrawn_at?: string | null
          withdrawn_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_change_requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_change_requests_decided_by_fkey"
            columns: ["decided_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_change_requests_implementation_owner_membership_id_fkey"
            columns: ["implementation_owner_membership_id"]
            isOneToOne: false
            referencedRelation: "project_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_change_requests_implementation_plan_updated_by_fkey"
            columns: ["implementation_plan_updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_change_requests_implementation_started_by_fkey"
            columns: ["implementation_started_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_change_requests_last_edited_by_fkey"
            columns: ["last_edited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_change_requests_outcome_recorded_by_fkey"
            columns: ["outcome_recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_change_requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_change_requests_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_change_requests_withdrawn_by_fkey"
            columns: ["withdrawn_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_decisions: {
        Row: {
          alternatives_considered: string
          consequences: string
          context: string
          correction_reason: string | null
          created_at: string
          created_by: string
          decision: string
          decision_date: string
          decision_maker_name: string
          effective_date: string | null
          follow_up_notes: string | null
          id: string
          last_corrected_at: string | null
          last_corrected_by: string | null
          project_id: string
          rationale: string
          title: string
          updated_at: string
        }
        Insert: {
          alternatives_considered: string
          consequences: string
          context: string
          correction_reason?: string | null
          created_at?: string
          created_by: string
          decision: string
          decision_date: string
          decision_maker_name: string
          effective_date?: string | null
          follow_up_notes?: string | null
          id?: string
          last_corrected_at?: string | null
          last_corrected_by?: string | null
          project_id: string
          rationale: string
          title: string
          updated_at?: string
        }
        Update: {
          alternatives_considered?: string
          consequences?: string
          context?: string
          correction_reason?: string | null
          created_at?: string
          created_by?: string
          decision?: string
          decision_date?: string
          decision_maker_name?: string
          effective_date?: string | null
          follow_up_notes?: string | null
          id?: string
          last_corrected_at?: string | null
          last_corrected_by?: string | null
          project_id?: string
          rationale?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_decisions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_decisions_last_corrected_by_fkey"
            columns: ["last_corrected_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_decisions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_dependencies: {
        Row: {
          classification: string
          created_at: string
          created_by: string
          description: string
          failed_at: string | null
          failed_by: string | null
          id: string
          identified_date: string
          impact_if_missed: string
          management_plan: string
          needed_by_date: string
          no_longer_required_at: string | null
          no_longer_required_by: string | null
          outcome_notes: string | null
          owner_membership_id: string
          project_id: string
          provider_name: string
          required_for: string
          required_outcome: string
          satisfaction_evidence: string | null
          satisfied_at: string | null
          satisfied_by: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          classification: string
          created_at?: string
          created_by: string
          description: string
          failed_at?: string | null
          failed_by?: string | null
          id?: string
          identified_date: string
          impact_if_missed: string
          management_plan: string
          needed_by_date: string
          no_longer_required_at?: string | null
          no_longer_required_by?: string | null
          outcome_notes?: string | null
          owner_membership_id: string
          project_id: string
          provider_name: string
          required_for: string
          required_outcome: string
          satisfaction_evidence?: string | null
          satisfied_at?: string | null
          satisfied_by?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          classification?: string
          created_at?: string
          created_by?: string
          description?: string
          failed_at?: string | null
          failed_by?: string | null
          id?: string
          identified_date?: string
          impact_if_missed?: string
          management_plan?: string
          needed_by_date?: string
          no_longer_required_at?: string | null
          no_longer_required_by?: string | null
          outcome_notes?: string | null
          owner_membership_id?: string
          project_id?: string
          provider_name?: string
          required_for?: string
          required_outcome?: string
          satisfaction_evidence?: string | null
          satisfied_at?: string | null
          satisfied_by?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_dependencies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_dependencies_failed_by_fkey"
            columns: ["failed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_dependencies_no_longer_required_by_fkey"
            columns: ["no_longer_required_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_dependencies_owner_membership_id_fkey"
            columns: ["owner_membership_id"]
            isOneToOne: false
            referencedRelation: "project_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_dependencies_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_dependencies_satisfied_by_fkey"
            columns: ["satisfied_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_issues: {
        Row: {
          blocked_reason: string | null
          cancellation_notes: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          category: string
          created_at: string
          created_by: string
          current_impact: string
          description: string
          id: string
          identified_date: string
          originating_risk_id: string | null
          owner_membership_id: string
          project_id: string
          resolution_notes: string | null
          resolution_plan: string
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          status: string
          target_resolution_date: string
          title: string
          updated_at: string
        }
        Insert: {
          blocked_reason?: string | null
          cancellation_notes?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          category: string
          created_at?: string
          created_by: string
          current_impact: string
          description: string
          id?: string
          identified_date?: string
          originating_risk_id?: string | null
          owner_membership_id: string
          project_id: string
          resolution_notes?: string | null
          resolution_plan: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          status?: string
          target_resolution_date: string
          title: string
          updated_at?: string
        }
        Update: {
          blocked_reason?: string | null
          cancellation_notes?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          category?: string
          created_at?: string
          created_by?: string
          current_impact?: string
          description?: string
          id?: string
          identified_date?: string
          originating_risk_id?: string | null
          owner_membership_id?: string
          project_id?: string
          resolution_notes?: string | null
          resolution_plan?: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          status?: string
          target_resolution_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_issues_cancelled_by_fkey"
            columns: ["cancelled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_issues_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_issues_origin_project_fkey"
            columns: ["originating_risk_id", "project_id"]
            isOneToOne: false
            referencedRelation: "project_risks"
            referencedColumns: ["id", "project_id"]
          },
          {
            foreignKeyName: "project_issues_owner_membership_id_fkey"
            columns: ["owner_membership_id"]
            isOneToOne: false
            referencedRelation: "project_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_issues_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_issues_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_members: {
        Row: {
          access_level: string
          created_at: string
          id: string
          joined_at: string
          left_at: string | null
          project_id: string
          project_role: string | null
          responsibilities: string | null
          user_id: string
        }
        Insert: {
          access_level: string
          created_at?: string
          id?: string
          joined_at?: string
          left_at?: string | null
          project_id: string
          project_role?: string | null
          responsibilities?: string | null
          user_id: string
        }
        Update: {
          access_level?: string
          created_at?: string
          id?: string
          joined_at?: string
          left_at?: string | null
          project_id?: string
          project_role?: string | null
          responsibilities?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_risks: {
        Row: {
          category: string
          closed_at: string | null
          closed_by: string | null
          closure_notes: string | null
          created_at: string
          created_by: string
          description: string
          id: string
          impact: number
          owner_membership_id: string
          probability: number
          project_id: string
          realization_notes: string | null
          realized_at: string | null
          realized_by: string | null
          response_plan: string
          response_strategy: string
          review_date: string
          risk_score: number | null
          risk_type: string
          status: string
          title: string
          trigger: string | null
          updated_at: string
        }
        Insert: {
          category: string
          closed_at?: string | null
          closed_by?: string | null
          closure_notes?: string | null
          created_at?: string
          created_by: string
          description: string
          id?: string
          impact: number
          owner_membership_id: string
          probability: number
          project_id: string
          realization_notes?: string | null
          realized_at?: string | null
          realized_by?: string | null
          response_plan: string
          response_strategy: string
          review_date: string
          risk_score?: number | null
          risk_type: string
          status?: string
          title: string
          trigger?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          closed_at?: string | null
          closed_by?: string | null
          closure_notes?: string | null
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          impact?: number
          owner_membership_id?: string
          probability?: number
          project_id?: string
          realization_notes?: string | null
          realized_at?: string | null
          realized_by?: string | null
          response_plan?: string
          response_strategy?: string
          review_date?: string
          risk_score?: number | null
          risk_type?: string
          status?: string
          title?: string
          trigger?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_risks_closed_by_fkey"
            columns: ["closed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_risks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_risks_owner_membership_id_fkey"
            columns: ["owner_membership_id"]
            isOneToOne: false
            referencedRelation: "project_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_risks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_risks_realized_by_fkey"
            columns: ["realized_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_status_reports: {
        Row: {
          accomplishments: string
          budget_health: string
          concerns: string | null
          created_at: string
          created_by: string
          decisions_required: string | null
          executive_summary: string
          id: string
          last_edited_at: string
          last_edited_by: string
          overall_health: string
          overdue_actions_snapshot: Json | null
          planned_work: string
          project_id: string
          project_lifecycle_phase_snapshot: string | null
          project_name_snapshot: string | null
          project_status_snapshot: string | null
          published_at: string | null
          published_by: string | null
          recent_decisions_snapshot: Json | null
          reporting_period_end: string
          reporting_period_start: string
          resource_health: string
          risk_health: string
          schedule_health: string
          scope_health: string
          status: string
          support_required: string | null
          top_issues_snapshot: Json | null
          top_risks_snapshot: Json | null
          upcoming_milestones_snapshot: Json | null
        }
        Insert: {
          accomplishments: string
          budget_health: string
          concerns?: string | null
          created_at?: string
          created_by: string
          decisions_required?: string | null
          executive_summary: string
          id?: string
          last_edited_at?: string
          last_edited_by: string
          overall_health: string
          overdue_actions_snapshot?: Json | null
          planned_work: string
          project_id: string
          project_lifecycle_phase_snapshot?: string | null
          project_name_snapshot?: string | null
          project_status_snapshot?: string | null
          published_at?: string | null
          published_by?: string | null
          recent_decisions_snapshot?: Json | null
          reporting_period_end: string
          reporting_period_start: string
          resource_health: string
          risk_health: string
          schedule_health: string
          scope_health: string
          status?: string
          support_required?: string | null
          top_issues_snapshot?: Json | null
          top_risks_snapshot?: Json | null
          upcoming_milestones_snapshot?: Json | null
        }
        Update: {
          accomplishments?: string
          budget_health?: string
          concerns?: string | null
          created_at?: string
          created_by?: string
          decisions_required?: string | null
          executive_summary?: string
          id?: string
          last_edited_at?: string
          last_edited_by?: string
          overall_health?: string
          overdue_actions_snapshot?: Json | null
          planned_work?: string
          project_id?: string
          project_lifecycle_phase_snapshot?: string | null
          project_name_snapshot?: string | null
          project_status_snapshot?: string | null
          published_at?: string | null
          published_by?: string | null
          recent_decisions_snapshot?: Json | null
          reporting_period_end?: string
          reporting_period_start?: string
          resource_health?: string
          risk_health?: string
          schedule_health?: string
          scope_health?: string
          status?: string
          support_required?: string | null
          top_issues_snapshot?: Json | null
          top_risks_snapshot?: Json | null
          upcoming_milestones_snapshot?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "project_status_reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_status_reports_last_edited_by_fkey"
            columns: ["last_edited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_status_reports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_status_reports_published_by_fkey"
            columns: ["published_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          actual_completion_date: string | null
          budget_health: string
          business_objective: string
          closed_at: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          lifecycle_phase: string
          name: string
          organization_id: string
          overall_health: string
          project_manager_id: string
          resource_health: string
          risk_health: string
          schedule_health: string
          scope_health: string
          sponsor_email: string | null
          sponsor_name: string
          start_date: string
          status: string
          target_completion_date: string
          updated_at: string
        }
        Insert: {
          actual_completion_date?: string | null
          budget_health: string
          business_objective: string
          closed_at?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          lifecycle_phase: string
          name: string
          organization_id: string
          overall_health: string
          project_manager_id: string
          resource_health: string
          risk_health: string
          schedule_health: string
          scope_health: string
          sponsor_email?: string | null
          sponsor_name: string
          start_date: string
          status: string
          target_completion_date: string
          updated_at?: string
        }
        Update: {
          actual_completion_date?: string | null
          budget_health?: string
          business_objective?: string
          closed_at?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          lifecycle_phase?: string
          name?: string
          organization_id?: string
          overall_health?: string
          project_manager_id?: string
          resource_health?: string
          risk_health?: string
          schedule_health?: string
          scope_health?: string
          sponsor_email?: string | null
          sponsor_name?: string
          start_date?: string
          status?: string
          target_completion_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_project_manager_id_fkey"
            columns: ["project_manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_project_change_request: {
        Args: {
          p_confirm: boolean
          p_id: string
          p_notes: string
          p_owner: string
          p_target: string
        }
        Returns: {
          budget_impact: string | null
          category: string
          created_at: string
          created_by: string
          decided_at: string | null
          decided_by: string | null
          decision_notes: string | null
          description: string
          id: string
          implementation_outcome_notes: string | null
          implementation_owner_membership_id: string | null
          implementation_plan_updated_at: string | null
          implementation_plan_updated_by: string | null
          implementation_started_at: string | null
          implementation_started_by: string | null
          implementation_target_date: string | null
          last_edited_at: string
          last_edited_by: string
          outcome_recorded_at: string | null
          outcome_recorded_by: string | null
          project_id: string
          quality_impact: string | null
          reason: string
          recommendation: string | null
          requested_date: string
          requester_name: string
          resource_impact: string | null
          risk_impact: string | null
          schedule_impact: string | null
          scope_impact: string | null
          status: string
          submitted_at: string | null
          submitted_by: string | null
          title: string
          updated_at: string
          withdrawal_notes: string | null
          withdrawn_at: string | null
          withdrawn_by: string | null
        }
        SetofOptions: {
          from: "*"
          to: "project_change_requests"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      cancel_project_issue: {
        Args: { p_cancellation_notes: string; p_issue_id: string }
        Returns: {
          blocked_reason: string | null
          cancellation_notes: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          category: string
          created_at: string
          created_by: string
          current_impact: string
          description: string
          id: string
          identified_date: string
          originating_risk_id: string | null
          owner_membership_id: string
          project_id: string
          resolution_notes: string | null
          resolution_plan: string
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          status: string
          target_resolution_date: string
          title: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "project_issues"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      complete_onboarding: {
        Args: {
          p_avatar_url?: string
          p_description?: string
          p_full_name: string
          p_job_title?: string
          p_organization_name: string
        }
        Returns: string
      }
      complete_project_change_request: {
        Args: { p_confirm: boolean; p_id: string; p_notes: string }
        Returns: {
          budget_impact: string | null
          category: string
          created_at: string
          created_by: string
          decided_at: string | null
          decided_by: string | null
          decision_notes: string | null
          description: string
          id: string
          implementation_outcome_notes: string | null
          implementation_owner_membership_id: string | null
          implementation_plan_updated_at: string | null
          implementation_plan_updated_by: string | null
          implementation_started_at: string | null
          implementation_started_by: string | null
          implementation_target_date: string | null
          last_edited_at: string
          last_edited_by: string
          outcome_recorded_at: string | null
          outcome_recorded_by: string | null
          project_id: string
          quality_impact: string | null
          reason: string
          recommendation: string | null
          requested_date: string
          requester_name: string
          resource_impact: string | null
          risk_impact: string | null
          schedule_impact: string | null
          scope_impact: string | null
          status: string
          submitted_at: string | null
          submitted_by: string | null
          title: string
          updated_at: string
          withdrawal_notes: string | null
          withdrawn_at: string | null
          withdrawn_by: string | null
        }
        SetofOptions: {
          from: "*"
          to: "project_change_requests"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      conclude_project_dependency: {
        Args: {
          p_dependency_id: string
          p_outcome: string
          p_outcome_notes: string
          p_satisfaction_evidence: string
        }
        Returns: {
          classification: string
          created_at: string
          created_by: string
          description: string
          failed_at: string | null
          failed_by: string | null
          id: string
          identified_date: string
          impact_if_missed: string
          management_plan: string
          needed_by_date: string
          no_longer_required_at: string | null
          no_longer_required_by: string | null
          outcome_notes: string | null
          owner_membership_id: string
          project_id: string
          provider_name: string
          required_for: string
          required_outcome: string
          satisfaction_evidence: string | null
          satisfied_at: string | null
          satisfied_by: string | null
          status: string
          title: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "project_dependencies"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      correct_project_decision: {
        Args: {
          p_alternatives_considered: string
          p_consequences: string
          p_context: string
          p_correction_reason: string
          p_decision: string
          p_decision_date: string
          p_decision_id: string
          p_decision_maker_name: string
          p_effective_date: string
          p_follow_up_notes: string
          p_rationale: string
          p_title: string
        }
        Returns: {
          alternatives_considered: string
          consequences: string
          context: string
          correction_reason: string | null
          created_at: string
          created_by: string
          decision: string
          decision_date: string
          decision_maker_name: string
          effective_date: string | null
          follow_up_notes: string | null
          id: string
          last_corrected_at: string | null
          last_corrected_by: string | null
          project_id: string
          rationale: string
          title: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "project_decisions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_project: {
        Args: {
          p_actual_completion_date: string
          p_budget_health: string
          p_business_objective: string
          p_description: string
          p_lifecycle_phase: string
          p_name: string
          p_organization_id: string
          p_overall_health: string
          p_resource_health: string
          p_risk_health: string
          p_schedule_health: string
          p_scope_health: string
          p_sponsor_email: string
          p_sponsor_name: string
          p_start_date: string
          p_status: string
          p_target_completion_date: string
        }
        Returns: string
      }
      create_project_action: {
        Args: {
          p_description: string
          p_due_date: string
          p_owner_membership_id: string
          p_priority: string
          p_project_id: string
          p_title: string
        }
        Returns: {
          cancelled_at: string | null
          cancelled_by: string | null
          completed_at: string | null
          completed_by: string | null
          completion_notes: string | null
          created_at: string
          created_by: string
          description: string | null
          due_date: string
          id: string
          owner_membership_id: string
          priority: string
          project_id: string
          status: string
          title: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "project_actions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_project_assumption: {
        Args: {
          p_category: string
          p_confidence: string
          p_description: string
          p_impact_if_false: string
          p_owner_membership_id: string
          p_planning_rationale: string
          p_project_id: string
          p_recorded_date: string
          p_title: string
          p_validation_due_date: string
          p_validation_evidence?: string
          p_validation_method: string
        }
        Returns: {
          category: string
          confidence: string
          created_at: string
          created_by: string
          description: string
          id: string
          impact_if_false: string
          invalidated_at: string | null
          invalidated_by: string | null
          outcome_notes: string | null
          owner_membership_id: string
          planning_rationale: string
          project_id: string
          recorded_date: string
          retired_at: string | null
          retired_by: string | null
          status: string
          title: string
          updated_at: string
          validated_at: string | null
          validated_by: string | null
          validation_due_date: string
          validation_evidence: string | null
          validation_method: string
        }
        SetofOptions: {
          from: "*"
          to: "project_assumptions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_project_change_request: {
        Args: {
          p_budget: string
          p_category: string
          p_description: string
          p_project_id: string
          p_quality: string
          p_reason: string
          p_recommendation: string
          p_requested_date: string
          p_requester_name: string
          p_resource: string
          p_risk: string
          p_schedule: string
          p_scope: string
          p_title: string
        }
        Returns: {
          budget_impact: string | null
          category: string
          created_at: string
          created_by: string
          decided_at: string | null
          decided_by: string | null
          decision_notes: string | null
          description: string
          id: string
          implementation_outcome_notes: string | null
          implementation_owner_membership_id: string | null
          implementation_plan_updated_at: string | null
          implementation_plan_updated_by: string | null
          implementation_started_at: string | null
          implementation_started_by: string | null
          implementation_target_date: string | null
          last_edited_at: string
          last_edited_by: string
          outcome_recorded_at: string | null
          outcome_recorded_by: string | null
          project_id: string
          quality_impact: string | null
          reason: string
          recommendation: string | null
          requested_date: string
          requester_name: string
          resource_impact: string | null
          risk_impact: string | null
          schedule_impact: string | null
          scope_impact: string | null
          status: string
          submitted_at: string | null
          submitted_by: string | null
          title: string
          updated_at: string
          withdrawal_notes: string | null
          withdrawn_at: string | null
          withdrawn_by: string | null
        }
        SetofOptions: {
          from: "*"
          to: "project_change_requests"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_project_decision: {
        Args: {
          p_alternatives_considered: string
          p_consequences: string
          p_context: string
          p_decision: string
          p_decision_date: string
          p_decision_maker_name: string
          p_effective_date: string
          p_follow_up_notes: string
          p_project_id: string
          p_rationale: string
          p_title: string
        }
        Returns: {
          alternatives_considered: string
          consequences: string
          context: string
          correction_reason: string | null
          created_at: string
          created_by: string
          decision: string
          decision_date: string
          decision_maker_name: string
          effective_date: string | null
          follow_up_notes: string | null
          id: string
          last_corrected_at: string | null
          last_corrected_by: string | null
          project_id: string
          rationale: string
          title: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "project_decisions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_project_dependency: {
        Args: {
          p_classification: string
          p_description: string
          p_identified_date: string
          p_impact_if_missed: string
          p_management_plan: string
          p_needed_by_date: string
          p_owner_membership_id: string
          p_project_id: string
          p_provider_name: string
          p_required_for: string
          p_required_outcome: string
          p_title: string
        }
        Returns: {
          classification: string
          created_at: string
          created_by: string
          description: string
          failed_at: string | null
          failed_by: string | null
          id: string
          identified_date: string
          impact_if_missed: string
          management_plan: string
          needed_by_date: string
          no_longer_required_at: string | null
          no_longer_required_by: string | null
          outcome_notes: string | null
          owner_membership_id: string
          project_id: string
          provider_name: string
          required_for: string
          required_outcome: string
          satisfaction_evidence: string | null
          satisfied_at: string | null
          satisfied_by: string | null
          status: string
          title: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "project_dependencies"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_project_issue: {
        Args: {
          p_category: string
          p_current_impact: string
          p_description: string
          p_identified_date: string
          p_originating_risk_id?: string
          p_owner_membership_id: string
          p_project_id: string
          p_resolution_plan: string
          p_severity: string
          p_target_resolution_date: string
          p_title: string
        }
        Returns: {
          blocked_reason: string | null
          cancellation_notes: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          category: string
          created_at: string
          created_by: string
          current_impact: string
          description: string
          id: string
          identified_date: string
          originating_risk_id: string | null
          owner_membership_id: string
          project_id: string
          resolution_notes: string | null
          resolution_plan: string
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          status: string
          target_resolution_date: string
          title: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "project_issues"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_project_risk: {
        Args: {
          p_category: string
          p_description: string
          p_impact: number
          p_owner_membership_id: string
          p_probability: number
          p_project_id: string
          p_response_plan: string
          p_response_strategy: string
          p_review_date: string
          p_risk_type: string
          p_title: string
          p_trigger: string
        }
        Returns: {
          category: string
          closed_at: string | null
          closed_by: string | null
          closure_notes: string | null
          created_at: string
          created_by: string
          description: string
          id: string
          impact: number
          owner_membership_id: string
          probability: number
          project_id: string
          realization_notes: string | null
          realized_at: string | null
          realized_by: string | null
          response_plan: string
          response_strategy: string
          review_date: string
          risk_score: number | null
          risk_type: string
          status: string
          title: string
          trigger: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "project_risks"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_project_status_report: {
        Args: {
          p_accomplishments: string
          p_budget_health: string
          p_concerns: string
          p_decisions_required: string
          p_executive_summary: string
          p_overall_health: string
          p_planned_work: string
          p_project_id: string
          p_reporting_period_end: string
          p_reporting_period_start: string
          p_resource_health: string
          p_risk_health: string
          p_schedule_health: string
          p_scope_health: string
          p_support_required: string
        }
        Returns: {
          accomplishments: string
          budget_health: string
          concerns: string | null
          created_at: string
          created_by: string
          decisions_required: string | null
          executive_summary: string
          id: string
          last_edited_at: string
          last_edited_by: string
          overall_health: string
          overdue_actions_snapshot: Json | null
          planned_work: string
          project_id: string
          project_lifecycle_phase_snapshot: string | null
          project_name_snapshot: string | null
          project_status_snapshot: string | null
          published_at: string | null
          published_by: string | null
          recent_decisions_snapshot: Json | null
          reporting_period_end: string
          reporting_period_start: string
          resource_health: string
          risk_health: string
          schedule_health: string
          scope_health: string
          status: string
          support_required: string | null
          top_issues_snapshot: Json | null
          top_risks_snapshot: Json | null
          upcoming_milestones_snapshot: Json | null
        }
        SetofOptions: {
          from: "*"
          to: "project_status_reports"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      fail_project_dependency: {
        Args: { p_dependency_id: string; p_outcome_notes: string }
        Returns: {
          classification: string
          created_at: string
          created_by: string
          description: string
          failed_at: string | null
          failed_by: string | null
          id: string
          identified_date: string
          impact_if_missed: string
          management_plan: string
          needed_by_date: string
          no_longer_required_at: string | null
          no_longer_required_by: string | null
          outcome_notes: string | null
          owner_membership_id: string
          project_id: string
          provider_name: string
          required_for: string
          required_outcome: string
          satisfaction_evidence: string | null
          satisfied_at: string | null
          satisfied_by: string | null
          status: string
          title: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "project_dependencies"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_assignable_deliverable_milestones: {
        Args: { p_project_id: string }
        Returns: {
          id: string
          target_date: string
          title: string
        }[]
      }
      get_eligible_action_owners: {
        Args: { p_project_id: string }
        Returns: {
          access_level: string
          full_name: string
          membership_id: string
          user_id: string
        }[]
      }
      get_eligible_assumption_owners: {
        Args: { p_project_id: string }
        Returns: {
          access_level: string
          full_name: string
          membership_id: string
          user_id: string
        }[]
      }
      get_eligible_change_owners: {
        Args: { p_project_id: string }
        Returns: {
          access_level: string
          full_name: string
          membership_id: string
          user_id: string
        }[]
      }
      get_eligible_deliverable_owners: {
        Args: { p_project_id: string }
        Returns: {
          access_level: string
          full_name: string
          membership_id: string
          user_id: string
        }[]
      }
      get_eligible_dependency_owners: {
        Args: { p_project_id: string }
        Returns: {
          access_level: string
          full_name: string
          membership_id: string
          user_id: string
        }[]
      }
      get_eligible_issue_origins: {
        Args: { p_project_id: string }
        Returns: {
          realized_at: string
          risk_id: string
          title: string
        }[]
      }
      get_eligible_issue_owners: {
        Args: { p_project_id: string }
        Returns: {
          access_level: string
          full_name: string
          membership_id: string
          user_id: string
        }[]
      }
      get_eligible_project_members: {
        Args: { p_project_id: string }
        Returns: {
          email: string
          existing_access_level: string
          full_name: string
          user_id: string
        }[]
      }
      get_eligible_risk_owners: {
        Args: { p_project_id: string }
        Returns: {
          access_level: string
          full_name: string
          membership_id: string
          user_id: string
        }[]
      }
      get_project_actions: {
        Args: { p_project_id: string }
        Returns: {
          cancelled_at: string
          cancelled_by: string
          cancelled_by_name: string
          completed_at: string
          completed_by: string
          completed_by_name: string
          completion_notes: string
          created_at: string
          created_by: string
          created_by_name: string
          description: string
          due_date: string
          id: string
          owner_access_level: string
          owner_membership_id: string
          owner_name: string
          owner_user_id: string
          priority: string
          project_id: string
          status: string
          title: string
          updated_at: string
        }[]
      }
      get_project_assumptions: {
        Args: { p_project_id: string }
        Returns: {
          category: string
          confidence: string
          created_at: string
          created_by: string
          created_by_name: string
          description: string
          id: string
          impact_if_false: string
          invalidated_at: string
          invalidated_by: string
          invalidated_by_name: string
          outcome_notes: string
          owner_access_level: string
          owner_is_eligible: boolean
          owner_membership_id: string
          owner_name: string
          owner_user_id: string
          planning_rationale: string
          project_id: string
          recorded_date: string
          retired_at: string
          retired_by: string
          retired_by_name: string
          status: string
          title: string
          updated_at: string
          validated_at: string
          validated_by: string
          validated_by_name: string
          validation_due_date: string
          validation_evidence: string
          validation_method: string
        }[]
      }
      get_project_deliverables: {
        Args: { p_project_id: string }
        Returns: {
          acceptance_criteria: string
          accepted_at: string
          accepted_by: string
          accepted_by_name: string
          cancelled_at: string
          created_at: string
          description: string
          due_date: string
          id: string
          milestone_id: string
          milestone_title: string
          owner_access_level: string
          owner_membership_id: string
          owner_name: string
          project_id: string
          review_feedback: string
          status: string
          submitted_at: string
          title: string
          updated_at: string
        }[]
      }
      get_project_dependencies: {
        Args: { p_project_id: string }
        Returns: {
          classification: string
          created_at: string
          created_by: string
          created_by_name: string
          description: string
          failed_at: string
          failed_by: string
          failed_by_name: string
          id: string
          identified_date: string
          impact_if_missed: string
          management_plan: string
          needed_by_date: string
          no_longer_required_at: string
          no_longer_required_by: string
          no_longer_required_by_name: string
          outcome_notes: string
          owner_access_level: string
          owner_is_eligible: boolean
          owner_membership_id: string
          owner_name: string
          owner_user_id: string
          project_id: string
          provider_name: string
          required_for: string
          required_outcome: string
          satisfaction_evidence: string
          satisfied_at: string
          satisfied_by: string
          satisfied_by_name: string
          status: string
          title: string
          updated_at: string
        }[]
      }
      get_project_issues: {
        Args: { p_project_id: string }
        Returns: {
          blocked_reason: string
          cancellation_notes: string
          cancelled_at: string
          cancelled_by: string
          cancelled_by_name: string
          category: string
          created_at: string
          created_by: string
          created_by_name: string
          current_impact: string
          description: string
          id: string
          identified_date: string
          originating_risk_id: string
          originating_risk_realized_at: string
          originating_risk_status: string
          originating_risk_title: string
          owner_access_level: string
          owner_is_eligible: boolean
          owner_membership_id: string
          owner_name: string
          owner_user_id: string
          project_id: string
          resolution_notes: string
          resolution_plan: string
          resolved_at: string
          resolved_by: string
          resolved_by_name: string
          severity: string
          status: string
          target_resolution_date: string
          title: string
          updated_at: string
        }[]
      }
      get_project_risks: {
        Args: { p_project_id: string }
        Returns: {
          category: string
          closed_at: string
          closed_by: string
          closed_by_name: string
          closure_notes: string
          created_at: string
          created_by: string
          created_by_name: string
          description: string
          id: string
          impact: number
          owner_access_level: string
          owner_is_eligible: boolean
          owner_membership_id: string
          owner_name: string
          owner_user_id: string
          probability: number
          project_id: string
          realization_notes: string
          realized_at: string
          realized_by: string
          realized_by_name: string
          response_plan: string
          response_strategy: string
          review_date: string
          risk_score: number
          risk_type: string
          status: string
          title: string
          trigger: string
          updated_at: string
        }[]
      }
      get_project_team: {
        Args: { p_project_id: string }
        Returns: {
          access_level: string
          active: boolean
          email: string
          full_name: string
          is_assigned_manager: boolean
          membership_id: string
          user_id: string
        }[]
      }
      invalidate_project_assumption: {
        Args: {
          p_assumption_id: string
          p_outcome_notes: string
          p_validation_evidence: string
        }
        Returns: {
          category: string
          confidence: string
          created_at: string
          created_by: string
          description: string
          id: string
          impact_if_false: string
          invalidated_at: string | null
          invalidated_by: string | null
          outcome_notes: string | null
          owner_membership_id: string
          planning_rationale: string
          project_id: string
          recorded_date: string
          retired_at: string | null
          retired_by: string | null
          status: string
          title: string
          updated_at: string
          validated_at: string | null
          validated_by: string | null
          validation_due_date: string
          validation_evidence: string | null
          validation_method: string
        }
        SetofOptions: {
          from: "*"
          to: "project_assumptions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      manage_project_membership: {
        Args: {
          p_access_level: string
          p_active: boolean
          p_project_id: string
          p_user_id: string
        }
        Returns: string
      }
      mark_project_change_request_not_implemented: {
        Args: { p_confirm: boolean; p_id: string; p_notes: string }
        Returns: {
          budget_impact: string | null
          category: string
          created_at: string
          created_by: string
          decided_at: string | null
          decided_by: string | null
          decision_notes: string | null
          description: string
          id: string
          implementation_outcome_notes: string | null
          implementation_owner_membership_id: string | null
          implementation_plan_updated_at: string | null
          implementation_plan_updated_by: string | null
          implementation_started_at: string | null
          implementation_started_by: string | null
          implementation_target_date: string | null
          last_edited_at: string
          last_edited_by: string
          outcome_recorded_at: string | null
          outcome_recorded_by: string | null
          project_id: string
          quality_impact: string | null
          reason: string
          recommendation: string | null
          requested_date: string
          requester_name: string
          resource_impact: string | null
          risk_impact: string | null
          schedule_impact: string | null
          scope_impact: string | null
          status: string
          submitted_at: string | null
          submitted_by: string | null
          title: string
          updated_at: string
          withdrawal_notes: string | null
          withdrawn_at: string | null
          withdrawn_by: string | null
        }
        SetofOptions: {
          from: "*"
          to: "project_change_requests"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      mark_project_dependency_no_longer_required: {
        Args: { p_dependency_id: string; p_outcome_notes: string }
        Returns: {
          classification: string
          created_at: string
          created_by: string
          description: string
          failed_at: string | null
          failed_by: string | null
          id: string
          identified_date: string
          impact_if_missed: string
          management_plan: string
          needed_by_date: string
          no_longer_required_at: string | null
          no_longer_required_by: string | null
          outcome_notes: string | null
          owner_membership_id: string
          project_id: string
          provider_name: string
          required_for: string
          required_outcome: string
          satisfaction_evidence: string | null
          satisfied_at: string | null
          satisfied_by: string | null
          status: string
          title: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "project_dependencies"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      publish_project_status_report: {
        Args: { p_confirm: boolean; p_report_id: string }
        Returns: {
          accomplishments: string
          budget_health: string
          concerns: string | null
          created_at: string
          created_by: string
          decisions_required: string | null
          executive_summary: string
          id: string
          last_edited_at: string
          last_edited_by: string
          overall_health: string
          overdue_actions_snapshot: Json | null
          planned_work: string
          project_id: string
          project_lifecycle_phase_snapshot: string | null
          project_name_snapshot: string | null
          project_status_snapshot: string | null
          published_at: string | null
          published_by: string | null
          recent_decisions_snapshot: Json | null
          reporting_period_end: string
          reporting_period_start: string
          resource_health: string
          risk_health: string
          schedule_health: string
          scope_health: string
          status: string
          support_required: string | null
          top_issues_snapshot: Json | null
          top_risks_snapshot: Json | null
          upcoming_milestones_snapshot: Json | null
        }
        SetofOptions: {
          from: "*"
          to: "project_status_reports"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      reject_project_change_request: {
        Args: { p_confirm: boolean; p_id: string; p_notes: string }
        Returns: {
          budget_impact: string | null
          category: string
          created_at: string
          created_by: string
          decided_at: string | null
          decided_by: string | null
          decision_notes: string | null
          description: string
          id: string
          implementation_outcome_notes: string | null
          implementation_owner_membership_id: string | null
          implementation_plan_updated_at: string | null
          implementation_plan_updated_by: string | null
          implementation_started_at: string | null
          implementation_started_by: string | null
          implementation_target_date: string | null
          last_edited_at: string
          last_edited_by: string
          outcome_recorded_at: string | null
          outcome_recorded_by: string | null
          project_id: string
          quality_impact: string | null
          reason: string
          recommendation: string | null
          requested_date: string
          requester_name: string
          resource_impact: string | null
          risk_impact: string | null
          schedule_impact: string | null
          scope_impact: string | null
          status: string
          submitted_at: string | null
          submitted_by: string | null
          title: string
          updated_at: string
          withdrawal_notes: string | null
          withdrawn_at: string | null
          withdrawn_by: string | null
        }
        SetofOptions: {
          from: "*"
          to: "project_change_requests"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      resolve_project_issue: {
        Args: { p_issue_id: string; p_resolution_notes: string }
        Returns: {
          blocked_reason: string | null
          cancellation_notes: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          category: string
          created_at: string
          created_by: string
          current_impact: string
          description: string
          id: string
          identified_date: string
          originating_risk_id: string | null
          owner_membership_id: string
          project_id: string
          resolution_notes: string | null
          resolution_plan: string
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          status: string
          target_resolution_date: string
          title: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "project_issues"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      retire_project_assumption: {
        Args: { p_assumption_id: string; p_outcome_notes: string }
        Returns: {
          category: string
          confidence: string
          created_at: string
          created_by: string
          description: string
          id: string
          impact_if_false: string
          invalidated_at: string | null
          invalidated_by: string | null
          outcome_notes: string | null
          owner_membership_id: string
          planning_rationale: string
          project_id: string
          recorded_date: string
          retired_at: string | null
          retired_by: string | null
          status: string
          title: string
          updated_at: string
          validated_at: string | null
          validated_by: string | null
          validation_due_date: string
          validation_evidence: string | null
          validation_method: string
        }
        SetofOptions: {
          from: "*"
          to: "project_assumptions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      satisfy_project_dependency: {
        Args: {
          p_dependency_id: string
          p_outcome_notes: string
          p_satisfaction_evidence: string
        }
        Returns: {
          classification: string
          created_at: string
          created_by: string
          description: string
          failed_at: string | null
          failed_by: string | null
          id: string
          identified_date: string
          impact_if_missed: string
          management_plan: string
          needed_by_date: string
          no_longer_required_at: string | null
          no_longer_required_by: string | null
          outcome_notes: string | null
          owner_membership_id: string
          project_id: string
          provider_name: string
          required_for: string
          required_outcome: string
          satisfaction_evidence: string | null
          satisfied_at: string | null
          satisfied_by: string | null
          status: string
          title: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "project_dependencies"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      start_change_request_implementation: {
        Args: { p_confirm: boolean; p_id: string }
        Returns: {
          budget_impact: string | null
          category: string
          created_at: string
          created_by: string
          decided_at: string | null
          decided_by: string | null
          decision_notes: string | null
          description: string
          id: string
          implementation_outcome_notes: string | null
          implementation_owner_membership_id: string | null
          implementation_plan_updated_at: string | null
          implementation_plan_updated_by: string | null
          implementation_started_at: string | null
          implementation_started_by: string | null
          implementation_target_date: string | null
          last_edited_at: string
          last_edited_by: string
          outcome_recorded_at: string | null
          outcome_recorded_by: string | null
          project_id: string
          quality_impact: string | null
          reason: string
          recommendation: string | null
          requested_date: string
          requester_name: string
          resource_impact: string | null
          risk_impact: string | null
          schedule_impact: string | null
          scope_impact: string | null
          status: string
          submitted_at: string | null
          submitted_by: string | null
          title: string
          updated_at: string
          withdrawal_notes: string | null
          withdrawn_at: string | null
          withdrawn_by: string | null
        }
        SetofOptions: {
          from: "*"
          to: "project_change_requests"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      submit_project_change_request: {
        Args: { p_confirm: boolean; p_id: string }
        Returns: {
          budget_impact: string | null
          category: string
          created_at: string
          created_by: string
          decided_at: string | null
          decided_by: string | null
          decision_notes: string | null
          description: string
          id: string
          implementation_outcome_notes: string | null
          implementation_owner_membership_id: string | null
          implementation_plan_updated_at: string | null
          implementation_plan_updated_by: string | null
          implementation_started_at: string | null
          implementation_started_by: string | null
          implementation_target_date: string | null
          last_edited_at: string
          last_edited_by: string
          outcome_recorded_at: string | null
          outcome_recorded_by: string | null
          project_id: string
          quality_impact: string | null
          reason: string
          recommendation: string | null
          requested_date: string
          requester_name: string
          resource_impact: string | null
          risk_impact: string | null
          schedule_impact: string | null
          scope_impact: string | null
          status: string
          submitted_at: string | null
          submitted_by: string | null
          title: string
          updated_at: string
          withdrawal_notes: string | null
          withdrawn_at: string | null
          withdrawn_by: string | null
        }
        SetofOptions: {
          from: "*"
          to: "project_change_requests"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      transition_deliverable: {
        Args: {
          p_deliverable_id: string
          p_operation: string
          p_review_feedback?: string
        }
        Returns: {
          acceptance_criteria: string
          accepted_at: string | null
          accepted_by: string | null
          cancelled_at: string | null
          created_at: string
          created_by: string
          description: string | null
          due_date: string
          id: string
          milestone_id: string | null
          owner_membership_id: string
          project_id: string
          review_feedback: string | null
          status: string
          submitted_at: string | null
          title: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "deliverables"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      transition_milestone: {
        Args: { p_milestone_id: string; p_status: string }
        Returns: {
          cancelled_at: string | null
          completed_at: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          project_id: string
          status: string
          target_date: string
          title: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "milestones"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      transition_project_action: {
        Args: {
          p_action_id: string
          p_completion_notes?: string
          p_target_status: string
        }
        Returns: {
          cancelled_at: string | null
          cancelled_by: string | null
          completed_at: string | null
          completed_by: string | null
          completion_notes: string | null
          created_at: string
          created_by: string
          description: string | null
          due_date: string
          id: string
          owner_membership_id: string
          priority: string
          project_id: string
          status: string
          title: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "project_actions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      transition_project_assumption_active: {
        Args: { p_assumption_id: string; p_target_status: string }
        Returns: {
          category: string
          confidence: string
          created_at: string
          created_by: string
          description: string
          id: string
          impact_if_false: string
          invalidated_at: string | null
          invalidated_by: string | null
          outcome_notes: string | null
          owner_membership_id: string
          planning_rationale: string
          project_id: string
          recorded_date: string
          retired_at: string | null
          retired_by: string | null
          status: string
          title: string
          updated_at: string
          validated_at: string | null
          validated_by: string | null
          validation_due_date: string
          validation_evidence: string | null
          validation_method: string
        }
        SetofOptions: {
          from: "*"
          to: "project_assumptions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      transition_project_dependency_active: {
        Args: { p_dependency_id: string; p_target_status: string }
        Returns: {
          classification: string
          created_at: string
          created_by: string
          description: string
          failed_at: string | null
          failed_by: string | null
          id: string
          identified_date: string
          impact_if_missed: string
          management_plan: string
          needed_by_date: string
          no_longer_required_at: string | null
          no_longer_required_by: string | null
          outcome_notes: string | null
          owner_membership_id: string
          project_id: string
          provider_name: string
          required_for: string
          required_outcome: string
          satisfaction_evidence: string | null
          satisfied_at: string | null
          satisfied_by: string | null
          status: string
          title: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "project_dependencies"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      transition_project_issue_active: {
        Args: {
          p_blocked_reason?: string
          p_issue_id: string
          p_target_status: string
        }
        Returns: {
          blocked_reason: string | null
          cancellation_notes: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          category: string
          created_at: string
          created_by: string
          current_impact: string
          description: string
          id: string
          identified_date: string
          originating_risk_id: string | null
          owner_membership_id: string
          project_id: string
          resolution_notes: string | null
          resolution_plan: string
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          status: string
          target_resolution_date: string
          title: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "project_issues"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      transition_project_risk: {
        Args: { p_notes?: string; p_risk_id: string; p_target_status: string }
        Returns: {
          category: string
          closed_at: string | null
          closed_by: string | null
          closure_notes: string | null
          created_at: string
          created_by: string
          description: string
          id: string
          impact: number
          owner_membership_id: string
          probability: number
          project_id: string
          realization_notes: string | null
          realized_at: string | null
          realized_by: string | null
          response_plan: string
          response_strategy: string
          review_date: string
          risk_score: number | null
          risk_type: string
          status: string
          title: string
          trigger: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "project_risks"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      update_change_request_implementation_plan: {
        Args: { p_id: string; p_owner: string; p_target: string }
        Returns: {
          budget_impact: string | null
          category: string
          created_at: string
          created_by: string
          decided_at: string | null
          decided_by: string | null
          decision_notes: string | null
          description: string
          id: string
          implementation_outcome_notes: string | null
          implementation_owner_membership_id: string | null
          implementation_plan_updated_at: string | null
          implementation_plan_updated_by: string | null
          implementation_started_at: string | null
          implementation_started_by: string | null
          implementation_target_date: string | null
          last_edited_at: string
          last_edited_by: string
          outcome_recorded_at: string | null
          outcome_recorded_by: string | null
          project_id: string
          quality_impact: string | null
          reason: string
          recommendation: string | null
          requested_date: string
          requester_name: string
          resource_impact: string | null
          risk_impact: string | null
          schedule_impact: string | null
          scope_impact: string | null
          status: string
          submitted_at: string | null
          submitted_by: string | null
          title: string
          updated_at: string
          withdrawal_notes: string | null
          withdrawn_at: string | null
          withdrawn_by: string | null
        }
        SetofOptions: {
          from: "*"
          to: "project_change_requests"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      update_project_action: {
        Args: {
          p_action_id: string
          p_description: string
          p_due_date: string
          p_owner_membership_id: string
          p_priority: string
          p_title: string
        }
        Returns: {
          cancelled_at: string | null
          cancelled_by: string | null
          completed_at: string | null
          completed_by: string | null
          completion_notes: string | null
          created_at: string
          created_by: string
          description: string | null
          due_date: string
          id: string
          owner_membership_id: string
          priority: string
          project_id: string
          status: string
          title: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "project_actions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      update_project_assumption: {
        Args: {
          p_assumption_id: string
          p_category: string
          p_confidence: string
          p_description: string
          p_impact_if_false: string
          p_owner_membership_id: string
          p_planning_rationale: string
          p_title: string
          p_validation_due_date: string
          p_validation_evidence: string
          p_validation_method: string
        }
        Returns: {
          category: string
          confidence: string
          created_at: string
          created_by: string
          description: string
          id: string
          impact_if_false: string
          invalidated_at: string | null
          invalidated_by: string | null
          outcome_notes: string | null
          owner_membership_id: string
          planning_rationale: string
          project_id: string
          recorded_date: string
          retired_at: string | null
          retired_by: string | null
          status: string
          title: string
          updated_at: string
          validated_at: string | null
          validated_by: string | null
          validation_due_date: string
          validation_evidence: string | null
          validation_method: string
        }
        SetofOptions: {
          from: "*"
          to: "project_assumptions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      update_project_change_request_draft: {
        Args: {
          p_budget: string
          p_category: string
          p_description: string
          p_id: string
          p_quality: string
          p_reason: string
          p_recommendation: string
          p_requested_date: string
          p_requester_name: string
          p_resource: string
          p_risk: string
          p_schedule: string
          p_scope: string
          p_title: string
        }
        Returns: {
          budget_impact: string | null
          category: string
          created_at: string
          created_by: string
          decided_at: string | null
          decided_by: string | null
          decision_notes: string | null
          description: string
          id: string
          implementation_outcome_notes: string | null
          implementation_owner_membership_id: string | null
          implementation_plan_updated_at: string | null
          implementation_plan_updated_by: string | null
          implementation_started_at: string | null
          implementation_started_by: string | null
          implementation_target_date: string | null
          last_edited_at: string
          last_edited_by: string
          outcome_recorded_at: string | null
          outcome_recorded_by: string | null
          project_id: string
          quality_impact: string | null
          reason: string
          recommendation: string | null
          requested_date: string
          requester_name: string
          resource_impact: string | null
          risk_impact: string | null
          schedule_impact: string | null
          scope_impact: string | null
          status: string
          submitted_at: string | null
          submitted_by: string | null
          title: string
          updated_at: string
          withdrawal_notes: string | null
          withdrawn_at: string | null
          withdrawn_by: string | null
        }
        SetofOptions: {
          from: "*"
          to: "project_change_requests"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      update_project_dependency: {
        Args: {
          p_classification: string
          p_dependency_id: string
          p_description: string
          p_impact_if_missed: string
          p_management_plan: string
          p_needed_by_date: string
          p_owner_membership_id: string
          p_provider_name: string
          p_required_for: string
          p_required_outcome: string
          p_title: string
        }
        Returns: {
          classification: string
          created_at: string
          created_by: string
          description: string
          failed_at: string | null
          failed_by: string | null
          id: string
          identified_date: string
          impact_if_missed: string
          management_plan: string
          needed_by_date: string
          no_longer_required_at: string | null
          no_longer_required_by: string | null
          outcome_notes: string | null
          owner_membership_id: string
          project_id: string
          provider_name: string
          required_for: string
          required_outcome: string
          satisfaction_evidence: string | null
          satisfied_at: string | null
          satisfied_by: string | null
          status: string
          title: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "project_dependencies"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      update_project_issue: {
        Args: {
          p_category: string
          p_current_impact: string
          p_description: string
          p_issue_id: string
          p_owner_membership_id: string
          p_resolution_plan: string
          p_severity: string
          p_target_resolution_date: string
          p_title: string
        }
        Returns: {
          blocked_reason: string | null
          cancellation_notes: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          category: string
          created_at: string
          created_by: string
          current_impact: string
          description: string
          id: string
          identified_date: string
          originating_risk_id: string | null
          owner_membership_id: string
          project_id: string
          resolution_notes: string | null
          resolution_plan: string
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          status: string
          target_resolution_date: string
          title: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "project_issues"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      update_project_risk: {
        Args: {
          p_category: string
          p_description: string
          p_impact: number
          p_owner_membership_id: string
          p_probability: number
          p_response_plan: string
          p_response_strategy: string
          p_review_date: string
          p_risk_id: string
          p_risk_type: string
          p_title: string
          p_trigger: string
        }
        Returns: {
          category: string
          closed_at: string | null
          closed_by: string | null
          closure_notes: string | null
          created_at: string
          created_by: string
          description: string
          id: string
          impact: number
          owner_membership_id: string
          probability: number
          project_id: string
          realization_notes: string | null
          realized_at: string | null
          realized_by: string | null
          response_plan: string
          response_strategy: string
          review_date: string
          risk_score: number | null
          risk_type: string
          status: string
          title: string
          trigger: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "project_risks"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      update_project_status_report: {
        Args: {
          p_accomplishments: string
          p_budget_health: string
          p_concerns: string
          p_decisions_required: string
          p_executive_summary: string
          p_overall_health: string
          p_planned_work: string
          p_report_id: string
          p_reporting_period_end: string
          p_reporting_period_start: string
          p_resource_health: string
          p_risk_health: string
          p_schedule_health: string
          p_scope_health: string
          p_support_required: string
        }
        Returns: {
          accomplishments: string
          budget_health: string
          concerns: string | null
          created_at: string
          created_by: string
          decisions_required: string | null
          executive_summary: string
          id: string
          last_edited_at: string
          last_edited_by: string
          overall_health: string
          overdue_actions_snapshot: Json | null
          planned_work: string
          project_id: string
          project_lifecycle_phase_snapshot: string | null
          project_name_snapshot: string | null
          project_status_snapshot: string | null
          published_at: string | null
          published_by: string | null
          recent_decisions_snapshot: Json | null
          reporting_period_end: string
          reporting_period_start: string
          resource_health: string
          risk_health: string
          schedule_health: string
          scope_health: string
          status: string
          support_required: string | null
          top_issues_snapshot: Json | null
          top_risks_snapshot: Json | null
          upcoming_milestones_snapshot: Json | null
        }
        SetofOptions: {
          from: "*"
          to: "project_status_reports"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      validate_project_assumption: {
        Args: {
          p_assumption_id: string
          p_outcome_notes: string
          p_validation_evidence: string
        }
        Returns: {
          category: string
          confidence: string
          created_at: string
          created_by: string
          description: string
          id: string
          impact_if_false: string
          invalidated_at: string | null
          invalidated_by: string | null
          outcome_notes: string | null
          owner_membership_id: string
          planning_rationale: string
          project_id: string
          recorded_date: string
          retired_at: string | null
          retired_by: string | null
          status: string
          title: string
          updated_at: string
          validated_at: string | null
          validated_by: string | null
          validation_due_date: string
          validation_evidence: string | null
          validation_method: string
        }
        SetofOptions: {
          from: "*"
          to: "project_assumptions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      withdraw_project_change_request: {
        Args: { p_confirm: boolean; p_id: string; p_notes: string }
        Returns: {
          budget_impact: string | null
          category: string
          created_at: string
          created_by: string
          decided_at: string | null
          decided_by: string | null
          decision_notes: string | null
          description: string
          id: string
          implementation_outcome_notes: string | null
          implementation_owner_membership_id: string | null
          implementation_plan_updated_at: string | null
          implementation_plan_updated_by: string | null
          implementation_started_at: string | null
          implementation_started_by: string | null
          implementation_target_date: string | null
          last_edited_at: string
          last_edited_by: string
          outcome_recorded_at: string | null
          outcome_recorded_by: string | null
          project_id: string
          quality_impact: string | null
          reason: string
          recommendation: string | null
          requested_date: string
          requester_name: string
          resource_impact: string | null
          risk_impact: string | null
          schedule_impact: string | null
          scope_impact: string | null
          status: string
          submitted_at: string | null
          submitted_by: string | null
          title: string
          updated_at: string
          withdrawal_notes: string | null
          withdrawn_at: string | null
          withdrawn_by: string | null
        }
        SetofOptions: {
          from: "*"
          to: "project_change_requests"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
