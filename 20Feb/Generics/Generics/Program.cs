using System;

namespace GenericDemo
{
    class UsingGenerics<T>
    {
        T obj;

        public UsingGenerics(T obj)
        {
            this.obj = obj;
        }

        public T Get()
        {
            return obj;
        }

        public void ShowType()
        {
            Console.WriteLine("Type of T is " + typeof(T));
        }
    }

    class TestGenerics
    {
        public static void Main(string[] args)
        {
            UsingGenerics<int> objdata;
            objdata = new UsingGenerics<int>(500);
            objdata.ShowType();

            UsingGenerics<string> objdatastr;
            objdatastr = new UsingGenerics<string>("Kashish");
            objdatastr.ShowType();
        }
    }
}