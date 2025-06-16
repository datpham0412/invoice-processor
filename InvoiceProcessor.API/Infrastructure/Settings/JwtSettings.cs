namespace InvoiceProcessor.API.Infrastructure.Settings
{
    public record JwtSettings
    {
        public string Key { get; init; } = default!;
        public string Issuer { get; init; } = default!;
        public string Audience { get; init; } = default!;
        public int    ExpiresInMinutes { get; init; } = 60;
    }
}
