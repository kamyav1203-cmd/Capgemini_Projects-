using System;
namespace AccessModifierDemo
{
    class UsingAccessModifier
    {
        public void PublicMethod()
        {
            Console.WriteLine("Its Public");
        }
        private void privateMethod()
        {
            Console.WriteLine("Its Private");
        }
        protected void protectedMethod()
        {
            Console.WriteLine("Its Proctected");
        }
        internal void internalMethod()
        {
            Console.WriteLine("Its  Internal ");
        }
        protected internal void protectedinternalMethod()
        {
            Console.WriteLine("Its  Internal Proctected");
        }
    }
    class Test
    {
        static public void Main(string[] args)
        {
            UsingAccessModifier obj = new UsingAccessModifier();
            obj.PublicMethod();
            obj.internalMethod();
            obj.protectedinternalMethod();
            // obj.privateMethod(); // Not Accessible
            // obj.protectedMethod(); // Not Accessible

        }
    }
}