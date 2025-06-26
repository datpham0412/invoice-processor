using InvoiceProcessor.API.Infrastructure.Persistence;
using InvoiceProcessor.API.Domain.Entities;
using InvoiceProcessor.API.Infrastructure.Settings;
using InvoiceProcessor.API.Application.Interfaces;
using InvoiceProcessor.API.Application.Models.Auth;
using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;

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
            .SingleOrDefault(u => u.UserName == req.UserName);

         if (user is null || !BCrypt.Net.BCrypt.Verify(req.Password, user.Password))
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

        var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

        var refreshToken = new RefreshToken {
            UserId  = user.Id,
            Token   = Guid.NewGuid().ToString("N"),
            Expires = DateTime.UtcNow.AddDays(7)
        };

        _ctx.RefreshTokens!.Add(refreshToken);
        _ctx.SaveChanges();

        return Ok(new {
            accessToken,                    
            refreshToken = refreshToken.Token 
        });
    }
    [HttpPost("register")]
    [Microsoft.AspNetCore.Authorization.AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        if (await _ctx.Users!.AnyAsync(u => u.UserName == req.UserName))
            return Conflict("User already exists");

        var hash = BCrypt.Net.BCrypt.HashPassword(req.Password);

        var user = new AppUser
        {
            Id       = Guid.NewGuid().ToString(),
            UserName = req.UserName,
            Password = hash
        };

        _ctx.Users!.Add(user);
        await _ctx.SaveChangesAsync();

        return StatusCode(201);
    }

    [HttpPost("refresh")]
    public IActionResult Refresh([FromBody] string refreshToken)
    {
        var existing = _ctx.RefreshTokens!
            .SingleOrDefault(r => r.Token == refreshToken);

        if (existing == null 
            || existing.Revoked != null 
            || existing.Expires < DateTime.UtcNow)
        {
            return Unauthorized();
        }

        existing.Revoked = DateTime.UtcNow;

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, existing.UserId!),
        };
        var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var jwt   = new JwtSecurityToken(
            issuer:             _jwt.Issuer,
            audience:           _jwt.Audience,
            claims:             claims,
            expires:            DateTime.UtcNow.AddMinutes(_jwt.ExpiresInMinutes),
            signingCredentials: creds
        );

        var newAccessToken = new JwtSecurityTokenHandler().WriteToken(jwt);

        var newRt = new RefreshToken
        {
            UserId  = existing.UserId,
            Token   = Guid.NewGuid().ToString("N"),
            Expires = DateTime.UtcNow.AddDays(7)
        };

        _ctx.RefreshTokens!.Add(newRt);
        _ctx.SaveChanges();

        // return both tokens
        return Ok(new
        {
            accessToken  = newAccessToken,
            refreshToken = newRt.Token
        });
    }

    [HttpPost("revoke")]
    public IActionResult Revoke([FromBody] string refreshToken)
    {
        var existing = _ctx.RefreshTokens!
            .SingleOrDefault(r => r.Token == refreshToken);

        if (existing == null)
            return NotFound(new { message = "Refresh token not found" });

        existing.Revoked = DateTime.UtcNow;
        _ctx.SaveChanges();

        return NoContent();
    }
}

