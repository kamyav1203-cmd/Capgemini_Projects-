using BillGenerator.Api.Services;
using BillGenerator.Infrastructure;
using BillGenerator.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new() { Title = "Multi-Catalog Bill Generator API", Version = "v1" });
});

// SQLite connection (file lives in the API content root when you run dotnet run from Api folder).
var connectionString = builder.Configuration.GetConnectionString("Default")
                       ?? "Data Source=billgenerator.db";
builder.Services.AddInfrastructure(connectionString);

builder.Services.AddScoped<CatalogService>();
builder.Services.AddScoped<BillService>();
builder.Services.AddScoped<ReportService>();

// React (Vite) dev server
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Avoid forcing HTTPS during local HTTP-only API testing (Vite uses http://localhost:5173).
if (!app.Environment.IsDevelopment())
    app.UseHttpsRedirection();

app.UseCors("Frontend");
app.UseAuthorization();
app.MapControllers();

// Apply migrations and seed catalogs on startup.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    db.EnsureSeedData();
}

app.Run();
