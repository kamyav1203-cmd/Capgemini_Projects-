using System;

class BankAccount
{
    public string accountNumber { get; }
    public double balance { get; private set; }

    public BankAccount(string accNo, double initialDeposit)
    {
        accountNumber = accNo;
        balance = initialDeposit;
    }

    public virtual bool Deposit(double amount)
    {
        if (amount > 0)
        {
            balance += amount;
            return true;
        }
        return false;
    }

    public virtual bool Withdraw(double amount)
    {
        if (amount > 0 && balance >= amount)
        {
            balance -= amount;
            return true;
        }
        return false;
    }

    public double GetBalance()
    {
        return balance;
    }

    protected void SetBalance(double newBalance)
    {
        balance = newBalance;
    }
}

class SavingsAccount : BankAccount
{
    public double interestRate;
    public double minimumBalance = 1000;

    public SavingsAccount(string accNo, double initialDeposit)
        : base(accNo, initialDeposit) { }

    public override bool Withdraw(double amount)
    {
        if (GetBalance() - amount < minimumBalance)
        {
            Console.WriteLine($"Withdrawal Failed: Minimum balance requirement {minimumBalance}");
            return false;
        }

        return base.Withdraw(amount);
    }

    public void ApplyInterest(double rate)
    {
        interestRate = rate;
        double newBalance = GetBalance() + (GetBalance() * interestRate / 100);
        SetBalance(newBalance);

        Console.WriteLine($"Interest Applied,Rate:{interestRate},New Balance:{GetBalance()}");
    }
}

class CurrentAccount : BankAccount
{
    public double overdraftLimit = 2000;
    public double transactionFee = 50;

    public CurrentAccount(string accNo, double initialDeposit)
        : base(accNo, initialDeposit) { }

    public override bool Withdraw(double amount)
    {
        if (GetBalance() + overdraftLimit >= amount)
        {
            SetBalance(GetBalance() - amount);
            return true;
        }

        Console.WriteLine("Withdrawal Failed: Overdraft limit exceeded");
        return false;
    }

    public void DeductTransactionFee()
    {
        SetBalance(GetBalance() - transactionFee);
        Console.WriteLine($"Fee Deducted,Amount:{transactionFee},Remaining:{GetBalance()}");
    }
}

class Program
{
    static void Main()
    {
        string accountType = Console.ReadLine();
        string accountNumber = Console.ReadLine();
        double initialDeposit = double.Parse(Console.ReadLine());

        BankAccount account;

        if (accountType == "Savings")
        {
            account = new SavingsAccount(accountNumber, initialDeposit);
        }
        else
        {
            account = new CurrentAccount(accountNumber, initialDeposit);
        }

        while (true)
        {
            string input = Console.ReadLine();
            if (string.IsNullOrEmpty(input)) break;

            var parts = input.Split();

            switch (parts[0])
            {
                case "Deposit":
                    account.Deposit(double.Parse(parts[1]));
                    break;

                case "Withdraw":
                    account.Withdraw(double.Parse(parts[1]));
                    break;

                case "GetBalance":
                    Console.WriteLine($"Current Balance: {account.GetBalance()}");
                    break;

                case "ApplyInterest":
                    if (account is SavingsAccount sa)
                        sa.ApplyInterest(double.Parse(parts[1]));
                    break;

                case "DeductTransactionFee":
                    if (account is CurrentAccount ca)
                        ca.DeductTransactionFee();
                    break;
            }
        }
    }
}