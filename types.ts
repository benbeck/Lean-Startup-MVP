
export type CanvasKey = 
  | 'tam'
  | 'hypothesis'
  | 'problems'
  | 'alternatives'
  | 'solution'
  | 'metrics'
  | 'uvp'
  | 'concept'
  | 'advantage'
  | 'channels'
  | 'segments'
  | 'adopters'
  | 'costs'
  | 'revenue';

export interface CanvasData {
  projectName: string;
  designedBy: string;
  date: string;
  version: string;
  tam: string;
  hypothesis: string;
  problems: string;
  alternatives: string;
  solution: string;
  metrics: string;
  uvp: string;
  concept: string;
  advantage: string;
  channels: string;
  segments: string;
  adopters: string;
  costs: string;
  revenue: string;
}

export interface SectionMetadata {
  id: CanvasKey;
  title: string;
  icon: string;
  description: string;
  subtext?: string;
}
