using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApp.Api.Data;
using TodoApp.Api.Models;

namespace TodoApp.Api.Controllers;

[ApiController]
[Route("api/todo")]
public class TodoController(AppDbContext db) : ControllerBase
{
    // GET /api/todo
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var todos = await db.Todos.ToListAsync();
        return Ok(todos);
    }

    // POST /api/todo
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Todo todo)
    {
        if (string.IsNullOrWhiteSpace(todo.Title))
            return BadRequest("Title is required.");

        todo.Id = 0;
        db.Todos.Add(todo);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = todo.Id }, todo);
    }

    // PUT /api/todo/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Todo updated)
    {
        var todo = await db.Todos.FindAsync(id);
        if (todo is null) return NotFound();

        todo.Title = updated.Title;
        todo.IsCompleted = updated.IsCompleted;
        todo.Priority = updated.Priority;
        await db.SaveChangesAsync();
        return Ok(todo);
    }

    // DELETE /api/todo/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var todo = await db.Todos.FindAsync(id);
        if (todo is null) return NotFound();

        db.Todos.Remove(todo);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
