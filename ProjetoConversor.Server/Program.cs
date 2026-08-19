using System.Globalization;
using Microsoft.EntityFrameworkCore;
using ProjetoConversor.Data;

var builder = WebApplication.CreateBuilder(args);

// Leave the system in pt-BR
var cultureInfo = new CultureInfo("pt-BR");

CultureInfo.DefaultThreadCurrentCulture = cultureInfo;
CultureInfo.DefaultThreadCurrentUICulture = cultureInfo;

// Connection with database (MySQL)
var connectionString =
    builder.Configuration.GetConnectionString("ProjetoConversorContext");

builder.Services.AddDbContext<ProjetoConversorContext>(options =>
    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString)
    )
);

// Add Seeding Service
builder.Services.AddScoped <SeedingService>();

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Aqui, caso o projeto esteja rodando de forma de desenvolvimento,ira chamar o seeding service, se nao, ira apresentar o erro
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();

    using (var scope = app.Services.CreateScope())
    {
        var seedingService = scope.ServiceProvider.GetRequiredService<SeedingService>();
        seedingService.Seed();
    }
}
else
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
