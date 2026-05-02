using Microsoft.AspNetCore.Mvc;
using EMS.MvcApp.Models;
using System.Text;
using System.Text.Json;

namespace EMS.MvcApp.Controllers
{
    public class EmployeeController : Controller
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiBase;
        private readonly JsonSerializerOptions _jsonOptions = new() { PropertyNameCaseInsensitive = true };

        public EmployeeController(IHttpClientFactory factory, IConfiguration config)
        {
            _httpClient = factory.CreateClient();
            _apiBase = config["ApiSettings:BaseUrl"] + "/api/employee";
        }

        // GET: /Employee
        public async Task<IActionResult> Index()
        {
            var response = await _httpClient.GetAsync(_apiBase);
            if (!response.IsSuccessStatusCode) return View(new List<Employee>());
            var json = await response.Content.ReadAsStringAsync();
            var employees = JsonSerializer.Deserialize<List<Employee>>(json, _jsonOptions) ?? new();
            return View(employees);
        }

        // GET: /Employee/Details/5
        public async Task<IActionResult> Details(int id)
        {
            var response = await _httpClient.GetAsync($"{_apiBase}/{id}");
            if (!response.IsSuccessStatusCode) return NotFound();
            var json = await response.Content.ReadAsStringAsync();
            var employee = JsonSerializer.Deserialize<Employee>(json, _jsonOptions);
            return View(employee);
        }

        // GET: /Employee/Create
        public IActionResult Create() => View();

        // POST: /Employee/Create
        [HttpPost, ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Employee employee)
        {
            if (!ModelState.IsValid) return View(employee);
            var content = new StringContent(JsonSerializer.Serialize(employee), Encoding.UTF8, "application/json");
            await _httpClient.PostAsync(_apiBase, content);
            return RedirectToAction(nameof(Index));
        }

        // GET: /Employee/Edit/5
        public async Task<IActionResult> Edit(int id)
        {
            var response = await _httpClient.GetAsync($"{_apiBase}/{id}");
            if (!response.IsSuccessStatusCode) return NotFound();
            var json = await response.Content.ReadAsStringAsync();
            var employee = JsonSerializer.Deserialize<Employee>(json, _jsonOptions);
            return View(employee);
        }

        // POST: /Employee/Edit/5
        [HttpPost, ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Employee employee)
        {
            if (id != employee.Id) return BadRequest();
            if (!ModelState.IsValid) return View(employee);
            var content = new StringContent(JsonSerializer.Serialize(employee), Encoding.UTF8, "application/json");
            await _httpClient.PutAsync($"{_apiBase}/{id}", content);
            return RedirectToAction(nameof(Index));
        }

        // GET: /Employee/Delete/5
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _httpClient.GetAsync($"{_apiBase}/{id}");
            if (!response.IsSuccessStatusCode) return NotFound();
            var json = await response.Content.ReadAsStringAsync();
            var employee = JsonSerializer.Deserialize<Employee>(json, _jsonOptions);
            return View(employee);
        }

        // POST: /Employee/Delete/5
        [HttpPost, ActionName("Delete"), ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            await _httpClient.DeleteAsync($"{_apiBase}/{id}");
            return RedirectToAction(nameof(Index));
        }
    }
}
