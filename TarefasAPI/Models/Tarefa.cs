namespace TarefasAPI.Models;

public class Tarefa
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public string Status { get; set; } = "Pendente"; // "Pendente" ou "Concluída"
    public DateTime DataCriacao { get; set; } = DateTime.Now;
}