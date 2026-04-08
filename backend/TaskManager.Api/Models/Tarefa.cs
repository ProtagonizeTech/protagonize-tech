using System.ComponentModel.DataAnnotations;

namespace TaskManager.Api.Models;

public class Tarefa
{
    public int Id { get; set; }

    [Required]
    [MaxLength(120)]
    public string Titulo { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Descricao { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "Pendente";

    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
}
