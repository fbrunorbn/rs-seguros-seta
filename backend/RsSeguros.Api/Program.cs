using System.Text;
using System.Threading.RateLimiting;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using RsSeguros.Api.Middlewares;
using RsSeguros.Api.Repositories;
using RsSeguros.Api.Services;
using RsSeguros.Api.Settings;
using RsSeguros.Api.Utils;

if (args.Length == 2 && args[0] == "generate-hash")
{
    Console.WriteLine("ADMIN_PASSWORD_HASH:");
    Console.WriteLine(PasswordHashGenerator.Generate(args[1]));
    return;
}

if (File.Exists(".env"))
{
    Env.Load();
}

var builder = WebApplication.CreateBuilder(args);

var mongoSettings = new MongoDbSettings
{
    ConnectionString = GetRequired("MONGODB_CONNECTION_STRING"),
    DatabaseName = GetEnv("MONGODB_DATABASE_NAME", "rs_seguros"),
    LeadsCollection = GetEnv("MONGODB_LEADS_COLLECTION", "leads")
};

var jwtSettings = new JwtSettings
{
    Secret = GetRequired("JWT_SECRET"),
    Issuer = GetEnv("JWT_ISSUER", "rs-seguros-api"),
    Audience = GetEnv("JWT_AUDIENCE", "rs-seguros-admin")
};

var adminSettings = new AdminSettings
{
    Email = GetRequired("ADMIN_EMAIL"),
    PasswordHash = GetRequired("ADMIN_PASSWORD_HASH")
};

builder.Services.AddSingleton(mongoSettings);
builder.Services.AddSingleton(jwtSettings);
builder.Services.AddSingleton(adminSettings);
builder.Services.AddScoped<ILeadRepository, LeadRepository>();
builder.Services.AddScoped<ILeadService, LeadService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IExportService, ExportService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("ConfiguredOrigins", policy =>
    {
        var origins = GetEnv("ALLOWED_ORIGINS", "http://localhost:5173")
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        policy.WithOrigins(origins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddRateLimiter(options =>
{
    options.AddPolicy("public-leads", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "anonimo",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0
            }));
});

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret))
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseMiddleware<ErrorHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapOpenApi();
}

app.UseCors("ConfiguredOrigins");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

static string GetEnv(string key, string fallback)
{
    return Environment.GetEnvironmentVariable(key) ?? fallback;
}

static string GetRequired(string key)
{
    var value = Environment.GetEnvironmentVariable(key);
    if (string.IsNullOrWhiteSpace(value))
        throw new InvalidOperationException($"Configure a variável de ambiente {key}.");

    return value;
}
