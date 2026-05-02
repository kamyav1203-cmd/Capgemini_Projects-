using Microsoft.EntityFrameworkCore;
using EMS.InMemoryAPI.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowMvc", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

// Retry migration — MSSQL container can be slow even after healthcheck
using (var scope = app.Services.CreateScope())
{
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var retries = 0;
    while (retries < 10)
    {
        try
        {
            logger.LogInformation("Attempting DB migration (attempt {attempt})...", retries + 1);
            db.Database.Migrate();
            logger.LogInformation("DB migration succeeded.");
            break;
        }
        catch (Exception ex)
        {
            retries++;
            logger.LogWarning("DB not ready yet: {msg}. Waiting 5s...", ex.Message);
            Thread.Sleep(5000);
        }
    }
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowMvc");
app.UseAuthorization();
app.MapControllers();

app.Run();
