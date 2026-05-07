using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TarefasAPI.Data;
using TarefasAPI.Models;

[ApiController]
[Route("api/[controller]")]
public class TarefasController : ControllerBase
{
    private readonly AppDbContext _context;
    public TarefasController(AppDbContext context) => _context = context;

    // GET /api/tarefas
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _context.Tarefas.ToListAsync());

    // GET /api/tarefas/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var tarefa = await _context.Tarefas.FindAsync(id);
        return tarefa is null ? NotFound() : Ok(tarefa);
    }

    // POST /api/tarefas
    [HttpPost]
    public async Task<IActionResult> Create(Tarefa tarefa)
    {
        tarefa.DataCriacao = DateTime.Now;
        _context.Tarefas.Add(tarefa);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = tarefa.Id }, tarefa);
    }

    // PUT /api/tarefas/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Tarefa tarefa)
    {
        if (id != tarefa.Id) return BadRequest();
        _context.Entry(tarefa).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE /api/tarefas/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var tarefa = await _context.Tarefas.FindAsync(id);
        if (tarefa is null) return NotFound();
        _context.Tarefas.Remove(tarefa);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}