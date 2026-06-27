using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using RsSeguros.Api.Dtos;
using RsSeguros.Api.Services;

namespace RsSeguros.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LeadsController(ILeadService leadService) : ControllerBase
{
    [HttpPost]
    [EnableRateLimiting("public-leads")]
    public async Task<IActionResult> Create(CreateLeadRequest request)
    {
        var lead = await leadService.CreateAsync(request);
        return CreatedAtAction(nameof(Create), new { id = lead.Id }, lead);
    }
}
