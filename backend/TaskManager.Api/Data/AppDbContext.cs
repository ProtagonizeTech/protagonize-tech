using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Models;

namespace TaskManager.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Tarefa> Tarefas => Set<Tarefa>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Tarefa>(entity =>
        {
            entity.ToTable("Tarefas");
            entity.HasKey(t => t.Id);
            entity.Property(t => t.Titulo).IsRequired().HasMaxLength(120);
            entity.Property(t => t.Descricao).HasMaxLength(500);
            entity.Property(t => t.Status).IsRequired().HasMaxLength(20);
            entity.Property(t => t.DataCriacao).HasDefaultValueSql("GETUTCDATE()");
        });
    }
}
