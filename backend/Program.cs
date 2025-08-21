using Microsoft.EntityFrameworkCore;
using TaskManager.Data;
using DotNetEnv;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy",
        policy => policy
            .WithOrigins("http://localhost:5173") // allow your React dev server
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

app.UseCors("ReactPolicy"); // apply CORS before UseAuthorization

app.UseAuthorization();
app.MapControllers();

app.Run();
