import { Governorate, Category, Job, BusinessResult, Failure, DashboardStats } from "../types";

export const GOVERNORATES_LIST = [
  "Baghdad", "Basra", "Nineveh", "Erbil", "Najaf", "Karbala", 
  "Sulaymaniyah", "Kirkuk", "Anbar", "Diyala", "Babil", "Dhi Qar", 
  "Duhok", "Maysan", "Muthanna", "Qadisiyyah", "Salah al-Din", "Wasit"
];

export const CATEGORIES_LIST = [
  "Restaurants", "Cafes", "Pharmacies", "Hospitals", "Clinics", 
  "Hotels", "Supermarkets", "Bakeries", "Electronics", "Clothing", 
  "Schools", "Universities", "Gyms", "Salons", "Car Services", 
  "Construction", "Hardware", "Jewelry", "Mobile Phones", "Furniture"
];

export const mockGovernorates: Governorate[] = GOVERNORATES_LIST.map((name, idx) => ({
  id: `gov-${idx}`,
  name,
  citiesCount: Math.floor(Math.random() * 10) + 5,
  categoriesCompleted: Math.floor(Math.random() * 20),
  totalCategories: 20,
  businessesCollected: Math.floor(Math.random() * 5000),
  status: idx % 4 === 0 ? "running" : idx % 7 === 0 ? "failed" : idx % 3 === 0 ? "done" : "pending",
  activeCity: idx % 4 === 0 ? "Central City" : undefined,
  activeCategory: idx % 4 === 0 ? "Restaurants" : undefined,
  progress: Math.floor(Math.random() * 100)
}));

export const mockCategories: Category[] = CATEGORIES_LIST.map((name, idx) => ({
  id: `cat-${idx}`,
  name,
  totalSaved: Math.floor(Math.random() * 10000),
  governoratesCompleted: Math.floor(Math.random() * 18),
  activeGovernorates: idx % 5 === 0 ? 3 : 0,
  progress: Math.floor(Math.random() * 100)
}));

export const mockJobs: Job[] = [
  {
    id: "job-1",
    governorate: "Baghdad",
    city: "Karrada",
    category: "Restaurants",
    savedCount: 45,
    targetCount: 100,
    status: "running",
    currentStep: "Scraping Google Maps",
    progress: 45,
    updatedAt: new Date().toISOString()
  },
  {
    id: "job-2",
    governorate: "Basra",
    city: "Al-Ashar",
    category: "Pharmacies",
    savedCount: 12,
    targetCount: 50,
    status: "running",
    currentStep: "Verifying Phone Numbers",
    progress: 24,
    updatedAt: new Date().toISOString()
  },
  {
    id: "job-3",
    governorate: "Nineveh",
    city: "Mosul",
    category: "Hospitals",
    savedCount: 0,
    targetCount: 30,
    status: "pending",
    currentStep: "Waiting in queue",
    progress: 0,
    updatedAt: new Date().toISOString()
  }
];

export const mockResults: BusinessResult[] = [
  {
    id: "res-1",
    name: "Al-Zaitoon Restaurant",
    governorate: "Baghdad",
    city: "Mansour",
    category: "Restaurants",
    phone: "+964 770 123 4567",
    source: "Google Maps",
    confidence: 0.98,
    verificationStatus: "verified",
    savedAt: new Date().toISOString()
  },
  {
    id: "res-2",
    name: "Hope Pharmacy",
    governorate: "Erbil",
    city: "Ankawa",
    category: "Pharmacies",
    phone: "+964 750 987 6543",
    source: "Facebook",
    confidence: 0.85,
    verificationStatus: "pending",
    savedAt: new Date().toISOString()
  }
];

export const mockFailures: Failure[] = [
  {
    id: "fail-1",
    governorate: "Kirkuk",
    city: "Central",
    category: "Schools",
    errorMessage: "Connection Timeout",
    retryCount: 2,
    updatedAt: new Date().toISOString()
  }
];

export const mockDashboardStats: DashboardStats = {
  totalGovernorates: 18,
  totalCategories: 20,
  runningJobs: 3,
  completedJobs: 145,
  failedJobs: 12,
  totalBusinessesToday: 1240,
  overallProgress: 68,
  systemHealth: {
    database: "online",
    queue: "active",
    backend: "online",
    lastSync: new Date().toISOString()
  }
};
