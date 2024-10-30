using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace clc1.Migrations
{
    public partial class MigrationCLC : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Person",
                columns: table => new
                {
                    Id = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    Name = table.Column<string>(type: "NVARCHAR2(50)", maxLength: 50, nullable: false),
                    Age = table.Column<byte>(type: "NUMBER(3,0)", nullable: false),
                    Rut = table.Column<int>(type: "NUMBER(8,0)", nullable: false),
                    Dv = table.Column<string>(type: "NVARCHAR2(1)", maxLength: 1, nullable: false),
                    Sexo = table.Column<string>(type: "NVARCHAR2(4)", maxLength: 4, nullable: false, defaultValue: "Otro"),
                    Prev_Salud = table.Column<string>(type: "NVARCHAR2(50)", maxLength: 50, nullable: false),
                    Telefono = table.Column<int>(type: "NUMBER(9,0)", nullable: false),
                    Correo = table.Column<string>(type: "NVARCHAR2(50)", maxLength: 50, nullable: false),
                    Fecha_Ingreso = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Person", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Person");
        }
    }
}
