
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
          cancellation_notes:…9568 tokens truncated…     satisfaction_evidence: string | null
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
