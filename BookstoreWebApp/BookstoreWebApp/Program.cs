using System.Text;
using BookstoreWebApp.Data;
using BookstoreWebApp.Repositories.Implementation;
using BookstoreWebApp.Repositories.Interface;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Amazon.Lambda.AspNetCoreServer.Hosting;
using BookstoreWebApp.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Making this project as Lambda Compatible
builder.Services.AddAWSLambdaHosting(LambdaEventSource.HttpApi);

// Defining the CORS Policy

// Angular : http://localhost:4200/
//builder.Services.AddCors();
//builder.Services.AddCors(options =>
//{
//	options.AddPolicy("AllowBookstoreCors",
//		builder =>
//		{
//			builder.WithOrigins("https://localhost:4200", "http://localhost:4200")
//			.AllowCredentials()
//			.AllowAnyHeader()
//			.AllowAnyMethod();
//		});
//});

// CORS definition modified for Terraform Deployment and Local Environment

var allowOrigins = Environment.GetEnvironmentVariable("CORS_ALLOWED_ORIGINS")
	?? "https://localhost:4200,http://localhost:4200";

var allowOriginsArray = allowOrigins.Split(',',StringSplitOptions.RemoveEmptyEntries);

builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowBookstoreCors",
		builder =>
		{
			builder.WithOrigins(allowOriginsArray)
			.AllowAnyHeader()
			.AllowAnyMethod();
		});
}
);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
options.SwaggerDoc("v1", new OpenApiInfo{
	Title = "BookstoreWebApp",
	Version = "v1"

});
	// Add JWT Authentication support in Swagger
	var jwtSecurityScheme = new OpenApiSecurityScheme
	{
		Scheme = "bearer",
		BearerFormat = "JWT",
		Name = "Authorization",
		In = ParameterLocation.Header,
		Type = SecuritySchemeType.Http,
		Description = "Paste the JWT Token here",
		Reference = new OpenApiReference
		{
			Id = "Bearer",
			Type = ReferenceType.SecurityScheme
		}

	};
	options.AddSecurityDefinition(jwtSecurityScheme.Reference.Id,jwtSecurityScheme); // This tells Swagger about your JWT Bearer Scheme

	// The below method applies the JWT Security Scheme globally to all Swagger endpoints
	options.AddSecurityRequirement(new OpenApiSecurityRequirement
	{
		{
			jwtSecurityScheme,Array.Empty<string>()
		}

	});
});

// Injecting the SQL Server Connection String:
//builder.Services.AddDbContext<BookstoreWebAppDbContext>(options =>
//options.UseSqlServer(builder.Configuration.GetConnectionString("BookstoreWebAppConnectionStrings")));

string strConnectionString = "";

bool isLambda = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("AWS_LAMBDA_FUNCTION_NAME"));

if (isLambda)
{
	var dbService = new DbCredentialsService();
	strConnectionString = await dbService.GetConnectionStringAsync();
}
else
{
	strConnectionString = builder.Configuration.GetConnectionString("BookstoreWebAppConnectionStrings");
}

builder.Services.AddDbContext<BookstoreWebAppDbContext>(options =>
options.UseSqlServer(strConnectionString));

	// Injecting Token Services Interface and it's implementation

	builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();

// Add Authentication for the JWT Token
builder.Services.AddAuthentication(options =>
{
	options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
	options.DefaultChallengeScheme= JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(
	options =>
	{
		options.TokenValidationParameters = new TokenValidationParameters
		{
			ValidateIssuer = true,
			ValidateAudience = true,
			ValidateLifetime = true,
			ValidateIssuerSigningKey = true,

			ValidIssuer = builder.Configuration["Jwt:Issuer"],
			ValidAudience = builder.Configuration["Jwt:Audience"],
			IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
			ClockSkew = TimeSpan.Zero

		};
	}
	);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowBookstoreCors");
app.UseAuthentication(); // Newly added line for JWT Token Authentication
app.UseAuthorization();

app.MapControllers();

app.Run();
