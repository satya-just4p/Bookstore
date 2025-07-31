using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookstoreWebApp.Migrations
{
    /// <inheritdoc />
    public partial class AddColumnToBooksTableMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Synopsis",
                table: "Books",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Synopsis",
                table: "Books");
        }
    }
}
