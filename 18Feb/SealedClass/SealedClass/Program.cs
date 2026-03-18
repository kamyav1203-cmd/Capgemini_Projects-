using System;

class GroupAgent
{
    public virtual void show()
    {
        Console.WriteLine("GroupAgent show method");
    }
}

class Agent : GroupAgent
{
    public override void show()
    {
        Console.WriteLine("Agent show method");
    }
}
class Booking: Agent
{
    public override void show()
    {
        Console.WriteLine("Booking show method");
    }

}
class Program
{
    static void Main(string[] args)
    {
        Agent agent = new Agent();
        agent.show();
    }
}