using InvoiceProcessor.API.Domain.Entities;
namespace InvoiceProcessor.API.Application.Interfaces;

public interface IUserService
{
    Task<bool> ExistsAsync(string userName);
    Task<string> CreateAsync(string userName, string password);  
    Task<AppUser?> ValidateCredentialsAsync(string userName, string password); 
}