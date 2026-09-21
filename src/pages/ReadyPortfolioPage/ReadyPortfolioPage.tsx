import { useParams } from "react-router-dom";
import "./ReadyPortfolioPage.css";
import { useEffect, useState } from "react";
import type { IBond2, IEtf, IReadyPortfolio, IShare } from "../../types";
import { readyPortfolios } from "../../assets/readyPortfolios";
import axios from "axios";

export const ReadyPortfolioPage = () => {
    const currentTokenFromLocalStorage = localStorage.getItem("currentToken") || "t.uOD3cbT60-H5aE2N85KKG2dLzS5zBuY0NzwKo1Nkw_y2729R3pHbCvcNAWfQPy2CNuPhWjJwRCRb7bd84r0D0A";

    const [portfolio, setPortfolio] = useState<IReadyPortfolio>();
    const [bonds, setBonds] = useState<IBond2[]>([]);
    const [shares, setShares] = useState<IShare[]>([]);
    const [etfs, setEtfs] = useState<IEtf[]>([]);
    const [areBondsReady, setAreBondsReady] = useState<boolean>(false);
    const [areSharesReady, setAreSharesReady] = useState<boolean>(false);
    const [areEtfsReady, setAreEtfsReady] = useState<boolean>(false);
    const { id } = useParams();
    
    useEffect(() => {
        setPortfolio(readyPortfolios.filter(portfolio => portfolio.id === Number(id))[0]);
    }, []);
    // Облигации
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
            if(portfolio == undefined) return;

            const allBonds = response.data.instruments;
            let newBonds: IBond2[] = [];

            for(const bond of allBonds) {
                if(portfolio.bondsIsins.includes(bond.isin)) newBonds.push(bond);
            };

            setBonds(newBonds);
        }).catch(err => console.log(err));
    }, [portfolio]);
    // Акции
    useEffect(() => {
        if(portfolio == undefined) return;

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
            const allShares = response.data.instruments;
            let newShares: IShare[] = [];

            for(const share of allShares) {
                if(portfolio.sharesTickers.includes(share.ticker) && !newShares.includes(share.ticker)) newShares.push(share);
            };

            setShares(newShares);
        }).catch(err => console.log(err));
    }, [portfolio]);
    // Фонды
    useEffect(() => {
        if(portfolio == undefined) return;

        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://invest-public-api.tbank.ru/rest/tinkoff.public.invest.api.contract.v1.InstrumentsService/Etfs",
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
            const allEtfs = response.data.instruments;
            let newEtfs: IEtf[] = [];

            for(const etf of allEtfs) {
                if(portfolio?.etfsTickers.includes(etf.ticker)) newEtfs.push(etf);
            };

            setEtfs(newEtfs);
        });
    }, [portfolio]);

    useEffect(() => {
        if(bonds.length !== 0) setAreBondsReady(true);
    }, [bonds]);
    useEffect(() => {
        if(shares.length !== 0) setAreSharesReady(true);
    }, [shares]);
    useEffect(() => {
        if(etfs.length !== 0) setAreEtfsReady(true);
    }, [etfs]);

    return (
        <div className="ready-portfolio-page">
            <div className="container">
                <div className="ready-portfolio-page__inner">
                    <h1 className="ready-portfolio-page__title title">{portfolio?.name || "Название"}</h1>
                    <p className="ready-portfolio-page__text">{portfolio?.description || "Описание"}</p>
                    <span className="ready-portfolio-page__goals">Цели: {portfolio?.goals || "Цели"}</span>
                    <span className="ready-portfolio-page__yield">Доходность ~{portfolio?.yieldValue || "Доходность"}% годовых</span>
                    <span className="ready-portfolio-page__risk">{portfolio?.risk} риск</span>
                    <span className="ready-portfolio-page__proportions-title">Распределение активов:</span>
                    <ul className="ready-portfolio-page__proportions">
                        {portfolio?.proportions.map(prop => {
                            return (
                                <>
                                    {prop[0].length > 0 && (
                                        <li className="ready-portfolio-page__proportion">
                                            <span className="ready-portfolio-page__proportion-name">{prop[0]} - {prop[1]}%</span>
                                        </li>
                                    )}
                                </>
                            );
                        })}
                    </ul>
                    <h2 className="ready-portfolio-page__suptitle">Пример бумаг в портфеле</h2>
                    <div className="ready-portfolio-page__lists">
                        {areBondsReady && (
                            <div className="ready-portfolio-page__lists-block">
                                <span className="ready-portfolio-page__list-title">Облигации</span>
                                <ul className="ready-portfolio-page__list">
                                    <li className="ready-portfolio-page__item">
                                        <span>Название</span>
                                        <span>Тикер</span>
                                        <span>Кол-во купонов в год</span>
                                        <span>Валюта</span>
                                        <span>Доля</span>
                                    </li>
                                    {bonds.map(bond => {
                                        return (
                                            <li className="ready-portfolio-page__item">
                                                <span>{bond.name}</span>
                                                <span>{bond.ticker}</span>
                                                <span>{bond.couponQuantityPerYear}</span>
                                                <span>{bond.currency.toUpperCase()}</span>
                                                <span>{Number(portfolio?.proportions[0][1]) / Number(portfolio?.bondsIsins.length)}%</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}

                        {areSharesReady && (
                            <div className="ready-portfolio-page__lists-block">
                                <span className="ready-portfolio-page__list-title">Акции</span>
                                <ul className="ready-portfolio-page__list">
                                    <li className="ready-portfolio-page__item">
                                        <span>Название</span>
                                        <span>Тикер</span>
                                        <span>Лот</span>
                                        <span>Валюта</span>
                                        <span>Доля</span>
                                    </li>
                                    {shares.map(share => {
                                        return (
                                            <li className="ready-portfolio-page__item">
                                                <span>{share.name}</span>
                                                <span>{share.ticker}</span>
                                                <span>{share.lot}</span>
                                                <span>{share.currency.toUpperCase()}</span>
                                                <span>{Number(portfolio?.proportions[1][1]) / Number(portfolio?.sharesTickers.length)}%</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}

                        {areEtfsReady && (
                            <div className="ready-portfolio-page__lists-block">
                                <span className="ready-portfolio-page__list-title">Фонды</span>
                                <ul className="ready-portfolio-page__list">
                                    <li className="ready-portfolio-page__item">
                                        <span>Название</span>
                                        <span>Тикер</span>
                                        <span>Лот</span>
                                        <span>Валюта</span>
                                        <span>Доля</span>
                                    </li>
                                    {etfs.map(etf => {
                                        return (
                                            <li className="ready-portfolio-page__item">
                                                <span>{etf.name}</span>
                                                <span>{etf.ticker}</span>
                                                <span>{etf.lot}</span>
                                                <span>{etf.currency.toUpperCase()}</span>
                                                <span>{Number(portfolio?.proportions[2][1]) / Number(portfolio?.etfsTickers.length)}%</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};