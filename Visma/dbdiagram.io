Table Employee {
  EmployeeNo int [pk]
  UserName varchar
  AssociateNo int [ref: > Contact.AssociateNo, ref: > Customer.AssociateNo, ref: > Member_pindena.BNID]
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
}

Table Customer {
  CustomerNo int [pk]
  EmployeeNo int [ref: > Employee.EmployeeNo]
  SellerNo int
  CompanyNo varchar
  CustomerPriceGroup1 int
  CustomerPriceGroup2 int
  CustomerPriceGroup3 int
  AssociateNo int [ref: > Contact.AssociateNo, ref: > Member_pindena.BNID]
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
}

Table Contact {
  ContactFor int [ref: > Customer.CustomerNo, ref: > Member_inkl.LisensAktørNr]
  Title varchar
  AssociateNo int [pk]
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
}

Table SalesOrder {
  OrderNo int [pk]
  CustomerNo int [ref: > Customer.CustomerNo]
  EmployeeNo int [ref: > Employee.EmployeeNo]
  WarehouseNo int [ref: > Warehouse.WarehouseNo]
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
}

Table Warehouse {
  WarehouseNo int [pk]
  Name varchar
  AddressLine1 varchar
  AddressLine2 varchar
  PostCode varchar
  PostalArea varchar
  CountryNo int
  ChangedDate datetime
  CreatedDate datetime
}

Table Product {
  ProductNo varchar [pk]
  ReplacementProductNo varchar
  Description varchar
  DefaultSalesUnitsNo int
  EanItemNo varchar
  Group12 int
  ChangedDate datetime
  CreatedDate datetime
}

Table Unit {
  UnitNo int [pk]
  Description varchar
  Height varchar
  Length varchar
  Volume varchar
  QuantityPerUnit varchar
  EdiUnit varchar
  ChangedDate datetime
  CreatedDate datetime
}

Table PriceMatrix {
  ProductNo varchar [ref: > Product.ProductNo]
  CustomerNo int [ref: > Customer.CustomerNo]
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
}

Table Member_pindena {
  BNID int [pk]
  Fornavn varchar
  Etternavn varchar
  "E-post" varchar
  Bedrift_Organisasjon varchar
  Org_nr varchar
  Mobil varchar
  Typemedlem int
}

Table Member_inkl {
  LisensKundeNr int [pk, ref: > Customer.CustomerNo]
  LisensAktørNr int
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
}

Table Member_enkel {
  ID int [pk, ref: > Member_inkl.LisensAktørNr]
  MorID int [ref: > Member_enkel.ID]
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
}

Table Country {
  CountryNo int [pk]
  IsoCode varchar
  LanguageNo int
  Name varchar
  ChangedDate datetime
  CreatedDate datetime
}

Table OrgUnit1 {
  OrgUnit1No int [pk]
  ChangedDate datetime
  CreatedDate datetime
  OrgUnit2No int
  Name varchar
  CustomerNo int
  Group12 int
}

Table OrgUnit2 {
  OrgUnit2No int [pk]
  ChangedDate datetime
  CreatedDate datetime
  OrgUnit1No int
  Name varchar
  CustomerNo int
  Group12 int
}