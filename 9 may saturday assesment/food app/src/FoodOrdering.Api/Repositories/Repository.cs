using System.Linq.Expressions;
using FoodOrdering.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace FoodOrdering.Api.Repositories;

public class Repository<T>(ApplicationDbContext dbContext) : IRepository<T> where T : class
{
    public async Task<IReadOnlyList<T>> ListAsync(Expression<Func<T, bool>>? predicate = null, CancellationToken cancellationToken = default)
    {
        IQueryable<T> query = dbContext.Set<T>().AsNoTracking();
        if (predicate is not null)
        {
            query = query.Where(predicate);
        }

        return await query.ToListAsync(cancellationToken);
    }

    public Task<T?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        => dbContext.Set<T>().FindAsync([id], cancellationToken).AsTask();

    public async Task AddAsync(T entity, CancellationToken cancellationToken = default)
        => await dbContext.Set<T>().AddAsync(entity, cancellationToken);

    public void Update(T entity) => dbContext.Set<T>().Update(entity);
    public void Delete(T entity) => dbContext.Set<T>().Remove(entity);
    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default) => dbContext.SaveChangesAsync(cancellationToken);
}
