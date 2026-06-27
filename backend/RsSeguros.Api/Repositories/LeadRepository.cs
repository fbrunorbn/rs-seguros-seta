using MongoDB.Driver;
using RsSeguros.Api.Dtos;
using RsSeguros.Api.Models;
using RsSeguros.Api.Settings;

namespace RsSeguros.Api.Repositories;

public class LeadRepository : ILeadRepository
{
    private readonly IMongoCollection<Lead> _collection;

    public LeadRepository(MongoDbSettings settings)
    {
        var client = new MongoClient(settings.ConnectionString);
        var database = client.GetDatabase(settings.DatabaseName);
        _collection = database.GetCollection<Lead>(settings.LeadsCollection);
    }

    public async Task<Lead> CreateAsync(Lead lead)
    {
        await _collection.InsertOneAsync(lead);
        return lead;
    }

    public async Task<IReadOnlyCollection<Lead>> GetAsync(LeadFilterRequest filter, int page, int pageSize)
    {
        return await _collection
            .Find(BuildFilter(filter))
            .SortByDescending(lead => lead.CriadoEm)
            .Skip((page - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();
    }

    public async Task<IReadOnlyCollection<Lead>> GetAllAsync(LeadFilterRequest filter)
    {
        return await _collection
            .Find(BuildFilter(filter))
            .SortByDescending(lead => lead.CriadoEm)
            .ToListAsync();
    }

    public Task<long> CountAsync(LeadFilterRequest filter)
    {
        return _collection.CountDocumentsAsync(BuildFilter(filter));
    }

    public async Task<Lead?> GetByIdAsync(string id)
    {
        return await _collection.Find(lead => lead.Id == id).FirstOrDefaultAsync();
    }

    public async Task<Lead?> UpdateAsync(string id, Lead lead)
    {
        lead.Id = id;

        return await _collection.FindOneAndReplaceAsync(
            item => item.Id == id,
            lead,
            new FindOneAndReplaceOptions<Lead> { ReturnDocument = ReturnDocument.After });
    }

    public async Task<Lead?> UpdateStatusAsync(string id, string status)
    {
        var update = Builders<Lead>.Update
            .Set(lead => lead.Status, status)
            .Set(lead => lead.AtualizadoEm, DateTime.UtcNow);

        return await _collection.FindOneAndUpdateAsync(
            lead => lead.Id == id,
            update,
            new FindOneAndUpdateOptions<Lead> { ReturnDocument = ReturnDocument.After });
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _collection.DeleteOneAsync(lead => lead.Id == id);
        return result.DeletedCount > 0;
    }

    private static FilterDefinition<Lead> BuildFilter(LeadFilterRequest filter)
    {
        var builder = Builders<Lead>.Filter;
        var filters = new List<FilterDefinition<Lead>>();

        if (filter.DataInicio.HasValue)
            filters.Add(builder.Gte(lead => lead.CriadoEm, filter.DataInicio.Value.Date.ToUniversalTime()));

        if (filter.DataFim.HasValue)
            filters.Add(builder.Lt(lead => lead.CriadoEm, filter.DataFim.Value.Date.AddDays(1).ToUniversalTime()));

        if (!string.IsNullOrWhiteSpace(filter.Cidade))
            filters.Add(builder.Regex(lead => lead.Cidade, new MongoDB.Bson.BsonRegularExpression(filter.Cidade.Trim(), "i")));

        if (!string.IsNullOrWhiteSpace(filter.Status))
            filters.Add(builder.Eq(lead => lead.Status, filter.Status.Trim().ToLowerInvariant()));

        if (!string.IsNullOrWhiteSpace(filter.TipoVeiculo))
            filters.Add(builder.Eq(lead => lead.TipoVeiculo, filter.TipoVeiculo.Trim()));

        if (!string.IsNullOrWhiteSpace(filter.Origem))
            filters.Add(builder.Eq(lead => lead.Origem, filter.Origem.Trim().ToLowerInvariant()));

        return filters.Count == 0 ? builder.Empty : builder.And(filters);
    }
}
