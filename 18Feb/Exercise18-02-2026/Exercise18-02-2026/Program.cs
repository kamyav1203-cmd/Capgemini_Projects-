using System;
using System.IO.Pipes;
namespace AccessModifierDemo
{
    class UsingAccessModifier
    {
        public void publicMethod()
        {
            Console.WriteLine("It's public.");
        }

        private void PrivateMethod()
        {
            Console.WriteLine("It's private.");
        }

        protected void ProtectedMethod()
        {
            Console.WriteLine("It's protected.");
        }

        internal void InternalMethod()
        {
            Console.WriteLine("It's internal.");
        }

        protected internal void ProIntMethod()
        {
            Console.WriteLine("It's protected internal.");
        }

        void SomeMethod()
        {
            Console.WriteLine("Some Metod.");
        }
    }

    class Test
    {
        public static void Main(string[] args)
        {
            UsingAccessModifier obj = new UsingAccessModifier();
            obj.publicMethod();
            obj.InternalMethod();
            obj.ProIntMethod();
            
        }
    }
}