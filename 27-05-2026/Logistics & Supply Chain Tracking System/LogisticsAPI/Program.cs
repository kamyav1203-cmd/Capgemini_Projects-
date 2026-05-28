var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("frontend");

if (!app.Environment.IsEnvironment("Docker"))
{
    app.UseHttpsRedirection();
}

var shipments = new List<Shipment>
{
    new(
        "SHP-1001",
        "ACME Manufacturing",
        "Denver Distribution Center",
        "Phoenix Retail Hub",
        "In Transit",
        84,
        "2026-05-28",
        "Route planning complete",
        "Transcontinental Logistics",
        "Line haul",
        "Flagstaff Cross-Dock",
        7,
        "Medium",
        "2026-05-27 07:10",
        new[]
        {
            new TrackingEvent("2026-05-26 08:20", "Picked up from origin warehouse"),
            new TrackingEvent("2026-05-26 13:45", "Departed Denver Distribution Center"),
            new TrackingEvent("2026-05-27 07:10", "Arrived at regional consolidation hub")
        }),
    new(
        "SHP-1002",
        "Northwind Traders",
        "Chicago Cross-Dock",
        "Atlanta Fulfillment Center",
        "Delivered",
        100,
        "2026-05-26",
        "Delivered on time",
        "Metro Freight",
        "Air",
        "Atlanta Fulfillment Center",
        4,
        "Low",
        "2026-05-26 11:15",
        new[]
        {
            new TrackingEvent("2026-05-24 09:05", "Loaded for line-haul transport"),
            new TrackingEvent("2026-05-25 16:30", "Out for final delivery"),
            new TrackingEvent("2026-05-26 11:15", "Proof of delivery captured")
        }),
    new(
        "SHP-1003",
        "Blue River Pharma",
        "Houston Cold Storage",
        "Dallas Medical Center",
        "Delayed",
        62,
        "2026-05-29",
        "Weather delay on highway corridor",
        "HealthRoute Carrier",
        "Refrigerated truck",
        "I-35 South Corridor",
        3,
        "High",
        "2026-05-27 09:20",
        new[]
        {
            new TrackingEvent("2026-05-26 06:40", "Temperature check passed"),
            new TrackingEvent("2026-05-26 18:00", "Delay reported due to weather"),
            new TrackingEvent("2026-05-27 09:20", "Reroute approved by dispatch")
        }),
    new(
        "SHP-1004",
        "TechCorp Solutions",
        "Los Angeles Port",
        "San Francisco Distribution",
        "Delivered",
        100,
        "2026-05-25",
        "Port clearance complete",
        "Express Pacific",
        "Truck",
        "San Francisco Distribution",
        15,
        "Low",
        "2026-05-25 14:30",
        new[]
        {
            new TrackingEvent("2026-05-23 10:00", "Cargo loaded at origin"),
            new TrackingEvent("2026-05-24 08:45", "Port clearance approved"),
            new TrackingEvent("2026-05-25 14:30", "Delivered to recipient")
        }),
    new(
        "SHP-1005",
        "Global Supply Inc",
        "Memphis Regional",
        "Nashville Hub",
        "In Transit",
        45,
        "2026-05-29",
        "On track for delivery",
        "Central American",
        "Line haul",
        "Kentucky Junction",
        12,
        "Low",
        "2026-05-27 22:15",
        new[]
        {
            new TrackingEvent("2026-05-27 06:00", "Picked up from origin"),
            new TrackingEvent("2026-05-27 18:00", "In consolidation hub"),
            new TrackingEvent("2026-05-27 22:15", "Departed for Nashville")
        }),
    new(
        "SHP-1006",
        "Precision Electronics",
        "Seattle Tech Park",
        "Portland Distribution",
        "In Transit",
        72,
        "2026-05-27",
        "Transit via Portland",
        "Northwest Carrier",
        "Truck",
        "Portland Regional",
        8,
        "Medium",
        "2026-05-27 16:00",
        new[]
        {
            new TrackingEvent("2026-05-26 10:30", "Loaded at warehouse"),
            new TrackingEvent("2026-05-26 20:00", "In transit to Portland"),
            new TrackingEvent("2026-05-27 08:00", "Arrived Portland hub")
        }),
    new(
        "SHP-1007",
        "EuroTrade Partners",
        "Newark Port",
        "Boston Regional Center",
        "In Transit",
        56,
        "2026-05-30",
        "Container cleared customs",
        "Atlantic Shipping",
        "Rail",
        "New Haven Rail Yard",
        11,
        "Medium",
        "2026-05-28 09:00",
        new[]
        {
            new TrackingEvent("2026-05-24 14:00", "Port of Newark entry"),
            new TrackingEvent("2026-05-25 11:30", "Customs clearance"),
            new TrackingEvent("2026-05-27 07:00", "Loaded on rail")
        }),
    new(
        "SHP-1008",
        "FreshProduce Co",
        "Fresno Agricultural Hub",
        "Las Vegas Distribution",
        "Delayed",
        38,
        "2026-05-31",
        "Refrigeration maintenance issue",
        "FreshRoute Logistics",
        "Refrigerated",
        "Bakersfield Maintenance",
        2,
        "High",
        "2026-05-27 14:00",
        new[]
        {
            new TrackingEvent("2026-05-26 06:00", "Loaded perishables"),
            new TrackingEvent("2026-05-26 19:00", "Temperature alarm alert"),
            new TrackingEvent("2026-05-27 08:00", "Unit serviced at maintenance")
        }),
    new(
        "SHP-1009",
        "Industrial Parts LLC",
        "Houston Warehouse",
        "San Antonio Facility",
        "Delivered",
        100,
        "2026-05-26",
        "Local delivery completed",
        "Local Express",
        "Truck",
        "San Antonio Facility",
        22,
        "Low",
        "2026-05-26 09:45",
        new[]
        {
            new TrackingEvent("2026-05-26 06:00", "Pickup from warehouse"),
            new TrackingEvent("2026-05-26 07:30", "In transit"),
            new TrackingEvent("2026-05-26 09:45", "Delivered with signature")
        }),
    new(
        "SHP-1010",
        "OceanFreight Asia",
        "Shanghai Port",
        "Los Angeles Port",
        "In Transit",
        28,
        "2026-06-15",
        "International vessel departure",
        "Pacific Ocean Lines",
        "Ocean",
        "Pacific Ocean - Day 3",
        5,
        "Low",
        "2026-05-27 18:30",
        new[]
        {
            new TrackingEvent("2026-05-22 08:00", "Shanghai port departure"),
            new TrackingEvent("2026-05-25 12:00", "Open ocean transit"),
            new TrackingEvent("2026-05-27 18:30", "On schedule for LA")
        })
};

app.MapGet("/api/dashboard", () =>
{
    var total = shipments.Count;
    var delivered = shipments.Count(shipment => shipment.Status == "Delivered");
    var inTransit = shipments.Count(shipment => shipment.Status == "In Transit");
    var delayed = shipments.Count(shipment => shipment.Status == "Delayed");
    var onTimeRate = (int)Math.Round((double)(total - delayed) / total * 100, MidpointRounding.AwayFromZero);
    var exceptionRate = (int)Math.Round((double)delayed / total * 100, MidpointRounding.AwayFromZero);
    var avgProgress = (int)Math.Round(shipments.Average(s => s.Progress), MidpointRounding.AwayFromZero);

    return Results.Ok(new DashboardResponse(
        new DashboardMetrics(total, delivered, inTransit, delayed, onTimeRate, exceptionRate, avgProgress),
        shipments,
        new[]
        {
            new AlertItem("Network delay", "One shipment is delayed by weather conditions.", "High"),
            new AlertItem("Temperature compliance", "Cold chain shipment SHP-1003 remains within threshold.", "Medium"),
            new AlertItem("Delivery streak", "Two shipments have already been delivered on schedule.", "Low")
        }));
});

app.MapGet("/api/shipments", () => Results.Ok(shipments));

app.MapGet("/api/shipments/{id}", (string id) =>
{
    var shipment = shipments.FirstOrDefault(item => item.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
    return shipment is null ? Results.NotFound() : Results.Ok(shipment);
});

app.Run();

record DashboardResponse(DashboardMetrics Metrics, IReadOnlyCollection<Shipment> Shipments, IReadOnlyCollection<AlertItem> Alerts);
record DashboardMetrics(int TotalShipments, int Delivered, int InTransit, int Delayed, int OnTimeRate, int ExceptionRate, int AvgProgress);
record AlertItem(string Title, string Description, string Priority);
record Shipment(string Id, string Customer, string Origin, string Destination, string Status, int Progress, string Eta, string Note, string Carrier, string Mode, string CurrentLocation, int TemperatureC, string Priority, string LastScan, IReadOnlyCollection<TrackingEvent> Timeline);
record TrackingEvent(string Timestamp, string Message);
