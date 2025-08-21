using Microsoft.EntityFrameworkCore;
using TaskManager.Data;
using DotNetEnv;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure your database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS: allow React dev server
builder.Services.AddCors(options =>
{
    options.AddPolicy("vite", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // React dev server
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Enable Swagger in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// HTTPS redirection
app.UseHttpsRedirection();

// Apply CORS policy BEFORE mapping controllers
app.UseCors("vite");

app.MapControllers();

app.Run();
