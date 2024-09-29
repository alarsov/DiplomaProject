using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearningAPI.Migrations
{
    /// <inheritdoc />
    public partial class RemoveQuizMaterialTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "QuizMaterials");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "QuizMaterials",
                columns: table => new
                {
                    QuizId = table.Column<int>(type: "int", nullable: false),
                    MaterialId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuizMaterials", x => new { x.QuizId, x.MaterialId });
                    table.ForeignKey(
                        name: "FK_QuizMaterials_QuizResult_QuizId",
                        column: x => x.QuizId,
                        principalTable: "QuizResult",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuizMaterials_UploadFiles_MaterialId",
                        column: x => x.MaterialId,
                        principalTable: "UploadFiles",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_QuizMaterials_MaterialId",
                table: "QuizMaterials",
                column: "MaterialId");
        }
    }
}
