using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime;
using System.Runtime.CompilerServices;

namespace ProductDemo
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public bool IsStock { get; set; }
    }
    public class ProductCatalog
    {
        private List<Product> products;
        public ProductCatalog()
        {
            //products = new List<Product>
            //{
            ////    new Product { Id = 100, Name = "Laptop", Description = "Electronics Item", Price = 75000, IsStock = true },
            ////    new Product { Id = 101, Name = "Smartphone", Description = "Electronics Item", Price = 55000, IsStock = true },
            ////    new Product { Id = 102, Name = "Desk", Description = "Furniture", Price = 5000, IsStock = false },
            ////    new Product { Id = 103, Name = "Notebook", Description = "Furniture", Price = 750, IsStock = false },
            //};
            products = new List<Product>();
            //Allow users to add data and creat an in memory collection 
            
        }
        public void AddProduct()
        {
            Product product = new Product();
            Console.WriteLine("\nEnter Product Details:");
            Console.Write("Enter Product Id: ");
            product.Id = Convert.ToInt32(Console.ReadLine());
            Console.Write("Enter Product Name: ");
            product.Name = Console.ReadLine();
            Console.Write("Enter Product Description: ");
            product.Description = Console.ReadLine();
            Console.Write("Enter Product Price: ");
            product.Price = Convert.ToDouble(Console.ReadLine());
            Console.Write("Is the Product in Stock? (true/false): ");
            product.IsStock = Convert.ToBoolean(Console.ReadLine());

            products.Add(product);
        }
        public void DisplayProducts()
        {
            Console.WriteLine("\n--- Product Catalog ---");
            if (products.Count == 0)
            {
                Console.WriteLine("No products in catalog.");
            }
            else
            {
                foreach (var product in products)
                {
                    Console.WriteLine($"Id: {product.Id}, Name: {product.Name}, Description: {product.Description}, Price: {product.Price}, In Stock: {product.IsStock}");
                }
            }
        }

        public bool DeleteProduct(int id)
        {
            var productid = products.FirstOrDefault(p => p.Id == id);
            if(productid == null)
            {
                return false;
            }
            products.Remove(productid);
            Console.WriteLine($"Product with Id {id} has been deleted.");
            return true;
        }
    }
    class TestProduct
    {
        static void Main(string[] args)
        {
            ProductCatalog catalog = new ProductCatalog();
            int choice;
            do
            {
                Console.WriteLine("\n--- Product Catalog Menu ---");
                Console.WriteLine("1. Add Product");
                Console.WriteLine("2. Display Products");
                Console.WriteLine("3. Delete Product");
                Console.WriteLine("4. Exit");
                Console.Write("Enter your choice: ");

                if (int.TryParse(Console.ReadLine(), out choice))
                {
                    switch (choice)
                    {
                        case 1:
                            Console.WriteLine("\nAdding Product...");
                            catalog.AddProduct();
                            Console.WriteLine("Product added successfully!");
                            break;
                        case 2:
                            Console.WriteLine("\nDisplaying Products...");
                            catalog.DisplayProducts();
                            break;
                        case 3:
                            Console.WriteLine("\nDeleting Product...");
                            Console.Write("Enter Product Id to delete: ");
                            if (int.TryParse(Console.ReadLine(), out int productId))
                            {
                                if (!catalog.DeleteProduct(productId))
                                {
                                    Console.WriteLine($"Product with Id {productId} not found.");
                                }
                            }
                            else
                            {
                                Console.WriteLine("Invalid input. Please enter a valid Product Id.");
                            }
                            break;
                        case 4:
                            Console.WriteLine("\nExiting...");
                            break;
                        default:
                            Console.WriteLine("\nInvalid choice. Please try again.");
                            break;
                    }
                }
                else
                {
                    Console.WriteLine("\nInvalid input. Please enter a number.");
                    choice = 0;
                }
            } while (choice != 4);
        }
    }

}