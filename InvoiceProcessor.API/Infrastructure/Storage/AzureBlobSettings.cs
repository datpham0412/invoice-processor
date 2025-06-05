namespace InvoiceProcessor.API.Infrastructure.Storage
{
    public class AzureBlobSettings
    {
        public string? ConnectionString { get; set; }
        public string? ContainerName { get; set; }
    }
}
