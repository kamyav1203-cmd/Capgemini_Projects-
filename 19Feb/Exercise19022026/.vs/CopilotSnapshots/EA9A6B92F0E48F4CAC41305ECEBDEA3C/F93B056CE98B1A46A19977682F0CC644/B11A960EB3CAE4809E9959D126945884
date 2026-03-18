DrawingObject[] shapes = new DrawingObject[]
{
    new Line(),
    new Circle(),
    new Square()
};

foreach (DrawingObject shape in shapes)
{
    shape.Draw();
}

class DrawingObject
{
    public virtual void Draw()
    {
        Console.WriteLine("Drawing a generic object");
    }
}

class Line : DrawingObject
{
    public override void Draw()
    {
        Console.WriteLine("Drawing a Line");
    }
}

class Circle : DrawingObject
{
    public override void Draw()
    {
        Console.WriteLine("Drawing a Circle");
    }
}

class Square : DrawingObject
{
    public override void Draw()
    {
        Console.WriteLine("Drawing a Square");
    }
}
