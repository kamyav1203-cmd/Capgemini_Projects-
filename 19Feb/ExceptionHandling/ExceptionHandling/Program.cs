//using System;
//class ExcDemo1
//{
//    public static void Main()
//    {
//        int[] nums = new int[4];
//        try
//        {
//            Console.WriteLine("Before exception is generated.");
//            //Generate an index out of bounds exception.
//            for (int i = 0; i < 10; i++)
//            {
//                nums[i] = i;
//                Console.WriteLine("nums[{0}]:{1}", i, nums[i]);
//            }
//            Console.WriteLine("This will not be displayed.");
//        }
//        catch (IndexOutOfRangeException)
//        {
//            //catch the exception 
//            Console.WriteLine("Index out-of-bounds exception occurred.");
//        } 
//        Console.WriteLine("After catch block.");
//    }
//}


using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CustomExceptionExampleCode
{
    class MyException : Exception
    {
        public MyException(string message) : base(message)
        {

        }
        public MyException() { }
        public MyException(string message, Exception inner) : base(message, inner)
        {
        }
    }
}