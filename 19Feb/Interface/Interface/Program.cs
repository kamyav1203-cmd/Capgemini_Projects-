namespace Abstraction
{
    public abstract class CalcArea
    {
        public abstract void calcArea(double radius);

        public void bfunction()
        {
            Console.WriteLine("I am Non Abstract Method");
        }
    }
    interface IVolume
    {
        void calcVolume(int side);
    }

    public class CercleCube: CalcArea , IVolume
    {
        public override void calcArea(double radius)
        {
            double pi = 3.14;
            double result;
            result = 3.14 * radius * radius;
            Console.WriteLine("Area of the circle: " + result);
        }
        public void calcVolume(int side)
        {
            int result;
            result = side * side * side;
            Console.WriteLine("Volume of the cube: " + result);
        }
    }
    class TestApp
    {
        public static void Main(string[] args)
        {
            CercleCube cc = new CercleCube();

            double radius;
            int side;
            Console.WriteLine("Enter the radius of the circle:");
            radius = Convert.ToDouble(Console.ReadLine());
            cc.calcArea(radius);
            cc.bfunction();
            Console.WriteLine("Enter the side of the cube:");
            side = Convert.ToInt32(Console.ReadLine());
            cc.calcVolume(side);
            Console.ReadLine();
        }
    }
}