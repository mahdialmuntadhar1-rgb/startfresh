# StartFresh Iraqi Business Collection System

Simplified, reliable backend system for Iraqi business data collection with immediate persistence and crash recovery.

## 🎯 Features

- **Backend-first only**: No frontend dependencies, browser-independent
- **Immediate persistence**: Every valid business saved instantly to database
- **Crash recovery**: Jobs resume automatically on server restart
- **Simple architecture**: Reusable agent engine, not 18 different files
- **Target-based collection**: 10 businesses per city+category
- **Multi-source data**: OpenStreetMap, Foursquare, Gemini verification
- **Real-time dashboard**: Simple web interface for progress monitoring
- **Queue management**: Safe concurrent job execution (max 2)

## 📁 Project Structure

```
startfresh/
├── package.json
├── .gitignore
├── .env.example
├── README.md
├── server.js
├── database-schema.sql
├── dashboard/
│   ├── index.html
│   ├── app.js
│   └── styles.css
└── src/
    ├── config/
    │   ├── constants.js
    │   ├── categories.js
    │   ├── governorates.js
    │   └── cityMap.js
    ├── db/
    │   ├── supabase.js
    │   ├── jobs.js
    │   ├── businesses.js
    │   └── progress.js
    ├── agents/
    │   ├── governorateRunner.js
    │   ├── cityRunner.js
    │   ├── categoryRunner.js
    │   └── resumeInterruptedJobs.js
    ├── services/
    │   ├── validator.js
    │   ├── normalizer.js
    │   ├── persistence.js
    │   ├── targetCounter.js
    │   └── queueManager.js
    ├── sources/
    │   ├── openstreetmapSource.js
    │   ├── foursquareSource.js
    │   ├── geminiVerifier.js
    │   └── mergeSources.js
    ├── routes/
    │   ├── startGovernorateRoute.js
    │   ├── startAllRoute.js
    │   ├── jobStatusRoute.js
    │   └── dashboardRoute.js
    └── utils/
        ├── logger.js
        ├── sleep.js
        └── safeJsonParse.js
```

## 🚀 Quick Start

### 1. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
GEMINI_API_KEY=your_gemini_api_key
FOURSQUARE_API_KEY=your_foursquare_api_key
PORT=3000
NODE_ENV=development
```

### 2. Database Setup

1. Create a new Supabase project
2. Run the `database-schema.sql` in the Supabase SQL Editor
3. Enable RLS policies (included in schema)

### 3. Install and Run

```bash
# Install dependencies
npm install

# Start the server
npm start

# Or for development
npm run dev
```

Visit `http://localhost:3000` to see the dashboard.

## 📊 API Endpoints

### Start Collection
- `POST /api/start-governorate` - Start collection for one governorate
- `POST /api/start-all` - Start collection for all 18 governorates

### Monitor Progress
- `GET /api/job/:id` - Get detailed job status
- `GET /api/dashboard` - Get dashboard overview
- `GET /api/dashboard/summary` - Get summary by location

### System
- `GET /health` - Health check and queue status
- `GET /` - Dashboard interface

## 🏛️ Governorates Covered

18 Iraqi governorates with multiple cities each:
- Baghdad, Basra, Najaf, Karbala, Erbil, Duhok, Sulaymaniyah
- Mosul, Kirkuk, Dhi Qar, Maysan, Muthanna, Al Anbar
- Babil, Diyala, Wasit, Saladin, Al-Qadisiyyah

## 📈 Categories (20)

Restaurants, Hotels, Pharmacies, Supermarkets, Gas stations, Hospitals, Schools, Banks, Clothing stores, Electronics stores, Car repair, Beauty salons, Cafes, Bakeries, Bookstores, Hardware stores, Jewelry stores, Mobile phone stores, Furniture stores, Fitness centers

## 🔄 Collection Logic

For each governorate → city → category:
1. Fetch from OpenStreetMap + Foursquare
2. Validate businesses (name, category, city required)
3. Normalize and deduplicate
4. Save immediately to database
5. Stop when 10 valid businesses saved
6. Move to next category

## 💾 Persistence & Recovery

- **Immediate saving**: Every valid business saved instantly
- **Job tracking**: Progress stored in database
- **Crash recovery**: Jobs resume on server restart
- **No browser dependency**: Work continues even if frontend crashes

## 🛡️ Data Quality

- **Strict validation**: Name, category, city must be ≥2 characters
- **Deduplication**: Based on normalized_name + "|" + city + "|" + phone
- **Source verification**: Gemini AI used for verification, not primary source
- **Real data only**: Prioritizes actual business data over AI hallucinations

## 📱 Dashboard Features

- Real-time job progress
- Governorate and city status
- Category completion tracking
- Recent logs and errors
- Start/stop controls

## 🚨 Important Notes

- **Security**: Never expose SUPABASE_SERVICE_ROLE_KEY in frontend
- **Rate limiting**: Built-in delays between API calls
- **Queue management**: Maximum 2 concurrent jobs
- **Persistence**: All work survives crashes and restarts

## 🧪 Testing

```bash
# Test individual components
node tests/test-governorate-runner.js
node tests/test-category-runner.js
node tests/test-recovery.js
```

## 📦 Deployment

### Railway/Render/VPS

1. Set environment variables
2. Deploy with `npm start`
3. Database connection required
4. No additional dependencies

### Environment Variables Required

- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (backend only)
- `SUPABASE_ANON_KEY` - Anonymous key (optional)
- `GEMINI_API_KEY` - Google AI API key
- `FOURSQUARE_API_KEY` - Foursquare API key (optional)
- `PORT` - Server port (default: 3000)

## 🔧 Configuration

Edit `src/config/constants.js`:
- `MAX_CONCURRENT_JOBS` - Default: 2
- `TARGET_BUSINESSES_PER_CITY_CATEGORY` - Default: 10
- `SOURCE_DELAY_MS` - Default: 3000
- `MAX_RETRIES` - Default: 3

## 📝 Logs

Logs are written to:
- Console (development)
- Daily log files (production)
- Database progress_logs table

## 🤝 Contributing

Keep it simple:
- No over-engineering
- Immediate persistence
- Browser-independent
- Reliable over fancy

## 📄 License

MIT
