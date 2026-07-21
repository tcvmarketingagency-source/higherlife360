export type SermonRow = {
  id: string;
  title: string;
  speaker: string | null;
  series: string | null;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  scripture: string | null;
  duration: string | null;
  published_at: string;
};
export type SermonInsert = Omit<SermonRow, 'id' | 'published_at'> & {
  id?: string;
  published_at?: string;
};
export type SermonUpdate = Partial<SermonInsert>;

export type BranchRow = {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  country: string | null;
  lat: number | null;
  lng: number | null;
  service_times: string | null;
  pastor_name: string | null;
  photo_url: string | null;
  phone: string | null;
};
export type BranchInsert = Omit<BranchRow, 'id'> & { id?: string };
export type BranchUpdate = Partial<BranchInsert>;

export type EventRow = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  start_time: string;
  end_time: string | null;
  branch_id: string | null;
  category: string | null;
  register_url: string | null;
};
export type EventInsert = Omit<EventRow, 'id'> & { id?: string };
export type EventUpdate = Partial<EventInsert>;

export type ConnectCardRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  interest: string | null;
  message: string | null;
  created_at: string;
};
export type ConnectCardInsert = Omit<ConnectCardRow, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};
export type ConnectCardUpdate = Partial<ConnectCardInsert>;

export type NewsletterRow = {
  id: string;
  email: string;
  created_at: string;
};
export type NewsletterInsert = Omit<NewsletterRow, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};
export type NewsletterUpdate = Partial<NewsletterInsert>;

export type EventRsvpRow = {
  id: string;
  event_id: string;
  name: string;
  email: string;
  phone: string | null;
  guests: number;
  created_at: string;
};
export type EventRsvpInsert = Omit<EventRsvpRow, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};
export type EventRsvpUpdate = Partial<EventRsvpInsert>;

export type AdminUserRow = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  created_at: string;
};
export type AdminUserInsert = Omit<AdminUserRow, 'id' | 'created_at' | 'role'> & {
  id?: string;
  created_at?: string;
  role?: string;
};
export type AdminUserUpdate = Partial<AdminUserInsert>;

export type SiteImageRow = {
  id: string;
  key: string;
  label: string;
  description: string | null;
  image_url: string;
  updated_at: string;
};
export type SiteImageInsert = Omit<SiteImageRow, 'id' | 'updated_at'> & {
  id?: string;
  updated_at?: string;
};
export type SiteImageUpdate = Partial<SiteImageInsert>;

export type Database = {
  public: {
    Tables: {
      sermons: {
        Row: SermonRow;
        Insert: SermonInsert;
        Update: SermonUpdate;
        Relationships: [];
      };
      branches: {
        Row: BranchRow;
        Insert: BranchInsert;
        Update: BranchUpdate;
        Relationships: [];
      };
      events: {
        Row: EventRow;
        Insert: EventInsert;
        Update: EventUpdate;
        Relationships: [
          {
            foreignKeyName: 'events_branch_id_fkey';
            columns: ['branch_id'];
            referencedRelation: 'branches';
            referencedColumns: ['id'];
          },
        ];
      };
      connect_cards: {
        Row: ConnectCardRow;
        Insert: ConnectCardInsert;
        Update: ConnectCardUpdate;
        Relationships: [];
      };
      newsletter: {
        Row: NewsletterRow;
        Insert: NewsletterInsert;
        Update: NewsletterUpdate;
        Relationships: [];
      };
      event_rsvps: {
        Row: EventRsvpRow;
        Insert: EventRsvpInsert;
        Update: EventRsvpUpdate;
        Relationships: [
          {
            foreignKeyName: 'event_rsvps_event_id_fkey';
            columns: ['event_id'];
            referencedRelation: 'events';
            referencedColumns: ['id'];
          },
        ];
      };
      admin_users: {
        Row: AdminUserRow;
        Insert: AdminUserInsert;
        Update: AdminUserUpdate;
        Relationships: [];
      };
      site_images: {
        Row: SiteImageRow;
        Insert: SiteImageInsert;
        Update: SiteImageUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
