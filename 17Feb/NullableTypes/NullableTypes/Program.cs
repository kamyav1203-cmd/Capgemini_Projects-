using System;
class Program
{
    static void Main(string[] args)
{
        //DateTime? dt = null;
        //dt = DateTime.Now;
        //object o = dt;
        //DateTime? dt2 = o as DateTime?;
        //    if (dt2 != null)
        //    {
        //        Console.WriteLine(dt2.Value.ToString());
        //    }
        //    Console.ReadLine();
        int? j = null;
        int? k = 54;
        int res1 = j ?? 0;
        int res2 = k ?? 0;
        Console.WriteLine("result1 = {0} , result2 = {1}",
            res1, res2);
        Console.ReadLine();
    }
}