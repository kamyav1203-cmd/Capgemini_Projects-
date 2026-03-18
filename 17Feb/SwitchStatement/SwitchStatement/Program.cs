// Program to implement Switch statement using default goto etc
using System;
class SwitchUser
{
    public static void Main()
    {
        string Myinput;
        int myint;

        begin:

        Console.WriteLine("Please enter a number between 1 and 3: ");
        Myinput = Console.ReadLine();
        myint = int.Parse(Myinput);

        switch (myint)
        {
            case 1:
                Console.WriteLine("Your number is {0}", myint);
                break;
            case 2:
                Console.WriteLine("YOur number is {0}",myint);
                break;
            case 3:
                Console.WriteLine("YOur number is {0}", myint);
                break;
            default:
                Console.WriteLine("YOur number is not between 1 and 3", myint);
                break;
        }

    }
}