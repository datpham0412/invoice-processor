using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InvoiceProcessor.API.Migrations
{
    public partial class AddPoNumberToInvoice : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PoNumber",
                table: "Invoices",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PoNumber",
                table: "Invoices");
        }
    }
}
