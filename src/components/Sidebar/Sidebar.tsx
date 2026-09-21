import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";
import "./Sidebar.css";

export const Sidebar = () => {
    return (
        <div className="side-bar">
            <Link className="side-bar__logo" to="/">
                <img src={logo} alt="Лого" />
            </Link>

            <nav className="side-bar__nav">
                <ul className="side-bar__list">
                    <li className="side-bar__item">
                        <Link className="side-bar__item-link" to="/All-For-Investor/portfolio-by-token-page">Tinkoff API Token</Link>
                    </li>
                    <li className="side-bar__item">
                        <Link className="side-bar__item-link" to="/All-For-Investor/bonds-screener">Скринер облигаций</Link>
                    </li>
                    <li className="side-bar__item">
                        <Link className="side-bar__item-link" to="/All-For-Investor/shares-screener">Скринер акций</Link>
                    </li>
                    <li className="side-bar__item">
                        <Link className="side-bar__item-link" to="/All-For-Investor/deposits-calc">Калькулятор вкладов</Link>
                    </li>
                    <li className="side-bar__item">
                        <Link className="side-bar__item-link" to="/All-For-Investor/bonds-calc">Калькулятор облигаций</Link>
                    </li>
                    <li className="side-bar__item">
                        <Link className="side-bar__item-link" to="/All-For-Investor/investments-calc">Калькулятор инвестиций</Link>
                    </li>
                    <li className="side-bar__item">
                        <Link className="side-bar__item-link" to="/All-For-Investor/ready-portfolios">Готовые портфели</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};