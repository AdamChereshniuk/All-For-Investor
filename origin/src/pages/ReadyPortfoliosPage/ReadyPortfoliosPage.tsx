import { Link } from "react-router-dom";
import { readyPortfolios } from "../../assets/readyPortfolios";
import "./ReadyPortfoliosPage.css";

export const ReadyPortfoliosPage = () => {
    return (
        <div className="ready-portfolios-page">
            <div className="container">
                <h1 className="ready-portfolios-page__title title">Готовые портфели</h1>
                <p className="text">Подберите готовый портфель ценных бумаг под свой горизонт инвестирования, риск-профиль и цели.</p>

                <ul className="ready-portfolios-page__list">
                    {readyPortfolios.map(portfolio => {
                        return (
                            <li className="ready-portfolios-page__item">
                                <Link className="ready-portfolios-page__item-link" to={`/ready-portfolio/${portfolio.id}`}>
                                    <img className="ready-portfolios-page__item-img" src={portfolio.imageUrl} alt={portfolio.name} />
                                    <div className="ready-portfolios-page__item-content">
                                        <h2 className="ready-portfolios-page__item-title">{portfolio.name}</h2>
                                        <p className="ready-portfolios-page__item-descr">{portfolio.description.substring(0, 50)}...</p>
                                        <p className="ready-portfolios-page__item-yield">Доходность ~{portfolio.yieldValue}% годовых</p>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};