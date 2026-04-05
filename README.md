# Qahbaxana AI Agent System

Production-ready backend AI Governor Agent system for Iraqi business data collection.

## 🎯 Features

- **Backend-only**: No frontend dependencies, browser-independent
- **Multi-source data collection**: Gemini AI, OpenStreetMap, Foursquare
- **Immediate persistence**: Every validated record saved instantly to staging
- **Job recovery**: Automatically resumes interrupted jobs on server restart
- **Queue management**: Safe concurrent job execution with limits
- **Deduplication**: Smart duplicate detection and prevention
- **Progress tracking**: Real-time job progress and status monitoring

## 📁 Project Structure

```
qahbaxana/
├── package.json
├── .gitignore
├── .env.example
├── README.md
├── server.js
├── database-schema.sql
├── src/
│   ├── config/
│   │   ├── constants.js
│   │   ├── categories.js
│   │   └── governorates.js
│   ├── db/
│   │   ├── supabase.js
│   │   ├── jobs.js
│   │   ├── stagingBusinesses.js
│   │   └── businesses.js
│   ├── agents/
│   │   ├── runAgent.js
│   │   ├── autoContinueGovernorate.js
│   │   ├── fullIraqCoverage.js
│   │   └── resumeInterruptedJobs.js
│   ├── services/
│   │   ├── aiParser.js
│   │   ├── validator.js
│   │   ├── normalizer.js
│   │   ├── deduplicator.js
│   │   ├── progressTracker.js
│   │   └── queueManager.js
│   ├── sources/
│   │   ├── geminiSource.js
│   │   ├── openstreetmapSource.js
│   │   ├── foursquareSource.js
│   │   └── mergeSources.js
│   ├── routes/
│   │   ├── runAgentRoute.js
│   │   ├── autoContinueRoute.js
│   │   ├── fullIraqCoverageRoute.js
│   │   └── jobStatusRoute.js
│   └── utils/
│       ├── logger.js
│       ├── safeJsonParse.js
│       └── sleep.js
└── tests/
    ├── test-run-agent.js
    ├── test-auto-continue.js
    └── test-full-iraq.js
```

## 🚀 Setup Instructions

### 1. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://ujdsxzvvgaugypwtugdl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqZHN4enZ2Z2F1Z3lwd3R1Z2RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNzQ3NjYsImV4cCI6MjA5MDk1MDc2Nn0.XlWRSUAFTBYq3udqmBSkXI2bA73MlyriC1nWuwP4C7c

# AI Service Configuration
GEMINI_API_KEY=AIzaSyC9pda88kTF2Gpdj4geMB68OUEHUotcX8U

# Optional External APIs
FOURSQUARE_API_KEY=your_foursquare_api_key_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 2. Database Setup

1. Go to your Supabase project: https://ujdsxzvvgaugypwtugdl.supabase.co
2. Navigate to **SQL Editor**
3. Copy the entire contents of `database-schema.sql`
4. Click **Run** to execute

This creates:
- `jobs` table - Agent run tracking
- `staging_businesses` table - Immediate persistence
- `businesses` table - Final approved data
- All indexes and RLS policies

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Server

```bash
npm start
# or for development:
npm run dev
```

The server will:
- Connect to Supabase
- Resume any interrupted jobs
- Start accepting API requests

## 📊 How Job Recovery Works

1. **Server Startup**: Checks for jobs with status `pending` or `running`
2. **Automatic Resume**: Re-runs interrupted jobs from their parameters
3. **No Data Loss**: All validated records are saved immediately to staging
4. **Progress Tracking**: Jobs resume from where they left off

## 🧪 Testing

### Test Single Agent

```bash
npm run test:run-agent Baghdad restaurants
```

### Test Auto-Continue (One Governorate)

```bash
npm run test:auto-continue Baghdad
```

### Test Full Iraq Coverage

```bash
npm run test:full-iraq
```

⚠️ **Warning**: Full Iraq coverage runs 270 jobs and takes several hours!

## 📡 API Endpoints

### POST /api/run-agent
Run single agent for governorate + category

**Request:**
```json
{
  "governorate": "Baghdad",
  "category": "restaurants"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Agent started for restaurants in Baghdad",
  "status": "running"
}
```

### POST /api/auto-continue
Run all categories for one governorate

**Request:**
```json
{
  "governorate": "Baghdad"
}
```

### POST /api/full-iraq-coverage
Run all governorates and categories

**Request:**
```json
{}
```

### GET /api/job/:id
Get job status and progress

**Response:**
```json
{
  "success": true,
  "job": {
    "id": "uuid",
    "governorate": "Baghdad",
    "category": "restaurants",
    "status": "running",
    "progress": 70,
    "current_step": "DEDUPLICATING",
    "businesses_found": 25,
    "businesses_saved": 18
  },
  "staging": {
    "total": 25,
    "pending": 2,
    "duplicate": 5,
    "promoted": 18
  }
}
```

### GET /health
Health check and queue status

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00Z",
  "queue": {
    "running": 1,
    "maxConcurrent": 2,
    "queued": 0,
    "canStartNew": true
  }
}
```

## 🔧 System Configuration

### Constants (src/config/constants.js)
- `MAX_CONCURRENT_JOBS`: 2
- `MAX_RETRIES`: 3
- `SOURCE_DELAY_MS`: 3000
- `MAX_BUSINESSES_PER_RUN`: 30

### Categories
15 business categories including restaurants, hotels, pharmacies, etc.

### Governorates
18 Iraqi governorates from Baghdad to Al-Qadisiyyah

## 📈 Data Flow

```
API Request → Create Job → Fetch Sources → Validate → Normalize → Save to Staging → Check Duplicates → Promote to Businesses → Complete Job
```

**Key Features:**
- **Immediate Persistence**: Valid records saved to staging instantly
- **Per-Record Processing**: Individual record failures don't stop jobs
- **Smart Deduplication**: Uses normalized keys for duplicate detection
- **Queue Management**: Prevents server overload with concurrent limits

## 🛡️ Safety Features

- **No Data Loss**: Every validated record persists immediately
- **Job Recovery**: Interrupted jobs resume automatically
- **Rate Limiting**: Delays between API calls to avoid being blocked
- **Error Isolation**: Per-record error handling prevents job failures
- **Queue Limits**: Maximum concurrent jobs prevents server overload

## 📝 Logs

Logs are written to `logs/qahbaxana-YYYY-MM-DD.log` with:
- Timestamps
- Job IDs for tracking
- Progress updates
- Error details

## 🚨 Important Notes

- **Backend Only**: No frontend components - pure server-side system
- **Browser Independent**: Works even if browser closes or laptop sleeps
- **Production Ready**: Built for real-world deployment with error handling
- **Scalable**: Queue management allows safe horizontal scaling

## 🤝 Contributing

This is a production system designed for reliability and data integrity. All changes should:
- Preserve immediate persistence behavior
- Maintain job recovery functionality
- Keep queue management intact
- Include proper error handling
