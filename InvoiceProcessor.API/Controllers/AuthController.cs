using InvoiceProcessor.API.Infrastructure.Persistence;
using InvoiceProcessor.API.Domain.Entities;
using InvoiceProcessor.API.Infrastructure.Settings;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace InvoiceProcessor.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _ctx;
    private readonly JwtSettings _jwt;

    public AuthController(AppDbContext ctx, JwtSettings jwt)
    {
        _ctx = ctx;
        _jwt = jwt;
    }

    [HttpPost("login")]
    public IActionResult Login(LoginRequest req)
    {
        var user = _ctx.Users!
            .SingleOrDefault(u => u.UserName == req.UserName && u.Password == req.Password);

        if (user is null)
            return Unauthorized(new { message = "Invalid username or password" });

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.UserName)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _jwt.Issuer,
            audience: _jwt.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwt.ExpiresInMinutes),
            signingCredentials: creds
        );

        return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
    }
}

public record LoginRequest(string UserName, string Password);
