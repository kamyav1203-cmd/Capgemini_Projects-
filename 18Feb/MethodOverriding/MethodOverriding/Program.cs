class GroupAgent
{
    public virtual void show()
    {
        Console.WriteLine("Group Agent Created !!!");
        Console.ReadLine();

    }
    class Agent : GroupAgent
    {
        public override void show()
        {
            Console.WriteLine("Agent Created !!!");
            Console.ReadLine();
        }
    }
    class ODLExercise
    {
        public static void Main(string[] args)
        {
            GroupAgent a1 = new GroupAgent();
            a1.show();
            Agent b1 = new Agent();
            b1.show();
            GroupAgent a2 = new Agent();
            a2.show();
        }
    }

}