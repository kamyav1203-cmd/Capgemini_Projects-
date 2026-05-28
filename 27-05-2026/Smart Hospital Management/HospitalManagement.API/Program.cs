using HospitalManagement.API.Configurations;
using HospitalManagement.API.Data;
using HospitalManagement.API.Helpers;
using HospitalManagement.API.Interfaces;
using HospitalManagement.API.Models;
using HospitalManagement.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

namespace HospitalManagement.API
{
    /*
        Main entry point of the application.

        This file configures:
        - Services
        - Database
        - Authentication
        - Authorization
        - Middleware
        - Swagger
        - SignalR
    */

    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            /*
                ---------------------------------------------------
                DATABASE CONFIGURATION
                ---------------------------------------------------
            */

            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DefaultConnection")
                )
            );

            /*
                ---------------------------------------------------
                ASP.NET IDENTITY CONFIGURATION
                ---------------------------------------------------

                Handles:
                - User management
                - Password hashing
                - Role management
                - Authentication
            */

            builder.Services
                .AddIdentity<ApplicationUser, IdentityRole>(options =>
                {
                    // Password settings
                    options.Password.RequireDigit = true;
                    options.Password.RequiredLength = 6;
                    options.Password.RequireUppercase = true;
                    options.Password.RequireLowercase = true;
                    options.Password.RequireNonAlphanumeric = false;

                    // User settings
                    options.User.RequireUniqueEmail = true;
                })
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            /*
                ---------------------------------------------------
                JWT SETTINGS CONFIGURATION
                ---------------------------------------------------
            */

            builder.Services.Configure<JwtSettings>(
                builder.Configuration.GetSection("Jwt")
            );

            var jwtKey = builder.Configuration["Jwt:Key"];

            /*
                ---------------------------------------------------
                JWT AUTHENTICATION CONFIGURATION
                ---------------------------------------------------
            */

            builder.Services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme =
                        JwtBearerDefaults.AuthenticationScheme;

                    options.DefaultChallengeScheme =
                        JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters =
                        new TokenValidationParameters
                        {
                            ValidateIssuer = true,
                            ValidateAudience = true,
                            ValidateLifetime = true,
                            ValidateIssuerSigningKey = true,

                            ValidIssuer =
                                builder.Configuration["Jwt:Issuer"],

                            ValidAudience =
                                builder.Configuration["Jwt:Audience"],

                            IssuerSigningKey =
                                new SymmetricSecurityKey(
                                    Encoding.UTF8.GetBytes(jwtKey!)
                                )
                        };

                    /*
                        SignalR JWT support
                    */

                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken =
                                context.Request.Query["access_token"];

                            var path = context.HttpContext.Request.Path;

                            if (
                                !string.IsNullOrEmpty(accessToken)
                                &&
                                path.StartsWithSegments("/notificationHub")
                            )
                            {
                                context.Token = accessToken;
                            }

                            return Task.CompletedTask;
                        }
                    };
                });

            /*
                ---------------------------------------------------
                AUTHORIZATION
                ---------------------------------------------------
            */

            builder.Services.AddAuthorization();

            /*
                ---------------------------------------------------
                CONTROLLERS
                ---------------------------------------------------
            */

            builder.Services.AddScoped<IAuditService, AuditService>();
            builder.Services.AddScoped<IJwtService, JwtService>();
            builder.Services.AddControllers();

            /*
                ---------------------------------------------------
                SIGNALR
                ---------------------------------------------------
            */

            builder.Services.AddSignalR();

            /*
                ---------------------------------------------------
                CORS CONFIGURATION
                ---------------------------------------------------

                Allows frontend applications
                to communicate with backend.
            */

            builder.Services.AddCors(options =>
            {
                options.AddPolicy(
                    "AllowAll",
                    policy =>
                    {
                        policy
                            .AllowAnyOrigin()
                            .AllowAnyMethod()
                            .AllowAnyHeader();
                    });
            });

            /*
                ---------------------------------------------------
                SWAGGER CONFIGURATION
                ---------------------------------------------------
            */

            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddSwaggerGen(options =>
            {
                // Basic Swagger information
                options.SwaggerDoc(
                    "v1",
                    new OpenApiInfo
                    {
                        Title = "Hospital Management API",
                        Version = "v1",
                        Description =
                            "Centralized Hospital Management System API"
                    }
                );

                /*
                    JWT Authentication support in Swagger
                */

                options.AddSecurityDefinition(
                    "Bearer",
                    new OpenApiSecurityScheme
                    {
                        Name = "Authorization",
                        Type = SecuritySchemeType.Http,
                        Scheme = "bearer",
                        BearerFormat = "JWT",
                        In = ParameterLocation.Header,
                        Description =
                            "Enter JWT Token like: Bearer your_token_here"
                    }
                );

                options.AddSecurityRequirement(
                    new OpenApiSecurityRequirement
                    {
                        {
                            new OpenApiSecurityScheme
                            {
                                Reference =
                                    new OpenApiReference
                                    {
                                        Type = ReferenceType.SecurityScheme,
                                        Id = "Bearer"
                                    }
                            },
                            Array.Empty<string>()
                        }
                    }
                );
            });

            /*
                ---------------------------------------------------
                BUILD APPLICATION
                ---------------------------------------------------
            */

            var app = builder.Build();

            /*
                ---------------------------------------------------
                ROLE SEEDING
                ---------------------------------------------------
            */

            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;

                var roleManager =
                    services.GetRequiredService<RoleManager<IdentityRole>>();

                await RoleSeeder.SeedRolesAsync(roleManager);
            }

            /*
                ---------------------------------------------------
                HTTP REQUEST PIPELINE
                ---------------------------------------------------
            */

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();

                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseCors("AllowAll");

            app.UseAuthentication();

            app.UseAuthorization();

            app.MapControllers();

            /*
                ---------------------------------------------------
                SIGNALR HUB ROUTE
                ---------------------------------------------------
            */

            app.MapHub<Hubs.NotificationHub>("/notificationHub");

            app.Run();
        }
    }
}