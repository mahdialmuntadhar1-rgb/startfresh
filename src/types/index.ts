export type JobStatus = "pending" | "running" | "done" | "failed";

export interface Governorate {
  id: string;
  name: string;
  citiesCount: number;
  categoriesCompleted: number;
  totalCategories: number;
  businessesCollected: number;
  status: JobStatus;
  activeCity?: string;
  activeCategory?: string;
  progress: number;
}

export interface Category {
  id: string;
  name: string;
  totalSaved: number;
  governoratesCompleted: number;
  activeGovernorates: number;
  progress: number;
}

export interface Job {
  id: string;
  governorate: string;
  city: string;
  category: string;
  savedCount: number;
  targetCount: number;
  status: JobStatus;
  currentStep: string;
  progress: number;
  updatedAt: string;
}

export interface BusinessResult {
  id: string;
  name: string;
  governorate: string;
  city: string;
  category: string;
  phone: string;
  source: string;
  confidence: number;
  verificationStatus: "verified" | "unverified" | "pending";
  savedAt: string;
}

export interface Failure {
  id: string;
  governorate: string;
  city: string;
  category: string;
  errorMessage: string;
  retryCount: number;
  updatedAt: string;
}

export interface DashboardStats {
  totalGovernorates: number;
  totalCategories: number;
  runningJobs: number;
  completedJobs: number;
  failedJobs: number;
  totalBusinessesToday: number;
  overallProgress: number;
  systemHealth: {
    database: "online" | "offline";
    queue: "active" | "paused" | "idle";
    backend: "online" | "offline";
    lastSync: string;
  };
}
