export type SurfaceColorType = 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone';
export type PrimaryColorType =
  | 'emerald'
  | 'green'
  | 'lime'
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose';

export type HeroContainerStyleType = 'compact' | 'wide';

export type SessionStatusType =
  | 'needs_patient_info'
  | 'waiting_audio'
  | 'transcribing'
  | 'report_generating'
  | 'complete'
  | 'error';

export type ReportStatusType = 'pending' | 'generating' | 'complete' | 'error';

export type PatientInfo = {
  name: string | null;
  id: string | null;
};

export type SessionDoc = {
  sessionId: string;
  userPhone: string;
  patient: PatientInfo | null;
  status: SessionStatusType;
  summary?: string | null;
  transcriptText?: string | null;
  reportText?: string | null;
  meta?: Record<string, unknown>;
  lastMessageAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type ReportDoc = {
  reportId: string;
  sessionId: string;
  transcriptPath: string | null;
  reportPath: string | null;
  transcriptText: string | null;
  reportText: string | null;
  status: ReportStatusType;
  summary?: string | null;
  error?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};
