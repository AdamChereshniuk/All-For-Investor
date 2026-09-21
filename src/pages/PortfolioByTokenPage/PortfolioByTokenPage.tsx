import { useEffect, useState } from "react";
import axios from "axios";
import "./PortfolioByTokenPage.css";
import type { IAccount, IInstrumentData, IOperations, IPortfolio } from "../../types";
import { Link } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import type { ChartData } from "chart.js";
import { Chart, registerables } from "chart.js";

type TAssetName = "bonds" | "shares" | "etfs" | "currencies";

export const PortfolioByTokenPage = () => {
    // Переменные
    const currentTokenFromLocalStorage = localStorage.getItem("currentToken");
    const currentAccountIdFromLocalStorage = localStorage.getItem("currentAccountId");
    const assetsNames = {
        bonds: "Облигации",
        shares: "Акции",
        etfs: "Фонды",
        currencies: "Валюта",
    };

    // Состояния
    const [tokenError, setTokenError] = useState<string>("");
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
    const [currentTab, setCurrentTab] = useState<1 | 2 | 3 | 4>(1);
    const [tokenValue, setTokenValue] = useState<string>("");
    const [userAccounts, setUserAccounts] = useState<IAccount[]>([]);
    const [portfolioData, setPortfolioData] = useState<IPortfolio>();
    const [instrumentsData, setInstrumentsData] = useState<IInstrumentData[]>([]);
    const [accountData, setAccountData] = useState<IAccount>();
    const [assetsInPortfolio, setAssetsInPortfolio] = useState<TAssetName[]>([]);
    const [companiesInPortfolio, setCompaniesInPortfolio] = useState<[string, number][]>([]);
    const [currenciesInPortfolio, setCurrenciesInPortfolio] = useState<[string, number][]>([]);
    const [operationsInPortfolio, setOperationsInPortfolio] = useState<IOperations>();

    // Функции
    const getAccountsByToken = () => {
        if(tokenValue.length < 5) {
            setTokenError("Введите корректный токен");
            return;
        };

        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://invest-public-api.tbank.ru/rest/tinkoff.public.invest.api.contract.v1.UsersService/GetAccounts",
            headers: { 
                "Content-Type": "application/json", 
                "Accept": "application/json", 
                "Authorization": `Bearer ${tokenValue}`,
            },
            data: JSON.stringify({
                "status": "ACCOUNT_STATUS_UNSPECIFIED"
            }),
        };

        axios.request(config).then(response => {
            setUserAccounts(response.data.accounts);
            setCurrentStep(2);
        }).catch(error => setTokenError(error));
    };
    const setCurrentPortfolioData = (accountId: string) => {
        localStorage.setItem("currentToken", tokenValue);
        localStorage.setItem("currentAccountId", accountId);
        window.location.href = window.location.href;
    };
    const getCorrectCurrencies = (arr: [string, number][]) => {
        let result: [string, number][] = [];

        for (const curr of arr) {
            if(result.filter(c => c[0] == curr[0]).length == 0) {
                result.push([curr[0], curr[1]]);
            } else {
                let thisCurr = result.filter(c => c[0] == curr[0])[0];
                thisCurr = [thisCurr[0], Number(thisCurr[1]) + Number(curr[1])];
                result = [
                    ...result.filter(c => c[0] !== curr[0]),
                    thisCurr,
                ];
            };
        };

        return result;
    };

    // useEffect
    useEffect(() => {
        if(currentTokenFromLocalStorage && currentAccountIdFromLocalStorage) {
            // Получаем информацию о счете
            let config1 = {
                method: "post",
                maxBodyLength: Infinity,
                url: "https://invest-public-api.tbank.ru/rest/tinkoff.public.invest.api.contract.v1.UsersService/GetAccounts",
                headers: { 
                    "Content-Type": "application/json", 
                    "Accept": "application/json", 
                    "Authorization": `Bearer ${currentTokenFromLocalStorage}`,
                },
                data: JSON.stringify({
                    "status": "ACCOUNT_STATUS_UNSPECIFIED"
                }),
            };

            axios.request(config1).then(response => {
                const allAccounts: IAccount[] = response.data.accounts;
                setAccountData(allAccounts.filter(acc => String(acc.id) == currentAccountIdFromLocalStorage)[0]);
            }).catch(error => setTokenError(error));

            // Получаем информацию о портфеле
            let config = {
                method: "post",
                maxBodyLength: Infinity,
                url: "https://invest-public-api.tbank.ru/rest/tinkoff.public.invest.api.contract.v1.OperationsService/GetPortfolio",
                headers: { 
                    "Content-Type": "application/json", 
                    "Accept": "application/json", 
                    "Authorization": `Bearer ${currentTokenFromLocalStorage}`,
                },
                data: JSON.stringify({
                    "accountId": currentAccountIdFromLocalStorage,
                    "currency": "RUB",
                }),
            };

            axios.request(config).then(response => {
                setPortfolioData(response.data);
            }).catch(error => console.log(error));

            // Получаем операции
            let config2 = {
                method: "post",
                maxBodyLength: Infinity,
                url: "https://invest-public-api.tbank.ru/rest/tinkoff.public.invest.api.contract.v1.OperationsService/GetOperations",
                headers: { 
                    "Content-Type": "application/json", 
                    "Accept": "application/json", 
                    "Authorization": `Bearer ${currentTokenFromLocalStorage}`,
                },
                data: JSON.stringify({
                    "accountId": currentAccountIdFromLocalStorage,
                    "from": accountData?.openedDate,
                    "to": new Date().toISOString(),
                    "state": "OPERATION_STATE_UNSPECIFIED",
                    "figi": "",
                }),
            };

            axios.request(config2).then(response => setOperationsInPortfolio(response.data)).catch(error => console.log(error));
        };
    }, []);
    useEffect(() => {
        setTimeout(async() => {
            if(!portfolioData) return;

            // Формируем список позиций
            const arr = portfolioData.positions;
            let newInstrumentsData: IInstrumentData[] = [];

            for (const pos of arr) {
                let config1 = {
                    method: "post",
                    maxBodyLength: Infinity,
                    url: "https://invest-public-api.tbank.ru/rest/tinkoff.public.invest.api.contract.v1.InstrumentsService/GetInstrumentBy",
                    headers: { 
                        "Content-Type": "application/json", 
                        "Accept": "application/json", 
                        "Authorization": `Bearer ${currentTokenFromLocalStorage}`,
                    },
                    data: JSON.stringify({
                        "idType": "INSTRUMENT_ID_TYPE_FIGI",
                        "classCode": "false",
                        "id": pos.figi,
                    }),
                };

                await axios.request(config1).then(response => {
                    newInstrumentsData.push(response.data.instrument);
                }).catch(error => console.log(error));
            };

            setInstrumentsData(newInstrumentsData);

            // Заполняем активы
            let newAssetsInPortfolio: TAssetName[] = [];

            if(Number(portfolioData.totalAmountBonds?.units) > 0) newAssetsInPortfolio.push("bonds");
            if(Number(portfolioData.totalAmountShares?.units) > 0) newAssetsInPortfolio.push("shares");
            if(Number(portfolioData.totalAmountEtf?.units) > 0) newAssetsInPortfolio.push("etfs");
            if(Number(portfolioData.totalAmountCurrencies?.units) > 0) newAssetsInPortfolio.push("currencies");

            setAssetsInPortfolio(newAssetsInPortfolio);

            // Заполняем валюты
            let currencies: [string, number][] = [];

            currencies.push([String(portfolioData?.totalAmountBonds.currency), Number(portfolioData?.totalAmountBonds.units)]);
            currencies.push([String(portfolioData?.totalAmountShares.currency), Number(portfolioData?.totalAmountShares.units)]);
            currencies.push([String(portfolioData?.totalAmountEtf.currency), Number(portfolioData?.totalAmountEtf.units)]);
            currencies.push([String(portfolioData?.totalAmountCurrencies.currency), Number(portfolioData?.totalAmountCurrencies.units)]);
            
            setCurrenciesInPortfolio(getCorrectCurrencies(currencies));
        }, 1000);
    }, [portfolioData]);
    useEffect(() => {
        // Заполняем компании
        const arr = portfolioData?.positions || [];
        let newCompaniesInPortfolio: [string, number][] = [];

        for (const pos of arr) {
            newCompaniesInPortfolio.push([instrumentsData.filter(inst => inst.figi === pos.figi)[0].name, Number((((Number(pos.currentPrice.units) * Number(pos.quantity.units)) / Number(portfolioData?.totalAmountPortfolio.units)) * 100).toFixed(2))]);
        };

        setCompaniesInPortfolio(newCompaniesInPortfolio);
    }, [instrumentsData]);

    // Формируем доли активов и валют
    let assetsFractions: [TAssetName, string, string][] = [];
    let currenciesFractions: [string, number][] = [];
    if (assetsInPortfolio.includes("bonds")) assetsFractions.push(["bonds", ((Number(portfolioData?.totalAmountBonds.units) / Number(portfolioData?.totalAmountPortfolio.units)) * 100).toFixed(2), "red"]);
    if (assetsInPortfolio.includes("shares")) assetsFractions.push(["shares", ((Number(portfolioData?.totalAmountShares.units) / Number(portfolioData?.totalAmountPortfolio.units)) * 100).toFixed(2), "green"]);
    if (assetsInPortfolio.includes("etfs")) assetsFractions.push(["etfs", ((Number(portfolioData?.totalAmountEtf.units) / Number(portfolioData?.totalAmountPortfolio.units)) * 100).toFixed(2), "blue"]);
    if (assetsInPortfolio.includes("currencies")) assetsFractions.push(["currencies", ((Number(portfolioData?.totalAmountCurrencies.units) / Number(portfolioData?.totalAmountPortfolio.units)) * 100).toFixed(2), "black"]);
    for (const curr of currenciesInPortfolio) currenciesFractions.push([curr[0], Number((curr[1] / Number(portfolioData?.totalAmountPortfolio.units) * 100).toFixed(2))]);

    // Chart.js
    Chart.register(...registerables);
    const data: ChartData<"pie"> = {
        labels: assetsInPortfolio.map(asset => assetsNames[asset]),
        datasets: [
            {
                label: "По активам",
                data: assetsFractions.map(assetFrac => Number(assetFrac[1])),
                backgroundColor: assetsFractions.map(assetFrac => assetFrac[2]),
            },
        ],
    };
    const data2: ChartData<"pie"> = {
        labels: currenciesInPortfolio.map(curr => curr[0]),
        datasets: [
            {
                label: "По валюте",
                data: currenciesFractions.map(curr => curr[1]),
            },
        ],
    };

    return (
        <div className="portfolio-by-token-page">
            <div className="container">
                {currentTokenFromLocalStorage && currentAccountIdFromLocalStorage ? (
                    <div>
                        <h1 className="portfolio-by-token-page-current-token__title title">{accountData?.name}</h1>

                        <ul className="portfolio-by-token-page-current-token__tabs">
                            <li className={`portfolio-by-token-page-current-token__tab ${currentTab == 1 && "current"}`} onClick={() => setCurrentTab(1)}>Портфель</li>
                            <li className={`portfolio-by-token-page-current-token__tab ${currentTab == 2 && "current"}`} onClick={() => setCurrentTab(2)}>Аналитика</li>
                            <li className={`portfolio-by-token-page-current-token__tab ${currentTab == 3 && "current"}`} onClick={() => setCurrentTab(3)}>Операции</li>
                        </ul>

                        {currentTab == 1 && instrumentsData.length == portfolioData?.positions.length && (
                            <>
                                <div className="portfolio-by-token-page-current-token__shares">
                                    <h2 className="portfolio-by-token-page-current-token__shares-title">Акции</h2>
                                    <ul className="portfolio-by-token-page-current-token__shares-list">
                                        <li className="portfolio-by-token-page-current-token__shares-item">
                                            <div className="portfolio-by-token-page-current-token__shares-item-left">
                                                <h3 className="portfolio-by-token-page-current-token__shares-item-title">Название</h3>
                                                <span className="portfolio-by-token-page-current-token__shares-item-ticker">Тикер</span>
                                            </div>
                                            <div className="portfolio-by-token-page-current-token__shares-item-right">
                                                <span className="portfolio-by-token-page-current-token__shares-item-price-amount">
                                                    Кол-во, шт.
                                                </span>
                                                <span className="portfolio-by-token-page-current-token__shares-item-price-result">
                                                    Цена
                                                </span>
                                                <span className={`portfolio-by-token-page-current-token__shares-item-result`}>
                                                    Результат
                                                </span>
                                            </div>
                                        </li>
                                        {portfolioData?.positions.filter(pos => pos.instrumentType == "share").map(pos => {
                                            const instrument = instrumentsData.filter(inst => inst.uid == pos.instrumentUid)[0];
                                            
                                            return (
                                                <>
                                                    <li className="portfolio-by-token-page-current-token__shares-item">
                                                        <div className="portfolio-by-token-page-current-token__shares-item-left">
                                                            <h3 className="portfolio-by-token-page-current-token__shares-item-title">{instrument.name}</h3>
                                                            <span className="portfolio-by-token-page-current-token__shares-item-ticker">{instrument.ticker}</span>
                                                        </div>
                                                        <Link className="portfolio-by-token-page-current-token__shares-item-btn btn" to={`https://www.tbank.ru/invest/stocks/${instrument.ticker}/`} target="_blank">Посмотреть в т-инвестициях</Link>
                                                        <div className="portfolio-by-token-page-current-token__shares-item-right">
                                                            <span className="portfolio-by-token-page-current-token__shares-item-price-amount">
                                                                {pos.quantity.units}
                                                            </span>
                                                            <span className="portfolio-by-token-page-current-token__shares-item-price-result">
                                                                {`${pos.averagePositionPrice.units}₽ => ${pos.currentPrice.units}₽`}
                                                            </span>
                                                            <span className={`portfolio-by-token-page-current-token__shares-item-result ${pos.expectedYield.units.includes("-") ? "minus" : "plus"}`}>
                                                                {`${!pos.expectedYield.units.includes("-") ? "+" : ""}${pos.expectedYield.units}₽`}
                                                                <div></div>
                                                                {String((Number(pos.expectedYield.units.replace("-", "")) / (Number(pos.averagePositionPrice.units) * Number(pos.quantity.units)) * 100).toFixed(2))}%
                                                            </span>
                                                        </div>
                                                    </li>
                                                </>
                                            );
                                        })}
                                    </ul>
                                </div>
                                <div className="portfolio-by-token-page-current-token__shares">
                                    <h2 className="portfolio-by-token-page-current-token__shares-title">Облигации</h2>
                                    <ul className="portfolio-by-token-page-current-token__shares-list">
                                        <li className="portfolio-by-token-page-current-token__shares-item">
                                            <div className="portfolio-by-token-page-current-token__shares-item-left">
                                                <h3 className="portfolio-by-token-page-current-token__shares-item-title">Название</h3>
                                                <span className="portfolio-by-token-page-current-token__shares-item-ticker">Тикер</span>
                                            </div>
                                            <div className="portfolio-by-token-page-current-token__shares-item-right">
                                                <span className="portfolio-by-token-page-current-token__shares-item-price-amount">
                                                    Кол-во, шт.
                                                </span>
                                                <span className="portfolio-by-token-page-current-token__shares-item-price-result">
                                                    Цена
                                                </span>
                                                <span className={`portfolio-by-token-page-current-token__shares-item-result`}>
                                                    Результат
                                                </span>
                                            </div>
                                        </li>
                                        {portfolioData?.positions.filter(pos => pos.instrumentType == "bond").map(pos => {
                                            const instrument = instrumentsData.filter(inst => inst.uid == pos.instrumentUid)[0];

                                            return (
                                                <>
                                                    <li className="portfolio-by-token-page-current-token__shares-item">
                                                        <div className="portfolio-by-token-page-current-token__shares-item-left">
                                                            <h3 className="portfolio-by-token-page-current-token__shares-item-title">{instrument.name}</h3>
                                                            <span className="portfolio-by-token-page-current-token__shares-item-ticker">{instrument.ticker}</span>
                                                        </div>
                                                        <Link className="portfolio-by-token-page-current-token__shares-item-btn btn" to={`https://www.tbank.ru/invest/bonds/${instrument.ticker}/`} target="_blank">Посмотреть в т-инвестициях</Link>
                                                        <div className="portfolio-by-token-page-current-token__shares-item-right">
                                                            <span className="portfolio-by-token-page-current-token__shares-item-price-amount">
                                                                {pos.quantity.units}
                                                            </span>
                                                            <span className="portfolio-by-token-page-current-token__shares-item-price-result">
                                                                {`${pos.averagePositionPrice.units}₽ => ${pos.currentPrice.units}₽`}
                                                            </span>
                                                            <span className={`portfolio-by-token-page-current-token__shares-item-result ${pos.expectedYield.units.includes("-") ? "minus" : "plus"}`}>
                                                                {`${!pos.expectedYield.units.includes("-") ? "+" : ""}${pos.expectedYield.units}₽`}
                                                                <div></div>
                                                                {String((Number(pos.expectedYield.units.replace("-", "")) / (Number(pos.averagePositionPrice.units) * Number(pos.quantity.units)) * 100).toFixed(2)).replace("-", "")}%
                                                            </span>
                                                        </div>
                                                    </li>
                                                </>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </>
                        )}
                        {currentTab == 2 && (
                            <>
                                <h2 className="portfolio-by-token-page-current-token__analytics-title">Диверсификация</h2>
                                <div className="portfolio-by-token-page-current-token__analytics-body">
                                    <div className="portfolio-by-token-page-current-token__analytics-wrappers">
                                        <div className="portfolio-by-token-page-current-token__analytics-wrapper">
                                            <h3 className="portfolio-by-token-page-current-token__analytics-suptitle">По активам</h3>
                                            <div className="portfolio-by-token-page-current-token__analytics-div">
                                                <ul className="portfolio-by-token-page-current-token__analytics-list">
                                                    <li className="portfolio-by-token-page-current-token__analytics-item">
                                                        <span>Актив</span>
                                                        <span>Доля</span>
                                                    </li>
                                                    {assetsFractions.map(assetFrac => {
                                                        return (
                                                            <li className="portfolio-by-token-page-current-token__analytics-item">
                                                                <span>{assetsNames[assetFrac[0]]}</span>
                                                                <span>{assetFrac[1]}%</span>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                                <div style={{ width: "300px", height: "300px" }}>
                                                    <Pie data={data} options={{ responsive: true, maintainAspectRatio: false }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="portfolio-by-token-page-current-token__analytics-wrapper">
                                            <h3 className="portfolio-by-token-page-current-token__analytics-suptitle">По валюте</h3>
                                            <div className="portfolio-by-token-page-current-token__analytics-div">
                                                <ul className="portfolio-by-token-page-current-token__analytics-list">
                                                    <li className="portfolio-by-token-page-current-token__analytics-item">
                                                        <span>Валюта</span>
                                                        <span>Доля</span>
                                                    </li>
                                                    {currenciesFractions.map(currFrac => {
                                                        return (
                                                            <li className="portfolio-by-token-page-current-token__analytics-item">
                                                                <span>{currFrac[0].toUpperCase()}</span>
                                                                <span>{currFrac[1]}%</span>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                                <div style={{ width: "300px", height: "300px" }}>
                                                    <Pie data={data2} options={{ responsive: true, maintainAspectRatio: false }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="portfolio-by-token-page-current-token__analytics-wrapper">
                                            <h3 className="portfolio-by-token-page-current-token__analytics-suptitle">Топ-5 бумаг</h3>
                                            <div className="portfolio-by-token-page-current-token__analytics-div">
                                                <ul className="portfolio-by-token-page-current-token__analytics-list">
                                                    <li className="portfolio-by-token-page-current-token__analytics-item portfolio-by-token-page-current-token__analytics-full-item">
                                                        <span>Название</span>
                                                        <span>Доля</span>
                                                    </li>
                                                    {companiesInPortfolio.slice().sort((a, b) => {
                                                        if (a[1] < b[1]) return 1;
                                                        if (a[1] > b[1]) return -1;
                                                        return 0;
                                                    }).filter((_, index) => index < 5).map(comFrac => {
                                                        return (
                                                            <li className="portfolio-by-token-page-current-token__analytics-item portfolio-by-token-page-current-token__analytics-full-item">
                                                                <span>{comFrac[0]}</span>
                                                                <span>{comFrac[1]}%</span>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        {currentTab == 3 && (
                            <div className="portfolio-by-token-page-current-token__operations">
                                <ul className="portfolio-by-token-page-current-token__operations-list">
                                    <li className="portfolio-by-token-page-current-token__operations-item">
                                        <div className="portfolio-by-token-page-current-token__operations-item-left">
                                            <span className="portfolio-by-token-page-current-token__operations-item-date">Дата</span>
                                            <span className="portfolio-by-token-page-current-token__operations-item-title">Тип</span>
                                        </div>
                                        <div className="portfolio-by-token-page-current-token__operations-item-right">
                                            <span className="portfolio-by-token-page-current-token__operations-item-amount">
                                                Кол-во
                                            </span>
                                            <span className="portfolio-by-token-page-current-token__operations-item-result">
                                                Сумма
                                            </span>
                                        </div>
                                    </li>
                                    {operationsInPortfolio?.operations.map(operation => {
                                        return (
                                            <li className="portfolio-by-token-page-current-token__operations-item">
                                                <div className="portfolio-by-token-page-current-token__operations-item-left">
                                                    <span className="portfolio-by-token-page-current-token__operations-item-date">{new Date(operation.date).toLocaleString()}</span>
                                                    <span className="portfolio-by-token-page-current-token__operations-item-title">{operation.type}</span>
                                                </div>
                                                <Link className="portfolio-by-token-page-current-token__shares-item-btn btn" to={`https://www.tbank.ru/invest/portfolio/${currentAccountIdFromLocalStorage}/events/`} target="_blank">Посмотреть в т-инвестициях</Link>
                                                <div className="portfolio-by-token-page-current-token__operations-item-right">
                                                    <span className="portfolio-by-token-page-current-token__operations-item-amount">
                                                        {operation.quantity === "0" ? "-" : `${operation.quantity} шт.`}
                                                    </span>
                                                    <span className={`portfolio-by-token-page-current-token__operations-item-result ${operation.payment.units.includes("-") || operation.payment.units == "0" ? "minus" : "plus"}`}>
                                                        {operation.payment.units.includes("-") || operation.payment.units == "0" ? operation.payment.units : `+${operation.payment.units}`} {operation.payment.currency.toUpperCase()}
                                                    </span>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="portfolio-by-token-page-new-token">
                        <h1 className="portfolio-by-token-page-new-token__title title">Добавить новый портфель</h1>
                        <p className="text">Введите токен, чтобы привязать ваш портфель.</p>

                        {currentStep == 1 && (
                            <form className="portfolio-by-token-page-new-token__form" onSubmit={e => {
                                e.preventDefault();
                                getAccountsByToken();
                            }}>
                                <div className="portfolio-by-token-page-new-token__form-top">
                                    <input
                                        className="portfolio-by-token-page-new-token__input input"
                                        type="text"
                                        placeholder="Токен"
                                        value={tokenValue}
                                        onInput={e => setTokenValue(e.currentTarget.value)}
                                    />
                                    <button className="portfolio-by-token-page-new-token__btn btn" type="submit">Добавить</button>
                                </div>
                                {tokenError !== "" && <span className="portfolio-by-token-page-new-token__error">{tokenError}</span>}
                            </form>
                        )}
                        {currentStep == 2 && (
                            <>
                                {userAccounts.length !== 0 ? (
                                    <ul className="portfolio-by-token-page-new-token__list">
                                        {userAccounts.map(account => {
                                            return (
                                                <li className="portfolio-by-token-page-new-token__item" onClick={() => setCurrentPortfolioData(account.id)}>
                                                    <span className="portfolio-by-token-page-new-token__item-id">#{account.id}</span>
                                                    <h2 className="portfolio-by-token-page-new-token__item-title">{account.name}</h2>
                                                    <span className="portfolio-by-token-page-new-token__item-date">{new Date(account.openedDate).toLocaleString()}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <span>Нет аккаунтов, привязанных к токену</span>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};