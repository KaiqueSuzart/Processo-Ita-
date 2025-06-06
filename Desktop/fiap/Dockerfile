FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["src/RenovaTec.API/RenovaTec.API.csproj", "src/RenovaTec.API/"]
COPY ["src/RenovaTec.Application/RenovaTec.Application.csproj", "src/RenovaTec.Application/"]
COPY ["src/RenovaTec.Domain/RenovaTec.Domain.csproj", "src/RenovaTec.Domain/"]
COPY ["src/RenovaTec.Infrastructure/RenovaTec.Infrastructure.csproj", "src/RenovaTec.Infrastructure/"]
RUN dotnet restore "src/RenovaTec.API/RenovaTec.API.csproj"

# Copy everything else and build
COPY . .
RUN dotnet build "src/RenovaTec.API/RenovaTec.API.csproj" -c Release -o /app/build

# Publish
FROM build AS publish
RUN dotnet publish "src/RenovaTec.API/RenovaTec.API.csproj" -c Release -o /app/publish

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=publish /app/publish .
COPY ["src/RenovaTec.API/appsettings.Production.json", "/app/appsettings.json"]
EXPOSE 80
ENTRYPOINT ["dotnet", "RenovaTec.API.dll"] 