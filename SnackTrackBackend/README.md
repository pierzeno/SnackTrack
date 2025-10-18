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

7. Example: 
run
```bash
dotnet run --urls "http://0.0.0.0:5282"
```

if you want to use expo

## API Endpoints

### GET `/api/vespa/search`

Search for products in the Vespa database.

**Query Parameters:**
- `query` (required): Search term (e.g., "chocolate", "milk", "cookies")

**Example Request:**
```
GET http://localhost:5282/api/vespa/search?query=chocolate
```

**Response Format:**
```json
{
  "root": {
    "id": "toplevel",
    "relevance": 1.0,
    "fields": {
      "totalCount": 2406
    },
    "coverage": {
      "coverage": 100,
      "documents": 49688,
      "full": true,
      "nodes": 2,
      "results": 1,
      "resultsFull": 1
    },
    "children": [
      {
        "id": "id:products:product::34587",
        "relevance": 0.404,
        "source": "product",
        "fields": {
          "sddocname": "product",
          "documentid": "id:products:product::34587",
          "product_id": 34587,
          "product_name": "Chocolate Candies, Milk Chocolate",
          "aisle": "candy chocolate",
          "department": "snacks"
        }
      }
    ]
  }
}
```

**Response Fields:**
- `root.children[]`: Array of product results (up to 10 items)
- `fields.product_id`: Unique product identifier
- `fields.product_name`: Product name
- `fields.aisle`: Store aisle location
- `fields.department`: Product department category
- `relevance`: Search relevance score (higher = better match)

**Common Aisle Values:**
- `candy chocolate`
- `milk`
- `cookies cakes`
- `breakfast bakery`
- `ice cream ice`
- `refrigerated pudding desserts`
- `bakery desserts`
- `protein meal replacements`

### GET `/weatherforecast`

Sample endpoint for testing the API.

**Example Request:**
```
GET http://localhost:5282/weatherforecast
```

## Architecture

The backend uses:
- **VespaService**: Handles authentication and queries to Vespa Workshop API
- **YQL Query**: `select * from product.product where userQuery() limit 10;`
- **Bearer Token Authentication**: Automatically added to all Vespa requests

## Error Handling

- Returns 500 if VESPA_URL or VESPA_WORKSHOP_TOKEN are not configured
- Returns HTTP error codes from Vespa if query fails
