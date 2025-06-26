namespace InvoiceProcessor.API.Domain.Entities;
public class RefreshToken
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string? UserId { get; set; }
    public string Token { get; set; } = Guid.NewGuid().ToString("N");
    public DateTime Expires { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateTime? Revoked { get; set; }
}
