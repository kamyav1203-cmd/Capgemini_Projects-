namespace BillGenerator.Domain.Enums;

/// <summary>
/// Draft bills can be edited; finalized bills are locked and receive an invoice number.
/// </summary>
public enum BillStatus
{
    Draft = 0,
    Finalized = 1
}
