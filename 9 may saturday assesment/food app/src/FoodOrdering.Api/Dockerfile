FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/FoodOrdering.Api/FoodOrdering.Api.csproj", "src/FoodOrdering.Api/"]
RUN dotnet restore "src/FoodOrdering.Api/FoodOrdering.Api.csproj"
COPY . .
WORKDIR "/src/src/FoodOrdering.Api"
RUN dotnet publish "FoodOrdering.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "FoodOrdering.Api.dll"]
