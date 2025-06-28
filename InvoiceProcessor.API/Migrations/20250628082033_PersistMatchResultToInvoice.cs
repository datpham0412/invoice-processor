using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InvoiceProcessor.API.Migrations
{
    public partial class PersistMatchResultToInvoice : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DiscrepanciesJson",
                table: "Invoices",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ExceptionRecordsJson",
                table: "Invoices",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FailureReason",
                table: "Invoices",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsMatched",
                table: "Invoices",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MatchConfidence",
                table: "Invoices",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MatchType",
                table: "Invoices",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MatchedFieldsJson",
                table: "Invoices",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiscrepanciesJson",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "ExceptionRecordsJson",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "FailureReason",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "IsMatched",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "MatchConfidence",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "MatchType",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "MatchedFieldsJson",
                table: "Invoices");
        }
    }
}
