using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RsSeguros.Api.Dtos;
using RsSeguros.Api.Services;

namespace RsSeguros.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/admin/leads")]
public class AdminLeadsController(ILeadService leadService, IExportService exportService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] DateTime? dataInicio,
        [FromQuery] DateTime? dataFim,
        [FromQuery] string? cidade,
        [FromQuery] string? status,
        [FromQuery] string? tipoVeiculo,
        [FromQuery] string? origem,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var filter = new LeadFilterRequest(dataInicio, dataFim, cidade, status, tipoVeiculo, origem);
        return Ok(await leadService.GetAsync(filter, page, pageSize));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        return Ok(await leadService.GetByIdAsync(id));
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(string id, UpdateLeadStatusRequest request)
    {
        return Ok(await leadService.UpdateStatusAsync(id, request.Status ?? string.Empty));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, UpdateLeadRequest request)
    {
        return Ok(await leadService.UpdateAsync(id, request));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        await leadService.DeleteAsync(id);
        return NoContent();
    }

    [HttpGet("export/csv")]
    public async Task<IActionResult> ExportCsv(
        [FromQuery] DateTime? dataInicio,
        [FromQuery] DateTime? dataFim,
        [FromQuery] string? cidade,
        [FromQuery] string? status,
        [FromQuery] string? tipoVeiculo,
        [FromQuery] string? origem)
    {
        var filter = new LeadFilterRequest(dataInicio, dataFim, cidade, status, tipoVeiculo, origem);
        var leads = await leadService.GetForExportAsync(filter);
        var file = exportService.ToCsv(leads);
        return File(file, "text/csv; charset=utf-8", $"leads-seta-rafael-{DateTime.UtcNow:yyyyMMddHHmm}.csv");
    }

    [HttpGet("export/xlsx")]
    public async Task<IActionResult> ExportXlsx(
        [FromQuery] DateTime? dataInicio,
        [FromQuery] DateTime? dataFim,
        [FromQuery] string? cidade,
        [FromQuery] string? status,
        [FromQuery] string? tipoVeiculo,
        [FromQuery] string? origem)
    {
        var filter = new LeadFilterRequest(dataInicio, dataFim, cidade, status, tipoVeiculo, origem);
        var leads = await leadService.GetForExportAsync(filter);
        var file = exportService.ToXlsx(leads);
        return File(file, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"leads-seta-rafael-{DateTime.UtcNow:yyyyMMddHHmm}.xlsx");
    }
}
