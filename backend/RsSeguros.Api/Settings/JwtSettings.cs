namespace RsSeguros.Api.Settings;

public class JwtSettings
{
    public string Secret { get; set; } = string.Empty;
    public string Issuer { get; set; } = "rs-seguros-api";
    public string Audience { get; set; } = "rs-seguros-admin";
}
