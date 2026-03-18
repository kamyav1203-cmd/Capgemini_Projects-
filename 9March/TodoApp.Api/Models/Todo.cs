namespace TodoApp.Api.Models;

public enum Priority { Low = 1, Medium = 2, High = 3 }

public class Todo
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public Priority Priority { get; set; } = Priority.Medium;
}
