import { useEffect, useState } from "react";
import "./BondsScreenerPage.css";
import axios from "axios";
import type { IBond2 } from "../../types";
import { Link } from "react-router-dom";

export const BondsScreenerPage = () => {
    const currentTokenFromLocalStorage = localStorage.getItem("currentToken") || "t.uOD3cbT60-H5aE2N85KKG2dLzS5zBuY0NzwKo1Nkw_y2729R3pHbCvcNAWfQPy2CNuPhWjJwRCRb7bd84r0D0A";

    const [bondsData, setBondsData] = useState<IBond2[]>([]);
    const [filteredBonds, setFilteredBonds] = useState<IBond2[]>([]);
    const [sectorFilterValue, setSectorFilterValue] = useState<string>("");
    const [cuoponQuantityFilterValue, setCuoponQuantityFilterValue] = useState<number | "">("");
    const [currencyFilterValue, setCurrencyFilterValue] = useState<string>("");
    const [amortizationFilterValue, setAmortizationFilterValue] = useState<boolean | "">("");
    const [cuoponTypeFilterValue, setCuoponTypeFilterValue] = useState<"fixed" | "float" | "">("");
    
    useEffect(() => {
        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://invest-public-api.tbank.ru/rest/tinkoff.public.invest.api.contract.v1.InstrumentsService/Bonds",
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
            setBondsData(response.data.instruments);
            setFilteredBonds(response.data.instruments);
        }).catch(error => console.log(error));
    }, []);
    const func = (company: string, bond: IBond2) => {
        if(company == "government") {
            return bond.sector == "government";
        } else {
            return bond.sector !== "government";
        };
    };
    const func2 = (cuoponQuantity: number | "", bond: IBond2) => {
        if(cuoponQuantityFilterValue == "") {
            return true;
        } else {
            return bond.couponQuantityPerYear == cuoponQuantity;
        };
    };
    const func3 = (amortization: boolean | "", bond: IBond2) => {
        return bond.amortizationFlag === Boolean(amortization);
    };
    const func4 = (cuoponType: "fixed" | "float" | "", bond: IBond2) => {
        if(cuoponType === "fixed") {
            return bond.floatingCouponFlag === false;
        } else {
            return bond.floatingCouponFlag === true;
        };
    };
    const filterBonds = () => {
        return bondsData.filter(bond => bond.sector.includes(sectorFilterValue) && func2(cuoponQuantityFilterValue, bond) && bond.currency.includes(currencyFilterValue.toLocaleLowerCase()) && func(sectorFilterValue, bond) && func3(amortizationFilterValue, bond) && func4(cuoponTypeFilterValue, bond));
    };
    const clearBonds = () => {
        setSectorFilterValue("");
        setCuoponQuantityFilterValue("");
        setCurrencyFilterValue("");
    };
    useEffect(() => {
        if(sectorFilterValue == "") {
            setFilteredBonds(bondsData);
            return;
        };
        setFilteredBonds(filterBonds());
    }, [sectorFilterValue]);
    useEffect(() => {
        if(cuoponQuantityFilterValue == "") {
            setFilteredBonds(bondsData);
            return;
        };
        setFilteredBonds(filterBonds());
    }, [cuoponQuantityFilterValue]);
    useEffect(() => {
        if(currencyFilterValue == "") {
            setFilteredBonds(bondsData);
            return;
        };
        setFilteredBonds(filterBonds());
    }, [currencyFilterValue]);
    useEffect(() => {
        if(amortizationFilterValue == "") {
            setFilteredBonds(bondsData);
            return;
        };
        setFilteredBonds(filterBonds());
    }, [amortizationFilterValue]);
    useEffect(() => {
        if(cuoponTypeFilterValue == "") {
            setFilteredBonds(bondsData);
            return;
        };
        setFilteredBonds(filterBonds());
    }, [cuoponTypeFilterValue]);

    return (
        <div className="bonds-screener-page">
            <div className="container">
                <h1 className="bonds-screener-page__title title">Скринер облигаций</h1>
                <p className="text">Подберите облигации для своего портфеля, используя фильтры ниже.</p>

                <div className="bonds-screener-page__filters">
                    <div className="bonds-screener-page__filter">
                        <h2 className="bonds-screener-page__filter-title">Сектор</h2>
                        <ul className="bonds-screener-page__filter-values">
                            <li className="bonds-screener-page__filter-value" onClick={() => setSectorFilterValue("government")}>
                                <div className="bonds-screener-page__filter-value-checkbox">
                                    <div style={{ display: `${sectorFilterValue === "government" ? "block" : "none"}` }}></div>
                                </div>
                                <span className="bonds-screener-page__filter-value-name">Государственные</span>
                            </li>
                            <li className="bonds-screener-page__filter-value" onClick={() => setSectorFilterValue("municipal")}>
                                <div className="bonds-screener-page__filter-value-checkbox">
                                    <div style={{ display: `${sectorFilterValue === "municipal" ? "block" : "none"}` }}></div>
                                </div>
                                <span className="bonds-screener-page__filter-value-name">Муниципальные</span>
                            </li>
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
                            <h2 className="bonds-screener-page__filter-title">Кол-во купонов в год</h2>
                            <ul className="bonds-screener-page__filter-values">
                                <li className="bonds-screener-page__filter-value" onClick={() => setCuoponQuantityFilterValue(1)}>
                                    <div className="bonds-screener-page__filter-value-checkbox">
                                        <div style={{ display: `${cuoponQuantityFilterValue === 1 ? "block" : "none"}` }}></div>
                                    </div>
                                    <span className="bonds-screener-page__filter-value-name">1</span>
                                </li>
                                <li className="bonds-screener-page__filter-value" onClick={() => setCuoponQuantityFilterValue(2)}>
                                    <div className="bonds-screener-page__filter-value-checkbox">
                                        <div style={{ display: `${cuoponQuantityFilterValue === 2 ? "block" : "none"}` }}></div>
                                    </div>
                                    <span className="bonds-screener-page__filter-value-name">2</span>
                                </li>
                                <li className="bonds-screener-page__filter-value" onClick={() => setCuoponQuantityFilterValue(4)}>
                                    <div className="bonds-screener-page__filter-value-checkbox">
                                        <div style={{ display: `${cuoponQuantityFilterValue === 4 ? "block" : "none"}` }}></div>
                                    </div>
                                    <span className="bonds-screener-page__filter-value-name">4</span>
                                </li>
                                <li className="bonds-screener-page__filter-value" onClick={() => setCuoponQuantityFilterValue(6)}>
                                    <div className="bonds-screener-page__filter-value-checkbox">
                                        <div style={{ display: `${cuoponQuantityFilterValue === 6 ? "block" : "none"}` }}></div>
                                    </div>
                                    <span className="bonds-screener-page__filter-value-name">6</span>
                                </li>
                                <li className="bonds-screener-page__filter-value" onClick={() => setCuoponQuantityFilterValue(12)}>
                                    <div className="bonds-screener-page__filter-value-checkbox">
                                        <div style={{ display: `${cuoponQuantityFilterValue === 12 ? "block" : "none"}` }}></div>
                                    </div>
                                    <span className="bonds-screener-page__filter-value-name">12</span>
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
                        <div className="bonds-screener-page__filter">
                            <h2 className="bonds-screener-page__filter-title">Амортизация</h2>
                            <ul className="bonds-screener-page__filter-values">
                                <li className="bonds-screener-page__filter-value" onClick={() => setAmortizationFilterValue(true)}>
                                    <div className="bonds-screener-page__filter-value-checkbox">
                                        <div style={{ display: `${amortizationFilterValue === true ? "block" : "none"}` }}></div>
                                    </div>
                                    <span className="bonds-screener-page__filter-value-name">Да</span>
                                </li>
                                <li className="bonds-screener-page__filter-value" onClick={() => setAmortizationFilterValue(false)}>
                                    <div className="bonds-screener-page__filter-value-checkbox">
                                        <div style={{ display: `${amortizationFilterValue === false ? "block" : "none"}` }}></div>
                                    </div>
                                    <span className="bonds-screener-page__filter-value-name">Нет</span>
                                </li>
                            </ul>
                        </div>
                        <div className="bonds-screener-page__filter">
                            <h2 className="bonds-screener-page__filter-title">Купон</h2>
                            <ul className="bonds-screener-page__filter-values">
                                <li className="bonds-screener-page__filter-value" onClick={() => setCuoponTypeFilterValue("fixed")}>
                                    <div className="bonds-screener-page__filter-value-checkbox">
                                        <div style={{ display: `${cuoponTypeFilterValue === "fixed" ? "block" : "none"}` }}></div>
                                    </div>
                                    <span className="bonds-screener-page__filter-value-name">Фиксированный</span>
                                </li>
                                <li className="bonds-screener-page__filter-value" onClick={() => setCuoponTypeFilterValue("float")}>
                                    <div className="bonds-screener-page__filter-value-checkbox">
                                        <div style={{ display: `${cuoponTypeFilterValue === "float" ? "block" : "none"}` }}></div>
                                    </div>
                                    <span className="bonds-screener-page__filter-value-name">Плавающий</span>
                                </li>
                            </ul>
                        </div>
                        <button className="bonds-screener-page__filter-clear-btn" onClick={clearBonds}>Очистить</button>
                    </div>
                </div>
                <ul className="bonds-screener-page__list">
                    <li className="bonds-screener-page__item">
                        <span className="bonds-screener-page__item-name">Название</span>
                        <span className="bonds-screener-page__item-ticker">Тикер</span>
                        <span className="bonds-screener-page__item-cuopon-quantity">Кол-во купонов в год</span>
                        <span className="bonds-screener-page__item-cuopon-quantity">Валюта</span>
                    </li>
                    
                    {filteredBonds.map(bond => {
                        return (
                            <li className="bonds-screener-page__item">
                                <span className="bonds-screener-page__item-name">{bond.name}</span>
                                <span className="bonds-screener-page__item-ticker">{bond.ticker}</span>
                                <span className="bonds-screener-page__item-cuopon-quantity">{bond.couponQuantityPerYear}</span>
                                <span className="bonds-screener-page__item-cuopon-quantity">{bond.currency.toUpperCase()}</span>
                               <Link className="bonds-screener-page__item-btn btn" to={`https://www.tbank.ru/invest/bonds/${bond.ticker}/`} target="_blank">Посмотреть в т-инвестициях</Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};