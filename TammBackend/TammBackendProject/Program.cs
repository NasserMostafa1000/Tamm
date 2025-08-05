using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using TammBackendProject.Controllers;
using TammbusinessLayer.AdminContacts;
using TammbusinessLayer.Attributes;
using TammbusinessLayer.Categories;
using TammbusinessLayer.Chats;
using TammbusinessLayer.CitiesPlacesServices;
using TammbusinessLayer.CitiesServices;
using TammbusinessLayer.ClientsCommandsServices;
using TammbusinessLayer.ClientServices;
using TammbusinessLayer.Coins;
using TammbusinessLayer.Countries;
using TammbusinessLayer.Factories;
using TammbusinessLayer.Favorites;
using TammbusinessLayer.Helper;
using TammbusinessLayer.Interfaces;
using TammbusinessLayer.ListingAddresses;
using TammbusinessLayer.ListingReports;
using TammbusinessLayer.ListingReports.ListingReportsReasons;
using TammbusinessLayer.Listings;
using TammbusinessLayer.ListingsAttributes;
using TammbusinessLayer.NotificationsServices;
using TammbusinessLayer.Users;
using TammDataLayer.Listings;
using TammDataLayer.Registration;

namespace TammBackendProject
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddScoped<IChatService, ChatServices>();
            builder.Services.AddScoped<IRegister, AppleRegistration>();
            builder.Services.AddScoped<IClientsCommands, ClientsCommandsServices>();
            builder.Services.AddScoped<IClientQueries, ClientsQueriesServices>();
            builder.Services.AddScoped<ICityPlacesQueries, CitiesPlacesQueries>();
            builder.Services.AddScoped<ICityQueries, CitiesQueriesServices>();
            builder.Services.AddScoped<ICitiesPlacesCommands, CitiesPlacesCommands>();
            builder.Services.AddScoped<ICategoriesQueries, CategoriesQueriesServices>();
            builder.Services.AddScoped<ICategoryCommands, CategoriesCommandsServices>();
            builder.Services.AddScoped<IAttributeQueries, AttributesQueries>();
            builder.Services.AddScoped<IListingAttributeCommand, ListingAttributesCommands>();
            builder.Services.AddScoped<IListingAddressCommand, ListingAddressesCommandsServices>();
            builder.Services.AddScoped<IListingCommands, ListingsCommandServices>();
            builder.Services.AddScoped<IAttributeCommand, AttributesCommandServices>();
            builder.Services.AddScoped<IListingQueries, ListingQueriesServices>();
            builder.Services.AddScoped<IFavoriteCommands, FavoritesCommandServices>();
            builder.Services.AddScoped<IFavoriteQueries, FavoritesQueriesServices>();
            builder.Services.AddScoped<ICountryQueries, CountriesQueriesServices>();
            builder.Services.AddScoped<IListingReportReasonsQueries, ListingReportReasonsQueries>();
            builder.Services.AddScoped<IListingReportsCommands, ListingReportCommandsServices>();
            builder.Services.AddScoped<IListingReportQueries, ListingReportsQueriesServices>();
            builder.Services.AddScoped<IUsersCommands, UsersCommandServices>();
            builder.Services.AddScoped<IUserQueries, UsersQueriesServices>();
            builder.Services.AddScoped<NotificationsFactory>();
            builder.Services.AddScoped<ICoinCommands, CoinsCommandsServices>();
            builder.Services.AddScoped<ICoinQueries, CoinsQueriesServices>();
            builder.Services.AddScoped<INotification, GmailNotifications>();
            builder.Services.AddScoped<IAdminContactCommands, AdminContactsCommandsServices>();
            builder.Services.AddScoped<IAdminContactQueries, AdminContactsQueriesServices>();
            builder.Services.AddSingleton<TokenHelper>();
            var key = Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Key"]);
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
                        ValidAudience = builder.Configuration["JwtSettings:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        NameClaimType = JwtRegisteredClaimNames.Sub
                    };

                    // ✅ هنا الحل الإجباري مع SignalR
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];
                            var path = context.HttpContext.Request.Path;

                            if (!string.IsNullOrEmpty(accessToken) &&
                                path.StartsWithSegments("/chatHub")) // لازم تطابق اسم الـ Hub
                            {
                                context.Token = accessToken;
                            }

                            return Task.CompletedTask;
                        }
                    };
                });



            builder.Services.AddAuthorization();
            builder.Services.AddSignalR();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp", policy =>
                {
                    policy
                        .SetIsOriginAllowed(origin =>
                            new[]
                            {
                    "http://localhost:3000",
                    "https://tamm-uae.netlify.app",
                    "http://192.168.1.167:3000"
                            }.Contains(origin))
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });



            var app = builder.Build();

            // Middleware order is important:
            app.UseHttpsRedirection();

            app.UseStaticFiles();

            app.UseRouting();

            app.UseCors("AllowReactApp");            // استدعاء مرة واحدة قبل المصادقة

            app.UseAuthentication();            // استدعاء مرة واحدة وبالترتيب الصحيح
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                _ = endpoints.MapControllers();
                _ = endpoints.MapHub<ChatHub>("/chatHub");
               _= endpoints.MapHub<coinHub>("/coinHub");

            });



            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.Run();
        }
    }
}
