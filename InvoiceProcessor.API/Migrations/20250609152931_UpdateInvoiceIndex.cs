using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InvoiceProcessor.API.Migrations
{
    public partial class UpdateInvoiceIndex : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Invoices_VendorName_InvoiceNumber",
                table: "Invoices",
                columns: new[] { "VendorName", "InvoiceNumber" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Invoices_VendorName_InvoiceNumber",
                table: "Invoices");
        }
    }
}
