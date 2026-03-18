//Program to sort string Array
using System;
class OLDEXample
{
    public static void Main()
    {
        string[] stringArray = new string[] { "Csharp", "ASP.net", "EntityFramework", "ADO.net", "WCF" };
        Array.Sort(stringArray);
        foreach (string str in stringArray)
        {
            Console.WriteLine(str + " ");
        }
    }
}