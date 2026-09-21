export interface IAccount {
    "id": string,
    "type": "ACCOUNT_TYPE_TINKOFF",
    "name": string,
    "status": string,
    "openedDate": string,
    "closedDate": string,
    "accessLevel": "ACCOUNT_ACCESS_LEVEL_READ_ONLY",
};

export interface IBond {
    "figi": string,
    "instrumentType": string,
    "quantity": {
        "units": string,
        "nano": number,
    },
    "averagePositionPrice": {
        "currency": string,
        "units": string,
        "nano": number,
    },
    "expectedYield": {
        "units": string,
        "nano": number,
    },
    "currentNkd": {
        "currency": string,
        "units": string,
        "nano": number,
    },
    "averagePositionPricePt": {
        "units": string,
        "nano": number,
    },
    "currentPrice": {
        "currency": string,
        "units": string,
        "nano": number,
    },
    "averagePositionPriceFifo": {
        "currency": "rub",
        "units": "898",
        "nano": 510000000,
    },
    "quantityLots": {
        "units": string,
        "nano": number,
    },
    "blocked": false,
    "blockedLots": {
        "units": string,
        "nano": number,
    },
    "positionUid": string,
    "instrumentUid": string,
    "varMargin": {
        "currency": string,
        "units": string,
        "nano": number,
    },
    "expectedYieldFifo": {
        "units": string,
        "nano": number,
    },
    "dailyYield": {
        "currency": string,
        "units": string,
        "nano": number,
    },
    "ticker": "SU26247RMFS5",
    "classCode": "TQOB",
    "varMarginSettled": {
        "currency": "",
        "units": "0",
        "nano": number,
    },
};
export interface IBond2 {
    aciValue
: 
{currency: 'rub', units: '0', nano: 0}
amortizationFlag
: 
false
apiTradeAvailableFlag
: 
true
assetUid
: 
"28887b0a-20a8-409d-b895-e9831a56152e"
blockedTcaFlag
: 
false
bondType
: 
"BOND_TYPE_UNSPECIFIED"
brand
: 
{logoName: 'RU000A101RP4.png', logoBaseColor: '#000000', textColor: '#ffffff'}
buyAvailableFlag
: 
true
classCode
: 
"TQCB"
countryOfRisk
: 
"KZ"
countryOfRiskName
: 
"Республика Казахстан"
couponQuantityPerYear
: 
2
currency
: 
"rub"
dlong
: 
{units: '0', nano: 285700000}
dlongClient
: 
{units: '0', nano: 375600000}
dlongMin
: 
{units: '0', nano: 250000000}
exchange
: 
"moex_weekend_plus_bonds"
figi
: 
"BBG00XH4W3N3"
first1dayCandleDate
: 
"2020-09-23T07:00:00Z"
first1minCandleDate
: 
"2020-09-23T11:09:00Z"
floatingCouponFlag
: 
boolean
forIisFlag
: 
false
forQualInvestorFlag
: 
false
initialNominal
: 
{currency: 'rub', units: '1000', nano: 0}
isin
: 
"RU000A101RZ3"
issueKind
: 
"non_documentary"
issueSize
: 
"10000000"
issueSizePlan
: 
"10000000"
liquidityFlag
: 
true
lot
: 
1
maturityDate
: 
"2030-09-11T00:00:00Z"
minPriceIncrement
: 
{units: '0', nano: 10000000}
name
: 
"Республика Казахстан 11"
nominal
: 
{currency: 'rub', units: '1000', nano: 0}
otcFlag
: 
false
perpetualFlag
: 
false
placementDate
: 
"2020-09-23T00:00:00Z"
placementPrice
: 
{currency: '', units: '0', nano: 0}
positionUid
: 
"2c354d2c-98d0-4705-8370-92e604e31ece"
realExchange
: 
"REAL_EXCHANGE_MOEX"
requiredTests
: 
[]
riskLevel
: 
"RISK_LEVEL_LOW"
sector
: 
"government"
sellAvailableFlag
: 
true
shortEnabledFlag
: 
false
stateRegDate
: 
"2020-07-16T00:00:00Z"
subordinatedFlag
: 
false
ticker
: 
"RU000A101RZ3"
tradingStatus
: 
"SECURITY_TRADING_STATUS_NORMAL_TRADING"
uid
: 
"2dd3b003-aca2-4920-89ce-8d827c637372"
weekendFlag
: 
false
};

export interface IShare {
    apiTradeAvailableFlag
: 
true
assetUid
: 
"ef45ee80-d45e-46d5-88e1-90b8afa68d49"
blockedTcaFlag
: 
false
brand
: 
{logoName: 'US0545402085.png', logoBaseColor: '#0E315E', textColor: '#ffffff'}
buyAvailableFlag
: 
false
classCode
: 
"SPBXM"
countryOfRisk
: 
"US"
countryOfRiskName
: 
"Соединенные Штаты Америки"
currency
: 
"usd"
divYieldFlag
: 
false
exchange
: 
"unknown"
figi
: 
"BBG000DW34S2"
first1dayCandleDate
: 
"2022-01-28T07:00:00Z"
first1minCandleDate
: 
"2022-01-28T12:47:00Z"
forIisFlag
: 
false
forQualInvestorFlag
: 
true
instrumentExchange
: 
"INSTRUMENT_EXCHANGE_UNSPECIFIED"
isin
: 
"US0545402085"
issueSize
: 
"33599897"
issueSizePlan
: 
"75000000"
liquidityFlag
: 
true
lot
: 
1
minPriceIncrement
: 
{units: '0', nano: 10000000}
name
: 
"Axcelis Technologies"
nominal
: 
{currency: 'usd', units: '0', nano: 1000000}
otcFlag
: 
false
positionUid
: 
"12538e47-de55-42f0-a7cd-ec5aa3ab3509"
realExchange
: 
"REAL_EXCHANGE_RTS"
requiredTests
: 
[]
sector
: 
"it"
sellAvailableFlag
: 
false
shareType
: 
"SHARE_TYPE_COMMON"
shortEnabledFlag
: 
false
ticker
: 
"ACLS"
tradingStatus
: 
"SECURITY_TRADING_STATUS_BREAK_IN_TRADING"
uid
: 
"98da7119-dc33-4567-ae41-1944f6f49334"
weekendFlag
: 
false,
};

export interface IEtf {
    apiTradeAvailableFlag
: 
true
assetUid
: 
"1ca14ff7-ab31-4657-9303-b0455a1290cb"
blockedTcaFlag
: 
false
brand
: 
{logoName: 'TGLD.png', logoBaseColor: '#000000', textColor: '#ffffff'}
buyAvailableFlag
: 
true
classCode
: 
"SPBRU"
countryOfRisk
: 
"RU"
countryOfRiskName
: 
"Российская Федерация"
currency
: 
"rub"
dlong
: 
{units: '0', nano: 201800000}
dlongClient
: 
{units: '0', nano: 270600000}
dlongMin
: 
{units: '0', nano: 162800000}
dshort
: 
{units: '0', nano: 200000000}
dshortClient
: 
{units: '0', nano: 290800000}
dshortMin
: 
{units: '0', nano: 166600000}
exchange
: 
"spb_etf_t"
figi
: 
"TCS80A101X50"
first1dayCandleDate
: 
"2021-08-25T07:00:00Z"
first1minCandleDate
: 
"2021-08-25T07:02:00Z"
fixedCommission
: 
{units: '2', nano: 0}
focusType
: 
"alternative_investment"
forIisFlag
: 
true
forQualInvestorFlag
: 
false
instrumentExchange
: 
"INSTRUMENT_EXCHANGE_UNSPECIFIED"
isin
: 
"RU000A101X50"
liquidityFlag
: 
true
lot
: 
1
minPriceIncrement
: 
{units: '0', nano: 10000000}
name
: 
"Золото"
otcFlag
: 
false
positionUid
: 
"46dd8924-24e9-4581-afd2-97e0ca89009c"
realExchange
: 
"REAL_EXCHANGE_RTS"
rebalancingFreq
: 
""
releasedDate
: 
"2020-07-13T00:00:00Z"
requiredTests
: 
[]
sector
: 
""
sellAvailableFlag
: 
true
shortEnabledFlag
: 
true
ticker
: 
"TGLD@"
tradingStatus
: 
"SECURITY_TRADING_STATUS_NOT_AVAILABLE_FOR_TRADING"
uid
: 
"de82be66-3b9b-4612-9572-61e3c6039013"
weekendFlag
: 
false,
};

export interface IInstrumentData  {
    "assetUid": string,
    "figi": string,
    "dshortMin": {"nano": number, "units": string},
    "countryOfRisk": string,
    "lot": number,
    "uid": string,
    "requiredTests": string[],
    "blockedTcaFlag": boolean,
    "dlong": {"nano": number, "units": string},
    "dlongClient": {"nano": number, "units": string},
    "sellAvailableFlag": boolean,
    "currency": string,
    "first1dayCandleDate": string,
    "brand": {"logoName": string, "logoBaseColor": string, "textColor": string},
    "buyAvailableFlag": boolean,
    "weekendFlag": boolean,
    "classCode": string,
    "ticker": string,
    "instrumentType": "bond" | "share" | "etf" | "currency",
    "forQualInvestorFlag": boolean,
    "forIisFlag": boolean,
    "positionUid": string,
    "apiTradeAvailableFlag": boolean,
    "dlongMin": {"nano": number, "units": string},
    "shortEnabledFlag": boolean,
    "kshort": {"nano": number, "units": string},
    "first1minCandleDate": string,
    "minPriceIncrement": {"nano": number, "units": string},
    "otcFlag": boolean,
    "dshortClient": {"nano": number,"units": string},
    "klong": {"nano": number,"units": string},
    "dshort": {"nano": number,"units": string},
    "name": string,
    "exchange": string,
    "countryOfRiskName": string,
    "isin": string,
};

export interface IPortfolio {
    "totalAmountShares": {
        "currency": string,
        "units": string,
        "nano": number,
    },
    "totalAmountBonds": {
        "currency": string,
        "units": string,
        "nano": number,
    },
    "totalAmountEtf": {
        "currency": string,
        "units": string,
        "nano": number,
    },
    "totalAmountCurrencies": {
        "currency": string,
        "units": string,
        "nano": number,
    },
    "totalAmountFuture": {
        "currency": string,
        "units": string,
        "nano": number,
    },
    "totalAmountOptions": {
        "currency": string,
        "units": string,
        "nano": number,
    },
    "totalAmountSp": {
        "currency": string,
        "units": string,
        "nano": number,
    },
    "totalAmountPortfolio": {
        "currency": string,
        "units": string,
        "nano": number,
    },
    "dailyYield": {
        "currency": string,
        "units": string,
        "nano": number,
    },
    "positions": IBond[],
    "dailyYieldRelative": {
        "units": string,
        "nano": number,
    },
    "expectedYield": {
        "units": string,
        "nano": number,
    },
    "accountId": string,
};

export interface IOperations {
    "operations": {
        "date": string,
        "assetUid": string,
        "instrumentType": string,
        "operationType": string,
        "childOperations": [
            {
                "instrumentUid": string,
                "payment": {
                    "nano": number,
                    "currency": string,
                    "units": string,
                },
            },
        ],
        "quantity": string,
        "parentOperationId": string,
        "trades": [
            {
                "dateTime": string,
                "quantity": string,
                "price": {
                    "nano": number,
                    "currency": string,
                    "units": string,
                },
                "tradeId": string,
            },
        ],
        "positionUid": string,
        "figi": string,
        "type": string,
        "price": {
            "nano": 5,
            "currency": string,
            "units": string,
        },
        "instrumentUid": string,
        "currency": string,
        "payment": {
            "nano": number,
            "currency": string,
            "units": string,
        },
        "id": string,
        "quantityRest": string,
    }[],
};

export interface IReadyPortfolio {
    id: number,
    imageUrl: string,
    name: string,
    description: string,
    goals: string,
    risk: string,
    yieldValue: number,
    proportions: [string, number][],
    bondsIsins: string[],
    sharesTickers: string[],
    etfsTickers: string[],
};