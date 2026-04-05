import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Dashboard Stats
  app.get("/api/dashboard", (req, res) => {
    res.json({
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
    });
  });

  // API Route: Start Selected
  app.post("/api/start-selected", (req, res) => {
    const { governorates, categories } = req.body;
    console.log(`Starting agents for ${governorates.length} governorates and ${categories.length} categories`);
    res.json({ success: true, message: "Selected agents started" });
  });

  // API Route: Start All
  app.post("/api/start-all", (req, res) => {
    res.json({ success: true, message: "All governorate agents started" });
  });

  // API Route: Start Governorate
  app.post("/api/start-governorate", (req, res) => {
    const { id } = req.body;
    res.json({ success: true, message: `Agent for governorate ${id} started` });
  });

  // API Route: Retry Job
  app.post("/api/retry-job", (req, res) => {
    const { id, all } = req.body;
    if (all) {
      console.log("Retrying all failed jobs");
      return res.json({ success: true, message: "All failed jobs retried" });
    }
    res.json({ success: true, message: `Job ${id} retried` });
  });

  // API Route: Governorates
  app.get("/api/governorates", (req, res) => {
    res.json([
      {
        id: "gov-1",
        name: "Baghdad",
        citiesCount: 12,
        categoriesCompleted: 15,
        totalCategories: 20,
        businessesCollected: 12500,
        status: "running",
        activeCity: "Karrada",
        activeCategory: "Restaurants",
        progress: 75
      }
    ]);
  });

  // API Route: Categories
  app.get("/api/categories", (req, res) => {
    res.json([
      {
        id: "cat-1",
        name: "Restaurants",
        totalSaved: 45000,
        governoratesCompleted: 12,
        activeGovernorates: 3,
        progress: 85
      }
    ]);
  });

  // API Route: Jobs
  app.get("/api/jobs", (req, res) => {
    res.json([
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
      }
    ]);
  });

  // API Route: Results
  app.get("/api/results", (req, res) => {
    res.json([
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
      }
    ]);
  });

  // API Route: Failures
  app.get("/api/failures", (req, res) => {
    res.json([
      {
        id: "fail-1",
        governorate: "Kirkuk",
        city: "Central",
        category: "Schools",
        errorMessage: "Connection Timeout",
        retryCount: 2,
        updatedAt: new Date().toISOString()
      }
    ]);
  });

  // API Route: Run Agent (Legacy/Single)
  app.post("/api/run-agent", (req, res) => {
    const { governorate, category } = req.body;

    if (!governorate || !category) {
      return res.status(400).json({ error: "Governorate and category are required" });
    }

    console.log(`Running agent for ${category} in ${governorate}...`);

    // Simulated Agent Results
    // In a real scenario, this might trigger a more complex workflow.
    // Since we can't call Gemini here, we return structured data that looks like agent output.
    const results = [
      {
        name: `${governorate} Central ${category.slice(0, -1)}`,
        category: category,
        city: governorate,
        phone: "+964 770 123 4567",
        confidence: 0.98
      },
      {
        name: `Al-Rafidain ${category}`,
        category: category,
        city: governorate,
        phone: "+964 780 987 6543",
        confidence: 0.92
      },
      {
        name: `Babylon Gate ${category.slice(0, -1)}`,
        category: category,
        city: governorate,
        phone: "+964 750 111 2222",
        confidence: 0.85
      },
      {
        name: `Tigris ${category}`,
        category: category,
        city: governorate,
        phone: "+964 790 333 4444",
        confidence: 0.78
      }
    ];

    // Add some randomness to simulate "finding" different things
    const count = Math.floor(Math.random() * 3) + 2;
    res.json(results.slice(0, count));
  });

  // Serve static dashboard files
  const dashboardPath = path.join(process.cwd(), "dashboard");
  app.use("/dashboard", express.static(dashboardPath));
  app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(dashboardPath, "index.html"));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
