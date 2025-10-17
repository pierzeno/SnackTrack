# SnackTrackBackend

C# backend for querying the Vespa Workshop Ecommerce dataset.

## Prerequisites

- .NET 7 SDK
- Vespa Workshop credentials (`VESPA_URL` and `VESPA_WORKSHOP_TOKEN`)
- Optional: DotNetEnv for `.env` support

## Setup

1. Clone the repository:

```bash
git clone <your-repo-url>
cd SnackTrackBackend
```

2. Create a .env file in the root with:

```bash
VESPA_URL=<your-vespa-url>
VESPA_WORKSHOP_TOKEN=<your-token>
```

3. Restore dependencies:

```bash
dotnet restore
```

4. Run application

```bash
dotnet run
```

The backend will start at https://localhost:5282 (or similar).

5. API Endpoints

GET /api/vespa/search?query=<term> → Search products via Vespa
GET /weatherforecast → Sample endpoint for testing

6. Example:
http://localhost:5282/api/vespa/search?query=chocolate