using RsSeguros.Api.Dtos;

namespace RsSeguros.Api.Services;

public interface IExportService
{
    byte[] ToCsv(IEnumerable<LeadResponse> leads);
    byte[] ToXlsx(IEnumerable<LeadResponse> leads);
}
