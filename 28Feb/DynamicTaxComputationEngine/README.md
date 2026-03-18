Question
2
Dynamic Tax Computation Engine
Description
1. Scenario Overview
You are building a Dynamic Tax Computation Engine for a finance application.

Different tax categories calculate tax differently:

Individual Tax → Based on income slabs
Business Tax → Based on income + surcharge
Senior Citizen Tax → Special exemption rules
Key Constraints
Tax rules change every financial year
Core tax engine must remain unchanged
Tax computation must return calculated value
This scenario uses Func delegate for computation.

2. Functional Requirements
2.1 Entity Class
TaxPayer
Properties:

int TaxPayerId
string Name
double Income
double Surcharge
2.2 Func Definition
Func<TaxPayer, double>
Purpose:

Represents a tax computation rule
Accepts TaxPayer data
Returns calculated tax amount
2.3 Tax Rule Definitions
IndividualTaxRule
Rule:

Tax = Income × 10%
BusinessTaxRule
Rule:

Tax = (Income × 15%) + Surcharge
SeniorCitizenTaxRule
Rule:

Tax = Income × 5%
3. Tax Engine (Core Component)
TaxEngine Responsibilities
Accept TaxPayer data
Accept Func delegate
Invoke function
Display tax amount
Important Design Rule
TaxEngine must NOT contain tax rules
Core Method
Compute(TaxPayer taxPayer, string category, Func<TaxPayer, double> calculator)
4. Main() Method – Runtime Configuration
Step-by-Step Operations in Main()
Create tax payer object
Define tax computation functions
Create tax engine
Compute individual tax
Compute business tax
Compute senior citizen tax
5. Hardcoded Dataset
TaxPayerId : 801
Name       : Ravi
Income     : 800000
Surcharge  : 20000
6. Expected Output
========= TAX COMPUTATION =========
Name     : Ravi
Category : Individual
Tax      : 80000
---------------------------------

========= TAX COMPUTATION =========
Name     : Ravi
Category : Business
Tax      : 140000
---------------------------------

========= TAX COMPUTATION =========
Name     : Ravi
Category : Senior Citizen
Tax      : 40000
---------------------------------