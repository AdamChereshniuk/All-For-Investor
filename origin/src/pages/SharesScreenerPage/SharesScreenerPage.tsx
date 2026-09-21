import { useEffect, useState } from "react";
import "./SharesScreenerPage.css";
import axios from "axios";
import type { IShare } from "../../types";
import { Link } from "react-router-dom";

export const SharesScreenerPage = () => {
    const currentTokenFromLocalStorage = localStorage.getItem("currentToken") || "t.uOD3cbT60-H5aE2N85KKG2dLzS5zBuY0NzwKo1Nkw_y2729R3pHbCvcNAWfQPy2CNuPhWjJwRCRb7bd84r0D0A";

    const [sharesData, setSharesData] = useState<IShare[]>([]);
    const [filteredShares, setFilteredShares] = useState<IShare[]>([]);
    const [sectorFilterValue, setSectorFilterValue] = useState<string>("");
    const [lotFilterValue, setLotFilterValue] = useState<string>("");
    const [currencyFilterValue, setCurrencyFilterValue] = useState<string>("");

    const func = (lot: string, share: IShare) => {
        if(lot === "") {
            return true;
        } else {
            return share.lot === Number(lot);
        };
    };
    const filterShares = () => {
        return sharesData.filter(share => share.sector.includes(sectorFilterValue) && share.currency.includes(currencyFilterValue.toLowerCase()) && func(lotFilterValue, share));
    };
    const clearShares = () => {
        setSectorFilterValue("");
        setLotFilterValue("");
        setCurrencyFilterValue("");
    };

    useEffect(() => {
        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://invest-public-api.tbank.ru/rest/tinkoff.public.invest.api.contract.v1.InstrumentsService/Shares",
            headers: { 
                "Content-Type": "application/json", 
                "Accept": "application/json", 
                "Authorization": `Bearer ${currentTokenFromLocalStorage}`,
            },
            data: JSON.stringify({
                "instrumentStatus": "INSTRUMENT_STATUS_UNSPECIFIED",
                "instrumentExchange": "INSTRUMENT_EXCHANGE_UNSPECIFIED",
            }),
        };

        axios.request(config).then(response => {
            setSharesData(response.data.instruments);
            setFilteredShares(response.data.instruments);
        }).catch(error => console.log(error));
    }, []);
    useEffect(() => {
        if(sectorFilterValue == "") {
            setFilteredShares(sharesData);
            return;
        };
        setFilteredShares(filterShares());
    }, [sectorFilterValue]);
    useEffect(() => {
        if(lotFilterValue === "") {
            setFilteredShares(sharesData);
            return;
        };
        setFilteredShares(filterShares());
    }, [lotFilterValue]);
    useEffect(() => {
        if(currencyFilterValue == "") {
            setFilteredShares(sharesData);
            return;
        };
        setFilteredShares(filterShares());
    }, [currencyFilterValue]);

    return (
        <div className="shares-screener-page">
            <div className="container">
                <h1 className="shares-screener-page__title title">Скринер акций</h1>
                <p className="text">Подберите акции для своего портфеля, используя фильтры ниже.</p>

                <div className="bonds-screener-page__filters">
                    <div className="bonds-screener-page__filter">
                        <h2 className="bonds-screener-page__filter-title">Сектор</h2>
                        <ul className="bonds-screener-page__filter-values">
                            <li className="bonds-screener-page__filter-value" onClick={() => setSectorFilterValue("financial")}>
                                <div className="bonds-screener-page__filter-value-checkbox">
                                    <div style={{ display: `${sectorFilterValue === "financial" ? "block" : "none"}` }}></div>
                                </div>
                                <span className="bonds-screener-page__filter-value-name">Финансовый</span>
                            </li>
                            <li className="bonds-screener-page__filter-value" onClick={() => setSectorFilterValue("materials")}>
                                <div className="bonds-screener-page__filter-value-checkbox">
                                    <div style={{ display: `${sectorFilterValue === "materials" ? "block" : "none"}` }}></div>
                                </div>
                                <span className="bonds-screener-page__filter-value-name">Сырьевой</span>
                            </li>
                            <li className="bonds-screener-page__filter-value" onClick={() => setSectorFilterValue("real_estate")}>
                                <div className="bonds-screener-page__filter-value-checkbox">
                                    <div style={{ display: `${sectorFilterValue === "real_estate" ? "block" : "none"}` }}></div>
                                </div>
                                <span className="bonds-screener-page__filter-value-name">Недвижимость</span>
                            </li>
                            <li className="bonds-screener-page__filter-value" onClick={() => setSectorFilterValue("it")}>
                                <div className="bonds-screener-page__filter-value-checkbox">
                                    <div style={{ display: `${sectorFilterValue === "it" ? "block" : "none"}` }}></div>
                                </div>
                                <span className="bonds-screener-page__filter-value-name">IT</span>
                            </li>
                            <li className="bonds-screener-page__filter-value" onClick={() => setSectorFilterValue("telecom")}>
                                <div className="bonds-screener-page__filter-value-checkbox">
                                    <div style={{ display: `${sectorFilterValue === "telecom" ? "block" : "none"}` }}></div>
                                </div>
                                <span className="bonds-screener-page__filter-value-name">Телеком</span>
                            </li>
                            <li className="bonds-screener-page__filter-value" onClick={() => setSectorFilterValue("industrials")}>
                                <div className="bonds-screener-page__filter-value-checkbox">
                                    <div style={{ display: `${sectorFilterValue === "industrials" ? "block" : "none"}` }}></div>
                                </div>
                                <span className="bonds-screener-page__filter-value-name">Промышленный</span>
                            </li>
                            <li className="bonds-screener-page__filter-value" onClick={() => setSectorFilterValue("other")}>
                                <div className="bonds-screener-page__filter-value-checkbox">
                                    <div style={{ display: `${sectorFilterValue === "other" ? "block" : "none"}` }}></div>
                                </div>
                                <span className="bonds-screener-page__filter-value-name">Другой</span>
                            </li>
                        </ul>
                    </div>
                    <div style={{ display: "flex", gap: "72px" }}>
                        <div className="bonds-screener-page__filter">
                            <h2 className="bonds-screener-page__filter-title">Лот, шт.</h2>
                            <ul className="bonds-screener-page__filter-values">
                                <li className="bonds-screener-page__filter-value" onClick={() => setLotFilterValue("1")}>
                                    <div className="bonds-screener-page__filter-value-checkbox">
                                        <div style={{ display: `${lotFilterValue === "1" ? "block" : "none"}` }}></div>
                                    </div>
                                    <span className="bonds-screener-page__filter-value-name">1</span>
                                </li>
                                <li className="bonds-screener-page__filter-value" onClick={() => setLotFilterValue("10")}>
                                    <div className="bonds-screener-page__filter-value-checkbox">
                                        <div style={{ display: `${lotFilterValue === "10" ? "block" : "none"}` }}></div>
                                    </div>
                                    <span className="bonds-screener-page__filter-value-name">10</span>
                                </li>
                                <li className="bonds-screener-page__filter-value" onClick={() => setLotFilterValue("100")}>
                                    <div className="bonds-screener-page__filter-value-checkbox">
                                        <div style={{ display: `${lotFilterValue === "100" ? "block" : "none"}` }}></div>
                                    </div>
                                    <span className="bonds-screener-page__filter-value-name">100</span>
                                </li>
                                <li className="bonds-screener-page__filter-value" onClick={() => setLotFilterValue("1000")}>
                                    <div className="bonds-screener-page__filter-value-checkbox">
                                        <div style={{ display: `${lotFilterValue === "1000" ? "block" : "none"}` }}></div>
                                    </div>
                                    <span className="bonds-screener-page__filter-value-name">1000</span>
                                </li>
                            </ul>
                        </div>
                        <div className="bonds-screener-page__filter">
                            <h2 className="bonds-screener-page__filter-title">Валюта</h2>
                            <ul className="bonds-screener-page__filter-values">
                                <li className="bonds-screener-page__filter-value" onClick={() => setCurrencyFilterValue("RUB")}>
                                    <div className="bonds-screener-page__filter-value-checkbox">
                                        <div style={{ display: `${currencyFilterValue === "RUB" ? "block" : "none"}` }}></div>
                                    </div>
                                    <span className="bonds-screener-page__filter-value-name">RUB</span>
                                </li>
                                <li className="bonds-screener-page__filter-value" onClick={() => setCurrencyFilterValue("USD")}>
                                    <div className="bonds-screener-page__filter-value-checkbox">
                                        <div style={{ display: `${currencyFilterValue === "USD" ? "block" : "none"}` }}></div>
                                    </div>
                                    <span className="bonds-screener-page__filter-value-name">USD</span>
                                </li>
                                <li className="bonds-screener-page__filter-value" onClick={() => setCurrencyFilterValue("CNY")}>
                                    <div className="bonds-screener-page__filter-value-checkbox">
                                        <div style={{ display: `${currencyFilterValue === "CNY" ? "block" : "none"}` }}></div>
                                    </div>
                                    <span className="bonds-screener-page__filter-value-name">CNY</span>
                                </li>
                            </ul>
                        </div>
                        <button className="bonds-screener-page__filter-clear-btn" onClick={clearShares}>Очистить</button>
                    </div>
                </div>

                <ul className="bonds-screener-page__list">
                    <li className="bonds-screener-page__item">
                        <span className="bonds-screener-page__item-name">Название</span>
                        <span className="bonds-screener-page__item-ticker">Тикер</span>
                        <span className="bonds-screener-page__item-cuopon-quantity">Лот, шт.</span>
                        <span className="bonds-screener-page__item-cuopon-quantity">Валюта</span>
                    </li>
                    
                    {filteredShares.map(share => {
                        return (
                            <li className="bonds-screener-page__item">
                                <span className="bonds-screener-page__item-name">{share.name}</span>
                                <span className="bonds-screener-page__item-ticker">{share.ticker}</span>
                                <span className="bonds-screener-page__item-cuopon-quantity">{share.lot}</span>
                                <span className="bonds-screener-page__item-cuopon-quantity">{share.currency.toUpperCase()}</span>
                                <Link className="bonds-screener-page__item-btn btn" to={`https://www.tbank.ru/invest/stocks/${share.ticker}/`} target="_blank">Посмотреть в т-инвестициях</Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};