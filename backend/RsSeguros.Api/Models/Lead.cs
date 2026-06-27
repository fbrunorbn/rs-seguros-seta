using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RsSeguros.Api.Models;

public class Lead
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("nome")]
    public string Nome { get; set; } = string.Empty;

    [BsonElement("whatsapp")]
    public string Whatsapp { get; set; } = string.Empty;

    [BsonElement("cidade")]
    public string Cidade { get; set; } = string.Empty;

    [BsonElement("bairro")]
    public string Bairro { get; set; } = string.Empty;

    [BsonElement("tipoVeiculo")]
    public string TipoVeiculo { get; set; } = string.Empty;

    [BsonElement("modeloVeiculo")]
    public string ModeloVeiculo { get; set; } = string.Empty;

    [BsonElement("anoVeiculo")]
    public string AnoVeiculo { get; set; } = string.Empty;

    [BsonElement("placaVeiculo")]
    public string PlacaVeiculo { get; set; } = string.Empty;

    [BsonElement("interesse")]
    public string Interesse { get; set; } = string.Empty;

    [BsonElement("mensagem")]
    public string Mensagem { get; set; } = string.Empty;

    [BsonElement("origem")]
    public string Origem { get; set; } = "site";

    [BsonElement("status")]
    public string Status { get; set; } = "novo";

    [BsonElement("consentimentoLgpd")]
    public bool ConsentimentoLgpd { get; set; }

    [BsonElement("criadoEm")]
    public DateTime CriadoEm { get; set; }

    [BsonElement("atualizadoEm")]
    public DateTime AtualizadoEm { get; set; }
}
