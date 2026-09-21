import { useForm } from "react-hook-form";
import "./InvestmentsCalcPage.css";
import { useState } from "react";
import { getBeautifullNumber } from "../../utils/getBeautifullNumber";

interface InvestmentsCalcForm {
    initialCapital: string,
    period: string,
    yieldValue: string,
    reinvest: string,
    topUpSum: string,
    topUpPeriod: string,
    tax: string,
    inflationIsNeeded: string,
};

interface IResultYear {
    year: number,
    income: number,
    topUpsSum: number,
    resultSum: number,
};

export const InvestmentsCalcPage = () => {
    const [resultYears, setResultYears] = useState<IResultYear[]>([]);
    const [totalIncome, setTotalIncome] = useState<number>(0);
    const [totalSum, setTotalSum] = useState<number>(0);
    const [totalTopUps, setTotalTopUps] = useState<number>(0);
    const [realIncome, setRealIncome] = useState<number>(0);
    const [realYield, setRealYield] = useState<number>(0);

    const calculate = (initialCapital: string, period: string, yieldValue: string, reinvest: string, topUpSum: string, topUpPeriod: string, inflationIsNeeded: string, tax: string) => {
        let resultYears: IResultYear[] = [];
        let totalIncome: number = 0;
        let currentYear: number = 1;
        let totalSum: number = Number(initialCapital.replaceAll(" ", ""));
        let totalTopUps: number = 0;
        let topUpQuantity: number = 0;

        switch(topUpPeriod) {
            case "everyMonth":
                topUpQuantity = 12;
                break;
            case "everyQuarter":
                topUpQuantity = 3;
                break;
            case "everySixMonths":
                topUpQuantity = 6;
                break;
            case "everyYear":
                topUpQuantity = 1;
                break;
        };

        while (currentYear <= Number(period)) {
            totalSum += Number(topUpSum) * topUpQuantity;
            totalTopUps += Number(topUpSum) * topUpQuantity;

            const resultIncome = Number(tax) == 0 ? Number((totalSum * Number(`0.${String(yieldValue).replaceAll(".", "").replaceAll(",", "")}`)).toFixed(0)) : Number((totalSum * Number(`0.${String(yieldValue).replaceAll(".", "").replaceAll(",", "")}`)).toFixed(0)) * Number(`0.${100 - Number(tax)}`);

            if(reinvest === "true") totalSum += resultIncome;
            totalIncome += resultIncome;

            resultYears.push({
                year: currentYear,
                income: Number(resultIncome.toFixed(0)),
                topUpsSum: Number(topUpSum) * topUpQuantity,
                resultSum: Number(totalSum.toFixed(0)),
            });

            currentYear++;
        };
        
        if(inflationIsNeeded) {
            setRealYield(((1 + Number(`0.${yieldValue}`)) / (1 + 0.08) - 1) * 100);
            setRealIncome(totalIncome / ((1 + 0.08) ** Number(period)));
        };
        setResultYears(resultYears);
        setTotalIncome(totalIncome);
        setTotalSum(totalSum);
        setTotalTopUps(totalTopUps);
    };

    const { register, handleSubmit, formState: { errors } } = useForm<InvestmentsCalcForm>({ mode: "onSubmit" });
    
    return (
        <div className="investments-calc-page">
            <div className="container">
                <h1 className="investments-calc-page__title title">Калькулятор инвестиций</h1>
                <p className="text">Рассчитайте доход и реальную ставку по своим инвестициям учитывая инфляцию.</p>

                <form className="investments-calc-page__wrapper" onSubmit={handleSubmit(({ initialCapital, period, yieldValue, reinvest, topUpSum, topUpPeriod, inflationIsNeeded, tax }) => {
                    calculate(initialCapital.replaceAll(" ", ""), period.replaceAll(" ", ""), yieldValue.replaceAll(" ", ""), reinvest.replaceAll(" ", ""), topUpSum.replaceAll(" ", ""), topUpPeriod.replaceAll(" ", ""), inflationIsNeeded.replaceAll(" ", ""), tax.replaceAll(" ", ""));
                })}>
                    <ul className="investments-calc-page__params">
                        <li className="investments-calc-page__param">
                            <span className="investments-calc-page__param-title">Стартовый капитал</span>
                            <input className="investments-calc-page__param-input" type="float" placeholder="Стартовый капитал" {...register("initialCapital", {
                                required: "Введите стартовый капитал",
                                minLength: {
                                    value: 1,
                                    message: "Минимальный стартовый капитал 1₽",
                                },
                                maxLength: {
                                    value: 100_000_000,
                                    message: "Максимальный стартовый капитал 100 000 000₽",
                                },
                            })} />
                            <span className="investments-calc-page__param-currency">₽</span>
                        </li>
                        <li className="investments-calc-page__param">
                            <span className="investments-calc-page__param-title">Срок</span>
                            <input className="investments-calc-page__param-input" type="number" placeholder="Срок" {...register("period", {
                                required: "Введите срок",
                                min: {
                                    value: 1,
                                    message: "Минимальный срок 1 год",
                                },
                                max: {
                                    value: 20,
                                    message: "Максимальный срок 20 лет",
                                },
                            })} />
                            <span className="investments-calc-page__param-currency">Лет</span>
                        </li>
                        <li className="investments-calc-page__param">
                            <span className="investments-calc-page__param-title">Ставка</span>
                            <input className="investments-calc-page__param-input" type="float" placeholder="Ставка" {...register("yieldValue", {
                                required: "Введите ставку",
                                min: {
                                    value: 1,
                                    message: "Минимальная ставка 1%",
                                },
                                max: {
                                    value: 100,
                                    message: "Максимальная ставка 100%",
                                },
                            })} />
                            <span className="investments-calc-page__param-currency">% годовых</span>
                        </li>
                        <li className="investments-calc-page__param">
                            <span className="investments-calc-page__param-title">Реинвестирование</span>
                            <select className="investments-calc-page__param-currency investments-calc-page__param-currency-select" {...register("reinvest")}>
                                <option value="true">Да</option>
                                <option value="false">Нет</option>
                            </select>
                        </li>
                        <li className="investments-calc-page__param">
                            <span className="investments-calc-page__param-title">Пополнение</span>
                            <input className="investments-calc-page__param-input" type="float" placeholder="Сумма" {...register("topUpSum", {
                                required: "Введите сумму пополнения",
                                min: {
                                    value: 1,
                                    message: "Минимальная сумма пополения 1₽",
                                },
                                max: {
                                    value: 1_000_000,
                                    message: "Максимальная сумма пополения 1 000 000₽",
                                },
                            })} />
                            <select className="investments-calc-page__param-currency investments-calc-page__param-currency-select" {...register("topUpPeriod")}>
                                <option value="everyMonth">Раз в месяц</option>
                                <option value="everyQuarter">Раз в квартал</option>
                                <option value="everySixMonths">Раз в полгода</option>
                                <option value="everyYear">Раз в год</option>
                            </select>
                        </li>
                        <li className="investments-calc-page__param">
                            <span className="investments-calc-page__param-title">Налог</span>
                            <select className="investments-calc-page__param-currency investments-calc-page__param-currency-select" {...register("tax")}>
                                <option value="0">Без налога</option>
                                <option value="13">13%</option>
                                <option value="15">15%</option>
                                <option value="18">18%</option>
                                <option value="20">20%</option>
                                <option value="22">22%</option>
                            </select>
                        </li>
                        <li className="investments-calc-page__param">
                            <span className="investments-calc-page__param-title">Учитывать инфляцию</span>
                            <select className="investments-calc-page__param-currency investments-calc-page__param-currency-select" {...register("inflationIsNeeded")}>
                                <option value="true">Да</option>
                                <option value="false">Нет</option>
                            </select>
                        </li>
                    </ul>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {errors.initialCapital && <span className="error">{errors.initialCapital?.message}</span>}
                        {errors.period && <span className="error">{errors.period?.message}</span>}
                        {errors.yieldValue && <span className="error">{errors.yieldValue?.message}</span>}
                        {errors.reinvest && <span className="error">{errors.reinvest?.message}</span>}
                        {errors.topUpSum && <span className="error">{errors.topUpSum?.message}</span>}
                        {errors.topUpPeriod && <span className="error">{errors.topUpPeriod?.message}</span>}
                    </div>
                    <button className="investments-calc-page__btn btn" type="submit">Рассчитать</button>
                </form>

                {totalIncome !== 0 && (
                    <div className="investments-calc-page__result">
                        <span className="investments-calc-page__result-title">Ваш доход: +{getBeautifullNumber(totalIncome.toFixed(0))}₽</span>
                        <span className="investments-calc-page__result-title">Сумма пополнений: +{getBeautifullNumber(totalTopUps.toFixed(0))}₽</span>
                        <span className="investments-calc-page__result-title">Итоговая сумма: {getBeautifullNumber(totalSum.toFixed(0))}₽</span>
                        {realIncome !== 0 && <span className="investments-calc-page__result-title">Реальный доход с учетом инфляции: {getBeautifullNumber(realIncome.toFixed(0))}₽</span>}
                        {realYield !== 0 && <span className="investments-calc-page__result-title">Реальная ставка с учетом инфляции: {realYield.toFixed(2)}%</span>}

                        <ul className="investments-calc-page__result-list">
                            <li className="investments-calc-page__result-item">
                                <span className="investments-calc-page__result-item-month">Год</span>
                                <span className="investments-calc-page__result-item-income">Доход</span>
                                <span className="investments-calc-page__result-item-income">Пополнения</span>
                                <span className="investments-calc-page__result-item-result-sum">Итоговая сумма</span>
                            </li>

                            {resultYears.map(month => {
                                return (
                                    <li className="investments-calc-page__result-item">
                                        <span className="investments-calc-page__result-item-month">{month.year}</span>
                                        <span className="investments-calc-page__result-item-income">{month.income !== 0 ? `+${getBeautifullNumber(String(month.income))}₽` : `+${getBeautifullNumber(String(month.income))}`}</span>
                                        <span className="investments-calc-page__result-item-income">+{getBeautifullNumber(month.topUpsSum.toString())}₽</span>
                                        <span className="investments-calc-page__result-item-result-sum">{getBeautifullNumber(String(month.resultSum))}₽</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};