Member_pindena
---
BNID int PK
Fornavn varchar
Etternavn varchar
E-post varchar
Bedrift_Organisasjon varchar
Org_nr varchar
Mobil varchar
Typemedlem int

Member_inkl
---
LisensKundeNr int PK
LisensAktorNr int PK
LisensNavn varchar
Lisensen int
LisensnavnHovedbedrift varchar
Bransje int
BransjeNavn varchar
Included int
Extra int
InklLaug int
BergenUP int
ExtraLaug int
Gratis int
InklHonnør int
InklStudent int
GratisUP int

Contact
---
ContactFor int FK >- Member_inkl.LisensAktorNr
Title varchar
AssociateNo int PK
CreditDenied int
ChangedDate datetime
CreatedDate datetime
OrgUnit1No int
Information1 varchar
Information2 varchar
Information3 varchar
Information4 varchar
Information5 varchar
Information6 varchar
Information7 varchar
Information8 varchar
Name varchar
MobilePhone varchar
EmailAddress varchar
Phone varchar
PostCode varchar
PostalArea varchar
CountryNo int
AddressLine1 varchar
AddressLine2 varchar

Member_enkel
---
ID int PK FK >- Member_inkl.LisensAktorNr
MorID int FK >- Member_enkel.ID
MorKundeNr int
MorNavn varchar
Lisensnavn_Hovedbedrift varchar
KundeNr int
BedriftNavn varchar
MedlemNavn varchar
Lisensnavn_Bedrift varchar
LisensNavn_Medlem varchar
Hovedkontakt int
E_post varchar
Mobil varchar

Customer
---
CustomerNo int PK
EmployeeNo int FK >- Employee.EmployeeNo
SellerNo int
CompanyNo varchar
CustomerPriceGroup1 int
CustomerPriceGroup2 int
CustomerPriceGroup3 int
AssociateNo int FK >- Member_pindena.BNID
CreditDenied int
ChangedDate datetime
CreatedDate datetime
OrgUnit1No int
Information1 varchar
Information2 varchar
Information3 varchar
Information4 varchar
Information5 varchar
Information6 varchar
Information7 varchar
Information8 varchar
Name varchar
MobilePhone varchar
EmailAddress varchar
Phone varchar
PostCode varchar
PostalArea varchar
CountryNo int
AddressLine1 varchar
AddressLine2 varchar

Employee
---
EmployeeNo int PK
UserName varchar
AssociateNo int FK >- Member_pindena.BNID
CreditDenied int
ChangedDate datetime
CreatedDate datetime
OrgUnit1No int
Information1 varchar
Information2 varchar
Information3 varchar
Information4 varchar
Information5 varchar
Information6 varchar
Information7 varchar
Information8 varchar
Name varchar
MobilePhone varchar
EmailAddress varchar
Phone varchar
PostCode varchar
PostalArea varchar
CountryNo int
AddressLine1 varchar
AddressLine2 varchar

SalesOrder
---
OrderNo int PK
CustomerNo int FK >- Customer.CustomerNo
EmployeeNo int FK >- Employee.EmployeeNo
WarehouseNo int
Currency varchar
GrandTotal float
TotalVat float
Label varchar
Official int
ChangedDate datetime
CreatedDate datetime
InvoiceNo varchar
InvoiceDate datetime
RequiredDeliveryDate datetime
DeliveryAddress1 varchar
DeliveryAddress2 varchar
DeliveryName varchar
DeliveryPostCode varchar
DeliveryPostalArea varchar
DeliveryCountryNo int
DeliveryMethod int
OrderType int
OrderDate datetime
SellerOrBuyer int
OurReference varchar
YourReference varchar
Group1 int
Information1 varchar
Information2 varchar
Information3 varchar
Information4 varchar
Information5 varchar
Information6 varchar
OrgUnit1No int
OrgUnit2No int
OrgUnit3No int
OrgUnit4No int
OrgUnit5No int
OrgUnit6No int

Product
---
ProductNo varchar PK
ReplacementProductNo varchar
Description varchar
DefaultSalesUnitsNo int
EanItemNo varchar
Group12 int
ChangedDate datetime
CreatedDate datetime

Unit
---
UnitNo int PK
Description varchar
Height varchar
Length varchar
Volume varchar
QuantityPerUnit varchar
EdiUnit varchar
ChangedDate datetime
CreatedDate datetime

PriceMatrix
---
ProductNo varchar FK >- Product.ProductNo
CustomerNo int FK >- Customer.CustomerNo
CostPriceInCurrency float
SuggestedPriceInCurrency float
FromDate datetime
ToDate datetime
OrgUnit1No int
OrgUnit2No int
OrgUnit3No int
OrgUnit4No int
OrgUnit5No int
SupplierNo int
MinQuantity float
SalesPrice1InCurrency float
CustomerPriceGroup1 int
CustomerPriceGroup2 int
CustomerPriceGroup3 int
ProductPriceGroup1 int
ProductPriceGroup2 int
ProductPriceGroup3 int
ChangedDate datetime
CreatedDate datetime

