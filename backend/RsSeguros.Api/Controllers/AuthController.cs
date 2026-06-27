using Microsoft.AspNetCore.Mvc;
using RsSeguros.Api.Dtos;
using RsSeguros.Api.Services;

namespace RsSeguros.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("login")]
    public IActionResult Login(LoginRequest request)
    {
        try
        {
            return Ok(authService.Login(request));
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized(new { mensagem = "Email ou senha inválidos." });
        }
    }
}
