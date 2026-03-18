using System;
//using static
//class ODLExercise
//{
//    private static int number;
//    public static int Number     {
//        get { return number; }
//    }
//    static ODLExercise()
//    {
//        Random r = new Random();
//        number = r.Next();
//    }
//}
//class Program
//{
//    static void Main(string[] args)
//    {
//        Console.WriteLine("Static Number = " + ODLExercise.Number);
//    }
//}

//without static
//class ODLExercise
//{
//    private int number;
//    public int Number     {
//        get { return number; }
//    }
//    public ODLExercise()
//    {
//        Random r = new Random();
//        number = r.Next();
//    }
//}
//class Program
//{
//    static void Main(string[] args)
//    {
//        ODLExercise num = new ODLExercise();
//        Console.WriteLine("Not Static Number = " + num.Number);
//    }
//}

class ODLExercise
{
    private int number;
    public int Number
    {
        get
        {
            return number;
        }
    }
    public ODLExercise()
    {
        Random r = new Random();
        number = r.Next();
    }
    public ODLExercise(int seed)
    {
        Random r = new Random(seed);
        number = r.Next();
    }
}
class Program
{
    static void Main(string[] args)
    {
        ODLExercise num = new ODLExercise();

        Console.WriteLine("Static Number = " + num.Number);
        ODLExercise num1 = new ODLExercise(500);
        Console.WriteLine("Static Speed = " + num1.Number);
    }
}
