using LearningAPI.Actions;
using LearningAPI.Interfaces;
using LearningAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var key = Encoding.ASCII.GetBytes("!@#xR2F6Lw78vJYkQf$PzTm&3D4^N8b5");
var configuration = builder.Configuration;
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<LearningAPIDbContext>(options =>
options.UseSqlServer(configuration.GetConnectionString("DevConnection")));
builder.Services.AddScoped<IUserInterface, UserActions>();
builder.Services.AddScoped<IFileInterface, FileActions>();
builder.Services.AddScoped<IAssesmentInterface, AssesmentActions>();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder.SetIsOriginAllowed(_ => true) 
                           .AllowAnyMethod()
                           .AllowAnyHeader());
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "LearningAPI",
            ValidAudience = "LearningAPIUsers",
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

var app = builder.Build();

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

app.Run();
