using SnackTrackBackend.Services; // 👈 Add this for the VespaService

// --- Load .env first ---
DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

// --- Add services to the container ---

// Add controller support
builder.Services.AddControllers();

// Register the VespaService + HttpClient for API calls
builder.Services.AddHttpClient<VespaService>();

// Swagger for API docs/testing
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// --- Configure the HTTP request pipeline ---

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Use controllers (enables routes like /api/vespa/search)
app.MapControllers();

// Optional: keep your weather forecast demo
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.Run();

// --- Local record definition ---
record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
