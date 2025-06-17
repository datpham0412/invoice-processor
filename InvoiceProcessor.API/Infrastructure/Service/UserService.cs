using BCrypt.Net;
using InvoiceProcessor.API.Application.Interfaces;
using InvoiceProcessor.API.Domain.Entities;
using InvoiceProcessor.API.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace InvoiceProcessor.API.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _ctx;
    public UserService(AppDbContext ctx) => _ctx = ctx;

    public async Task<bool> ExistsAsync(string userName) =>
        await _ctx.Users!.AnyAsync(u => u.UserName == userName);

    public async Task<string> CreateAsync(string userName, string password)
    {
        // ✔ hash
        var hash = BCrypt.Net.BCrypt.HashPassword(password);

        var user = new AppUser
        {
            Id       = Guid.NewGuid().ToString(),
            UserName = userName,
            Password = hash
        };

        _ctx.Users!.Add(user);
        await _ctx.SaveChangesAsync();
        return user.Id;
    }

    public async Task<AppUser?> ValidateCredentialsAsync(string userName, string password)
    {
        var user = await _ctx.Users!.SingleOrDefaultAsync(u => u.UserName == userName);
        if (user is null) return null;

        return BCrypt.Net.BCrypt.Verify(password, user.Password) ? user : null;
    }
}

