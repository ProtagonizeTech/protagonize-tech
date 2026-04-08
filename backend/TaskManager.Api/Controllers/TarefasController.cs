using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Data;
using TaskManager.Api.Models;

namespace TaskManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TarefasController(AppDbContext context) : ControllerBase
{
    private static readonly string[] StatusValidos = ["Pendente", "Concluida"];

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Tarefa>>> Get()
    {
        var tarefas = await context.Tarefas
            .OrderByDescending(t => t.DataCriacao)
            .ToListAsync();

        return Ok(tarefas);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Tarefa>> GetById(int id)
    {
        var tarefa = await context.Tarefas.FindAsync(id);

        return tarefa is null ? NotFound() : Ok(tarefa);
    }

    [HttpPost]
    public async Task<ActionResult<Tarefa>> Post([FromBody] Tarefa tarefa)
    {
        if (!StatusEhValido(tarefa.Status))
        {
            return BadRequest(new { message = "Status deve ser Pendente ou Concluida." });
        }

        tarefa.Id = 0;
        tarefa.DataCriacao = DateTime.UtcNow;

        context.Tarefas.Add(tarefa);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = tarefa.Id }, tarefa);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Put(int id, [FromBody] Tarefa tarefaAtualizada)
    {
        if (id != tarefaAtualizada.Id)
        {
            return BadRequest(new { message = "O ID da rota deve ser igual ao ID do corpo." });
        }

        if (!StatusEhValido(tarefaAtualizada.Status))
        {
            return BadRequest(new { message = "Status deve ser Pendente ou Concluida." });
        }

        var tarefaExistente = await context.Tarefas.FindAsync(id);
        if (tarefaExistente is null)
        {
            return NotFound();
        }

        tarefaExistente.Titulo = tarefaAtualizada.Titulo;
        tarefaExistente.Descricao = tarefaAtualizada.Descricao;
        tarefaExistente.Status = tarefaAtualizada.Status;

        await context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var tarefa = await context.Tarefas.FindAsync(id);
        if (tarefa is null)
        {
            return NotFound();
        }

        context.Tarefas.Remove(tarefa);
        await context.SaveChangesAsync();

        return NoContent();
    }

    private static bool StatusEhValido(string status) =>
        StatusValidos.Contains(status, StringComparer.OrdinalIgnoreCase);
}
