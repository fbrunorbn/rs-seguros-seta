FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["RsSeguros.Api.csproj", "./"]
RUN dotnet restore "RsSeguros.Api.csproj"

COPY . .
RUN dotnet publish "RsSeguros.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "RsSeguros.Api.dll"]
