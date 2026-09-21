import { useForm } from "react-hook-form";
import "./BondsCalcPage.css";
import axios from "axios";
import { useState } from "react";
import type { IBond2 } from "../../types";
import { getBeautifullNumber } from "../../utils/getBeautifullNumber";

interface IBondsCalcForm {
    isin: string,
    purchaseDate: Date,
    purchaseSum: number,
    purchaseNkd: number,
    purchaseAmount: number,
    tax: number,
};

export const BondsCalcPage = () => {
    const currentTokenFromLocalStorage = localStorage.getItem("currentToken") || "t.uOD3cbT60-H5aE2N85KKG2dLzS5zBuY0NzwKo1Nkw_y2729R3pHbCvcNAWfQPy2CNuPhWjJwRCRb7bd84r0D0A";

    const [error, setError] = useState<string>("");
    const [totalIncome, setTotalIncome] = useState<number>(0);
    const [cuoponIncome, setCuoponIncome] = useState<number>(0);
    const [cuoponYield, setCuoponYield] = useState<number>(0);
    const [currentCuoponYield, setCurrentCuoponYield] = useState<number>(0);
    const [YTM, setYTM] = useState<number>(0);

    const { register, handleSubmit, formState: { errors } } = useForm<IBondsCalcForm>({ mode: "all" });

    const calculate = (isin: string, purchaseDate: Date, purchaseSum: number, purchaseNkd: number, purchaseAmount: number, tax: number) => {
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
            const bonds: IBond2[] = response.data.instruments;
            const bondByIsin = bonds.filter(bond => bond.isin === isin)[0];

            // Основная логика
            let totalIncome: number = 0;
            let totalCuoponIncome: number = 0;

            totalIncome -= purchaseNkd * purchaseAmount;
            totalIncome += Number((Number(bondByIsin.initialNominal.units) - Number(purchaseSum))) * purchaseAmount;

            let config1 = {
                method: "post",
                maxBodyLength: Infinity,
                url: "https://invest-public-api.tbank.ru/rest/tinkoff.public.invest.api.contract.v1.InstrumentsService/GetBondCoupons",
                headers: { 
                    "Content-Type": "application/json", 
                    "Accept": "application/json", 
                    "Authorization": `Bearer ${currentTokenFromLocalStorage}`,
                },
                data: JSON.stringify({
                    "from": new Date(purchaseDate).toISOString(),
                    "to": new Date(bondByIsin.maturityDate).toISOString(),
                    "instrumentId": bondByIsin.uid,
                }),
            };

            axios.request(config1).then(res => {
                const bondByIsinCuopons = res.data.events;

                // Вычисляем купонную доходность
                let newCuoponYield = Number(((Number(bondByIsinCuopons[0].payOneBond.units) * Number(bondByIsin.couponQuantityPerYear) / Number(bondByIsin.initialNominal.units)) * 100).toFixed(2));

                if(bondByIsinCuopons[0].payOneBond.units === "0" || bondByIsinCuopons[1].payOneBond.units === "0") {
                    // Если купон плавающий
                    setError("Можно рассчитать только доходность облигаций с фиксированным купоном");
                    return;
                } else {
                    // Если купон фиксированный
                    for (const cuopon of bondByIsinCuopons) {
                        const cuoponValue = tax === 0 ? Number(cuopon.payOneBond.units) : Number((Number(cuopon.payOneBond.units) * Number(`0.${100 - tax}`)).toFixed(2));

                        totalCuoponIncome += cuoponValue * Number(purchaseAmount);
                        totalIncome += cuoponValue * Number(purchaseAmount);
                    };
                };

                let yearsAmountBetweenPurchaseAndMaturity = Math.abs(new Date(purchaseDate).getFullYear() - new Date(bondByIsin.maturityDate).getFullYear());
                let newCurrentCuoponYield = (((((totalCuoponIncome / yearsAmountBetweenPurchaseAndMaturity / purchaseAmount) / purchaseSum) * 1000)));
                let newYTM = (((totalIncome / purchaseAmount) / Number(bondByIsin.initialNominal.units))) * 100;

                setTotalIncome(Number(totalIncome.toFixed(2)));
                setCuoponIncome(Number((totalCuoponIncome).toFixed(2)));
                setCuoponYield(newCuoponYield);
                setCurrentCuoponYield(Number((newCurrentCuoponYield).toFixed(2)));
                setYTM(Number((newYTM / yearsAmountBetweenPurchaseAndMaturity).toFixed(2)));
            }).catch(err => setError(err));
        }).catch(error => setError(error));
    };

    return (
        <div className="bonds-calc-page">
            <div className="container">
                <h1 className="bonds-calc-page__title title">Калькулятор облигаций</h1>
                <p className="text">Рассчитайте текущую купонную доходность и доходность к погашению облигации с фиксированным купоном по ISIN.</p>

                <form className="bonds-calc-page__wrapper" onSubmit={handleSubmit(({ isin, purchaseDate, purchaseSum, purchaseNkd, purchaseAmount, tax }) => {
                    calculate(isin, purchaseDate, purchaseSum, purchaseNkd, purchaseAmount, tax);
                })}>
                    <ul className="bonds-calc-page__params">
                        <li className="bonds-calc-page__param">
                            <span className="bonds-calc-page__param-title">ISIN</span>
                            <input className="bonds-calc-page__param-input" type="text" placeholder="ISIN" {...register("isin", {
                                required: "Введите ISIN облигации",
                                minLength: {
                                    value: 1,
                                    message: "Минимальная длина ISIN 1 символ",
                                },
                                maxLength: {
                                    value: 200,
                                    message: "Максимальная длина ISIN 200 символов",
                                },
                            })} />
                        </li>
                        <li className="bonds-calc-page__param">
                            <span className="bonds-calc-page__param-title">Дата покупки</span>
                            <input className="bonds-calc-page__param-input" type="date" placeholder="Дата покупки" {...register("purchaseDate", {
                                required: "Введите дату покупки",
                            })} />
                        </li>
                        <li className="bonds-calc-page__param">
                            <span className="bonds-calc-page__param-title">Цена покупки</span>
                            <input className="bonds-calc-page__param-input" type="float" placeholder="Цена покупки, ₽" {...register("purchaseSum", {
                                required: "Введите цену покупки",
                            })} />
                        </li>
                        <li className="bonds-calc-page__param">
                            <span className="bonds-calc-page__param-title">НКД при покупке</span>
                            <input className="bonds-calc-page__param-input" type="float" placeholder="НКД при покупке, ₽" {...register("purchaseNkd", {
                                required: "Введите НКД при покупке",
                            })} />
                        </li>
                        <li className="bonds-calc-page__param">
                            <span className="bonds-calc-page__param-title">Кол-во</span>
                            <input className="bonds-calc-page__param-input" type="number" placeholder="Кол-во, шт." {...register("purchaseAmount", {
                                required: "Введите кол-во облигаций",
                            })} />
                        </li>
                        <li className="bonds-calc-page__param">
                            <span className="bonds-calc-page__param-title">Налог</span>
                            <select className="bonds-calc-page__param-currency bonds-calc-page__param-currency-select" {...register("tax")}>
                                <option value="0">Без налога</option>
                                <option value="13">13%</option>
                                <option value="15">15%</option>
                                <option value="18">18%</option>
                                <option value="20">20%</option>
                                <option value="22">22%</option>
                            </select>
                        </li>
                    </ul>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {errors.isin && <span className="error">Введите корректный ISIN</span>}
                        {errors.purchaseDate && <span className="error">Введите корректную дату покупки</span>}
                        {errors.purchaseSum && <span className="error">Введите корректную сумму покупки</span>}
                        {errors.purchaseNkd && <span className="error">Введите корректный НКД</span>}
                        {errors.purchaseAmount && <span className="error">Введите корректное кол-во облигаций</span>}
                        {errors.tax && <span className="error">Введите корректный налог</span>}
                        {error !== "" && <span className="error">{error}</span>}
                    </div>
                    <button className="bonds-calc-page__btn btn" type="submit">Рассчитать</button>
                </form>

                {totalIncome !== 0 && (
                    <div className="bonds-calc-page__result">
                        <span className="bonds-calc-page__result-title">Ваш доход: +{getBeautifullNumber(totalIncome.toFixed(0))}₽</span>
                        <span className="bonds-calc-page__result-title">Доход от купонов: +{getBeautifullNumber(cuoponIncome.toFixed(0))}₽</span>
                        <span className="bonds-calc-page__result-title">Купонная доходность: {cuoponYield}% годовых</span>
                        <span className="bonds-calc-page__result-title">Ваша купонная доходность: {currentCuoponYield}% годовых</span>
                        <span className="bonds-calc-page__result-title">Ваша доходность к погашению: {YTM}% годовых</span>
                    </div>
                )}
            </div>
        </div>
    );
};