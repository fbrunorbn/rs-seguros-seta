namespace RsSeguros.Api.Settings;

public class MongoDbSettings
{
    public string ConnectionString { get; set; } = string.Empty;
    public string DatabaseName { get; set; } = "rs_seguros";
    public string LeadsCollection { get; set; } = "leads";
}
