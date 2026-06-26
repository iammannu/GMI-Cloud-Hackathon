export type AgentId = "CEO" | "Market Research" | "Product Manager" | "Technical Architect" | "Growth" | "Investor";

export type AgentStatus = "waiting" | "thinking" | "done" | "error";

export interface AgentState {
  id: AgentId;
  name: AgentId;
  status: AgentStatus;
  streamedContent: string;
  output: unknown;
  startedAt?: number;
  completedAt?: number;
}

export interface CEOOutput {
  vision: string;
  mission: string;
  business_strategy: string;
  target_customer: string;
  value_proposition: string;
  elevator_pitch: string;
  business_model: string;
  revenue_streams: string[];
}

export interface Competitor {
  name: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  pricing: string;
  market_share: string;
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface MarketResearchOutput {
  market_size: string;
  tam: string;
  sam: string;
  som: string;
  competitors: Competitor[];
  market_trends: string[];
  swot: SWOTAnalysis;
  pricing_analysis: string;
  differentiation: string;
}

export interface MVPFeature {
  feature: string;
  description: string;
  priority: "P0" | "P1" | "P2";
  effort: "Small" | "Medium" | "Large";
  impact: "High" | "Medium" | "Low";
  user_story: string;
}

export interface RoadmapPhase {
  phase: string;
  theme: string;
  features: string[];
  milestone: string;
}

export interface UserPersona {
  name: string;
  role: string;
  age_range: string;
  pain_points: string[];
  goals: string[];
  channels: string[];
}

export interface ProductManagerOutput {
  mvp_features: MVPFeature[];
  full_roadmap: RoadmapPhase[];
  user_personas: UserPersona[];
  user_stories: string[];
  success_metrics: string[];
  tech_requirements: string[];
}

export interface TechStack {
  language: string;
  frontend: string;
  backend: string;
  database: string;
  auth: string;
  cloud: string;
  llm: string;
  vector_db: string;
  cache: string;
  queue: string;
  monitoring: string;
  deployment: string;
}

export interface APIEndpoint {
  endpoint: string;
  description: string;
  request: string;
  response: string;
}

export interface DatabaseTable {
  table: string;
  purpose: string;
  key_fields: string[];
}

export interface ArchitectOutput {
  tech_stack: TechStack;
  system_architecture: string;
  mermaid_diagram: string;
  api_design: APIEndpoint[];
  database_schema: DatabaseTable[];
  deployment_strategy: string;
  scalability_notes: string;
  security_considerations: string[];
}

export interface MarketingChannel {
  channel: string;
  strategy: string;
  expected_cac: string;
  timeline: string;
  priority: string;
}

export interface LaunchPhase {
  phase: string;
  actions: string[];
  goal: string;
}

export interface SocialMediaPlan {
  platform: string;
  content_type: string;
  frequency: string;
  sample_post: string;
}

export interface ContentCalendarItem {
  week: string;
  theme: string;
  pieces: string[];
}

export interface GrowthOutput {
  go_to_market: string;
  marketing_channels: MarketingChannel[];
  seo_strategy: string[];
  launch_strategy: LaunchPhase[];
  social_media_plan: SocialMediaPlan[];
  content_calendar: ContentCalendarItem[];
  kpis: string[];
  partnerships: string[];
}

export interface ComparableStartup {
  company: string;
  outcome: string;
  similarity: string;
}

export interface NinetyDayItem {
  days: string;
  focus: string;
  actions: string[];
  milestone: string;
}

export interface InvestorOutput {
  fundability_score: number;
  stage_recommendation: string;
  funding_amount: string;
  strengths: string[];
  weaknesses: string[];
  risks: string[];
  mitigations: string[];
  investment_thesis: string;
  comparable_startups: ComparableStartup[];
  ninety_day_plan: NinetyDayItem[];
}

export interface AnalysisReport {
  session_id: string;
  idea: string;
  ceo?: CEOOutput;
  market?: MarketResearchOutput;
  product?: ProductManagerOutput;
  architect?: ArchitectOutput;
  growth?: GrowthOutput;
  investor?: InvestorOutput;
  created_at?: string;
}

export interface SSEEvent {
  type: string;
  agent?: AgentId;
  content?: string;
  data?: unknown;
  session_id?: string;
  error?: string;
}

export interface GmiModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  context_window: number;
}

export interface Session {
  session_id: string;
  idea: string;
  created_at: string;
  has_results: boolean;
}
