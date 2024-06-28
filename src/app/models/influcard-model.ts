import { InflucardResume } from "./influcard-resume.model";

export interface Influcard extends InflucardResume {
  reach_formated_graph: number;
  relevance_formated_graph: number;
  resonance_formated_graph: number;
  followers_formated: string;
  real_followers_formated: string;
  fake_followers_formated: number;
  insight_perc_13: number;
  insight_perc_18: number;
  insight_perc_25: number;
  insight_perc_35: number;
  insight_perc_45: number;
  insight_perc_65: number;
  insight_perc_m: string;
  insight_perc_f: string;
  top_countries_formated: { href: string, value: string }[];
  post_territory: { category: string, value: number, color: string }[];
  account_post_moment: { total: string }[];
  brands_images: { image: string, name: string }[];
  reach_formated: string;
  ir_alcance: number;
  ir_audiencia: number;
  vplays_formated: string;
  vr_alcance: number;
  vr_audiencia: number;
  er_alcance: number;
  er_audiencia: number;
  post_week_day: { engrate: string }[];
}
  