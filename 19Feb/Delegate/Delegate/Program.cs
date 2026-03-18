namespace DelegateDemo
{
    class UsingDelegate
    {
        public delegate void ArithmaticOperation(int x, int y);

        static void Add(int x, int y)
        {
            Console.WriteLine($"Addition: {x + y}");
        }
        static void Sub(int x, int y)
        {
            Console.WriteLine($"Subtraction: {x - y}");
        }
        static void Multiply(int x, int y)
        {
            Console.WriteLine($"Multiplication: {x * y}");
        }
        static void Divide(int x, int y)
        {
            Console.WriteLine($"Division: {x / y}");
        }

        static void Main(string[] args)
        {
            //ArithmaticOperation obj1 = new ArithmaticOperation(Add);
            //obj1(45, 30);
            //ArithmaticOperation obj2 = new ArithmaticOperation(Sub);
            //obj2(45, 30);
            //ArithmaticOperation obj3 = new ArithmaticOperation(Multiply);
            //obj3(45, 30);
            //ArithmaticOperation obj4 = new ArithmaticOperation(Divide);
            //obj4(45, 30);
            ArithmaticOperation obj = new ArithmaticOperation(Add);
            obj += new ArithmaticOperation(Sub);
            obj += new ArithmaticOperation(Multiply);
            obj += new ArithmaticOperation(Divide);
            obj(45, 30);
            Console.ReadLine();
        }

    }
}
