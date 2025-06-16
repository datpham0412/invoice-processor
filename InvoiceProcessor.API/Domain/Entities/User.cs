namespace InvoiceProcessor.API.Domain.Entities
{
public class AppUser
    {
        public string  Id       { get; set; } = Guid.NewGuid().ToString();
        public string  UserName { get; set; } = default!;
        public string  Password { get; set; } = default!; 
    }
}