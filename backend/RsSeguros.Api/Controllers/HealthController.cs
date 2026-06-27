using Microsoft.AspNetCore.Mvc;

namespace RsSeguros.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { status = "ok", service = "RS Seguros API" });
    }
}
