namespace RsSeguros.Api.Models;

public static class LeadStatus
{
    public const string Novo = "novo";
    public const string Exportado = "exportado";
    public const string Contatado = "contatado";
    public const string Convertido = "convertido";
    public const string Descartado = "descartado";

    public static readonly string[] Todos = [Novo, Exportado, Contatado, Convertido, Descartado];

    public static bool EhValido(string? status)
    {
        return !string.IsNullOrWhiteSpace(status)
            && Todos.Contains(status.Trim().ToLowerInvariant());
    }
}
