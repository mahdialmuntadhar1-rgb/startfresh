import { mockDashboardStats, mockGovernorates, mockCategories, mockJobs, mockResults, mockFailures } from "../data/mockData";
import { DashboardStats, Governorate, Category, Job, BusinessResult, Failure } from "../types";

// Real API Service
export const api = {
  getDashboard: async (): Promise<DashboardStats> => {
    const res = await fetch("/api/dashboard");
    return res.json();
  },

  getGovernorates: async (): Promise<Governorate[]> => {
    const res = await fetch("/api/governorates");
    return res.json();
  },

  getCategories: async (): Promise<Category[]> => {
    const res = await fetch("/api/categories");
    return res.json();
  },

  getJobs: async (): Promise<Job[]> => {
    const res = await fetch("/api/jobs");
    return res.json();
  },

  getResults: async (): Promise<BusinessResult[]> => {
    const res = await fetch("/api/results");
    return res.json();
  },

  getFailures: async (): Promise<Failure[]> => {
    const res = await fetch("/api/failures");
    return res.json();
  },

  startGovernorate: async (id: string): Promise<boolean> => {
    const res = await fetch("/api/start-governorate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    const data = await res.json();
    return data.success;
  },

  startAll: async (): Promise<boolean> => {
    const res = await fetch("/api/start-all", { method: "POST" });
    const data = await res.json();
    return data.success;
  },

  startSelected: async (governorates: string[], categories: string[]): Promise<boolean> => {
    const res = await fetch("/api/start-selected", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ governorates, categories })
    });
    const data = await res.json();
    return data.success;
  },

  retryJob: async (id: string): Promise<boolean> => {
    const res = await fetch("/api/retry-job", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    const data = await res.json();
    return data.success;
  }
};
