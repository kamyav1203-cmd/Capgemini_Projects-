using Microsoft.AspNetCore.Mvc;
using WebApplication2.Models;

namespace WebApplication2.Controllers
{
    public class ProductController : Controller
    {
        public static List<Products> Products = new List<Products>
    {
        new Products { Id = 1, Name = "A", Price = 10 },
        new Products { Id = 2, Name = "B", Price = 1 },
        new Products { Id = 3, Name = "C", Price = 5 }
    };
        public IActionResult Index()
        {
            return View(Products);
        }
    }
}
