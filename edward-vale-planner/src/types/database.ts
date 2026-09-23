// Hand-written to mirror supabase/schema.sql exactly. If the schema changes,
// update this file (or replace it with `supabase gen types typescript`).
// Shape follows supabase-js's GenericDatabase contract exactly (Row/Insert/
// Update/Relationships per table, plus Views/Functions/Enums/CompositeTypes)
// so the client's generic type inference resolves instead of falling back
// to `never`.

export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type EntityType = 'task' | 'event';
export type ActivityAction = 'created' | 'updated' | 'completed' | 'deleted';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: 'Edward' | 'Vale';
          email: string;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name: 'Edward' | 'Vale';
          email: string;
        };
        Update: {
          display_name?: 'Edward' | 'Vale';
          email?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          color: string;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          color?: string;
        };
        Update: {
          name?: string;
          color?: string;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          due_date: string | null;
          due_time: string | null;
          priority: Priority;
          category_id: string | null;
          status: TaskStatus;
          reminder_minutes: number | null;
          created_by: string;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          due_date?: string | null;
          due_time?: string | null;
          priority?: Priority;
          category_id?: string | null;
          status?: TaskStatus;
          reminder_minutes?: number | null;
        };
        Update: {
          title?: string;
          description?: string | null;
          due_date?: string | null;
          due_time?: string | null;
          priority?: Priority;
          category_id?: string | null;
          status?: TaskStatus;
          reminder_minutes?: number | null;
        };
        Relationships: [];
      };
      calendar_events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          start_date: string;
          start_time: string | null;
          end_date: string | null;
          end_time: string | null;
          all_day: boolean;
          category_id: string | null;
          reminder_minutes: number | null;
          created_by: string;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          start_date: string;
          start_time?: string | null;
          end_date?: string | null;
          end_time?: string | null;
          all_day?: boolean;
          category_id?: string | null;
          reminder_minutes?: number | null;
        };
        Update: {
          title?: string;
          description?: string | null;
          start_date?: string;
          start_time?: string | null;
          end_date?: string | null;
          end_time?: string | null;
          all_day?: boolean;
          category_id?: string | null;
          reminder_minutes?: number | null;
        };
        Relationships: [];
      };
      activity_log: {
        Row: {
          id: string;
          entity_type: EntityType;
          entity_id: string;
          action: ActivityAction;
          actor: string;
          occurred_at: string;
          summary: string | null;
        };
        Insert: {
          id?: string;
          entity_type: EntityType;
          entity_id: string;
          action: ActivityAction;
          summary?: string | null;
        };
        Update: never;
        Relationships: [];
      };
      push_subscriptions: {
        Row: {
          id: string;
          profile_id: string;
          endpoint: string;
          p256dh: string;
          auth_key: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          endpoint: string;
          p256dh: string;
          auth_key: string;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
