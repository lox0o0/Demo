export type EntryPoint = 
  | "stadium-qr" 
  | "broadcast-qr" 
  | "tipping-invite" 
  | "content" 
  | "direct";

export interface OnboardingState {
  entryPoint: EntryPoint;
  selectedTeam: string | null;
  name: string;
  email: string;
  phone: string;
  phoneVerified: boolean;
  dob: string;
  gender: string;
  postcode: string;
  smsReminders: boolean;
  saveDetails: boolean;
  step: number;
  completedSteps: string[];
}

export interface InviteData {
  inviterName: string;
  compName: string;
}
