using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TaskManager.Api.Data;

#nullable disable

namespace TaskManager.Api.Migrations;

[DbContext(typeof(AppDbContext))]
partial class AppDbContextModelSnapshot : ModelSnapshot
{
    protected override void BuildModel(ModelBuilder modelBuilder)
    {
#pragma warning disable 612, 618
        modelBuilder
            .HasAnnotation("ProductVersion", "8.0.4")
            .HasAnnotation("Relational:MaxIdentifierLength", 128);

        SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

        modelBuilder.Entity("TaskManager.Api.Models.Tarefa", b =>
        {
            b.Property<int>("Id")
                .ValueGeneratedOnAdd()
                .HasColumnType("int");

            SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

            b.Property<DateTime>("DataCriacao")
                .ValueGeneratedOnAdd()
                .HasColumnType("datetime2")
                .HasDefaultValueSql("GETUTCDATE()");

            b.Property<string>("Descricao")
                .IsRequired()
                .HasMaxLength(500)
                .HasColumnType("nvarchar(500)");

            b.Property<string>("Status")
                .IsRequired()
                .HasMaxLength(20)
                .HasColumnType("nvarchar(20)");

            b.Property<string>("Titulo")
                .IsRequired()
                .HasMaxLength(120)
                .HasColumnType("nvarchar(120)");

            b.HasKey("Id");

            b.ToTable("Tarefas", (string)null);
        });
#pragma warning restore 612, 618
    }
}
