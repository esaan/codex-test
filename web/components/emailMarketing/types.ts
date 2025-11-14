export interface EmailContentBlock {
  title: string;
  body: string;
  buttonLabel?: string;
  buttonUrl?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  preheader: string;
  purpose: string;
  audience: string;
  frequency: string;
  tags: string[];
  accentColor: string;
  heroTone: string;
  contentBlocks: EmailContentBlock[];
  footerNote: string;
  metricsFocus: string[];
}
