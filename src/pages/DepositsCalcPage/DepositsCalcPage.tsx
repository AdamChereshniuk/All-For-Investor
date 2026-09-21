import { useForm } from "react-hook-form";
import "./DepositsCalcPage.css";
import { useState } from "react";
import { getBeautifullNumber } from "../../utils/getBeautifullNumber";

interface IDepositsCalcForm {
    sum: number,
    period: number,
    yieldValue: number,
    frequencyOfPayments: string,
    capitalizationOfInterest: string,
    topUpSum: number,
    topUpPeriod: string,
    withdrawSum: number,
    withdrawPeriod: string,
    inflationIsNeeded: string,
};

interface IResultMonth {
    month: number,
    income: number,
    resultSum: number,
};

export const DepositsCalcPage = () => {
    const [resultMonths, setResultMonths] = useState<IResultMonth[]>([]);
    const [totalIncome, setTotalIncome] = useState<number>(0);
    const [realYield, setRealYield] = useState<number>(0);

    const { register, handleSubmit, formState: { errors } } = useForm<IDepositsCalcForm>({ mode: "all" });

    const calculate = (sum: number, period: number, yieldValue: number, frequencyOfPayments: string, capitalizationOfInterest: string, topUpSum: number, topUpPeriod: string, withdrawSum: number, withdrawPeriod: string, inflationIsNeeded: string) => {
        let resultMonths: IResultMonth[] = [];
        let totalIncome: number = 0;
        let currentMonth: number = 1;
        let totalSum: number = Number(sum);
        let monthStep = 0;
        let monthTopUpStep = 0;
        let monthWithdrawStep = 0;

        switch(frequencyOfPayments) {
            case "everyMonth":
                monthStep = 1;
                break;
            case "everyQuarter":
                monthStep = 3;
                break;
            case "everySixMonths":
                monthStep = 6;
                break;
            case "everyYear":
                monthStep = 12;
                break;
        };
        switch(topUpPeriod) {
            case "everyMonth":
                monthTopUpStep = 1;
                break;
            case "everyQuarter":
                monthTopUpStep = 3;
                break;
            case "everySixMonths":
                monthTopUpStep = 6;
                break;
            case "everyYear":
                monthTopUpStep = 12;
                break;
        };
        switch(withdrawPeriod) {
            case "everyMonth":
                monthWithdrawStep = 1;
                break;
            case "everyQuarter":
                monthWithdrawStep = 3;
                break;
            case "everySixMonths":
                monthWithdrawStep = 6;
                break;
            case "everyYear":
                monthWithdrawStep = 12;
                break;
        };

        if(frequencyOfPayments == "atTheEnd") {
            while (currentMonth <= period) {
                if(Number.isInteger(currentMonth / monthTopUpStep) && currentMonth / monthTopUpStep !== 0) totalSum += Number(topUpSum);
                if(Number.isInteger(currentMonth / monthWithdrawStep) && currentMonth / monthWithdrawStep !== 0) totalSum -= Number(withdrawSum);

                if(currentMonth == period) {
                    const periodInYears = Number((period / 12).toFixed(2));
                    const resultIncome = Number(((sum * Number(`0.${String(yieldValue).replaceAll(".", "").replaceAll(",", "")}`)) * periodInYears).toFixed(2));
                    
                    totalIncome += resultIncome;
                    resultMonths.push({
                        month: currentMonth + 1,
                        income: resultIncome,
                        resultSum: totalSum,
                    });
                } else {
                    resultMonths.push({
                        month: currentMonth + 1,
                        income: 0,
                        resultSum: totalSum,
                    });
                };

                currentMonth++;
            };
        } else {
            if(monthStep == 0 || monthTopUpStep == 0) return;

            while (currentMonth <= period) {
                if(Number.isInteger(currentMonth / monthTopUpStep) && currentMonth / monthTopUpStep !== 0) totalSum += Number(topUpSum);
                if(Number.isInteger(currentMonth / monthWithdrawStep) && currentMonth / monthWithdrawStep !== 0) totalSum -= Number(withdrawSum);

                if(Number.isInteger(currentMonth / monthStep) && currentMonth / monthStep !== 0) {
                    const resultIncome = Number(((totalSum * Number(`0.${String(yieldValue).replaceAll(".", "").replaceAll(",", "")}`)) * (monthStep / 12)).toFixed(2));
                    if(capitalizationOfInterest == "true") totalSum += resultIncome;
                    totalIncome += resultIncome;

                    resultMonths.push({
                        month: currentMonth,
                        income: resultIncome,
                        resultSum: Number(totalSum.toFixed(2)),
                    });
                } else {
                    if(Number.isInteger(currentMonth / monthTopUpStep) && currentMonth / monthTopUpStep !== 0) totalSum += Number(topUpSum);

                    resultMonths.push({
                        month: currentMonth,
                        income: 0,
                        resultSum: Number(totalSum.toFixed(2)),
                    });
                };

                currentMonth++;
            };
        };
        
        setResultMonths(resultMonths);
        setTotalIncome(Number(totalIncome.toFixed(2)));
        if(inflationIsNeeded) setRealYield(Number(yieldValue) - 8);
    };

    return (
        <div className="deposits-calc-page">
            <div className="container">
                <h1 className="deposits-calc-page__title title">Калькулятор вкладов</h1>
                <p className="text">Рассчитайте доход и реальную ставку по банковским вкладам учитывая инфляцию.</p>
                
                <form className="deposits-calc-page__wrapper" onSubmit={handleSubmit(({ sum, period, yieldValue, frequencyOfPayments, capitalizationOfInterest, topUpSum, topUpPeriod, withdrawSum, withdrawPeriod, inflationIsNeeded }) => {
                    calculate(sum, period, yieldValue, frequencyOfPayments, capitalizationOfInterest, topUpSum, topUpPeriod, withdrawSum, withdrawPeriod, inflationIsNeeded);
                })}>
                    <ul className="deposits-calc-page__params">
                        <li className="deposits-calc-page__param">
                            <span className="deposits-calc-page__param-title">Сумма вклада</span>
                            <input className="deposits-calc-page__param-input" type="number" placeholder="Сумма вклада" {...register("sum", {
                                required: "Введите сумму вклада",
                                min: {
                                    value: 1000,
                                    message: "Минимальная сумма вклада 1000₽",
                                },
                                max: {
                                    value: 1000000000,
                                    message: "Максимальная сумма вклада 10 000 000₽",
                                },
                            })} />
                            <span className="deposits-calc-page__param-currency">₽</span>
                        </li>
                        <li className="deposits-calc-page__param">
                            <span className="deposits-calc-page__param-title">Срок размещения</span>
                            <input className="deposits-calc-page__param-input" type="number" placeholder="Срок размещения" {...register("period", {
                                required: "Введите срок вклада",
                                min: {
                                    value: 1,
                                    message: "Минимальный срок вклада 1 месяц",
                                },
                                max: {
                                    value: 120,
                                    message: "Максимальный срок вклада 10 лет",
                                },
                            })} />
                            <span>Месяцев</span>
                        </li>
                        <li className="deposits-calc-page__param">
                            <span className="deposits-calc-page__param-title">Процентная ставка</span>
                            <input className="deposits-calc-page__param-input" type="float" placeholder="Ставка" {...register("yieldValue", {
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
                            <span className="deposits-calc-page__param-currency">%</span>
                        </li>
                        <li className="deposits-calc-page__param">
                            <span className="deposits-calc-page__param-title">Периодичность выплат</span>
                            <select className="deposits-calc-page__param-currency deposits-calc-page__param-currency-select" {...register("frequencyOfPayments")}>
                                <option value="atTheEnd">В конце срока</option>
                                <option value="everyMonth">Раз в месяц</option>
                                <option value="everyQuarter">Раз в квартал</option>
                                <option value="everySixMonths">Раз в полгода</option>
                                <option value="everyYear">Раз в год</option>
                            </select>
                        </li>
                        <li className="deposits-calc-page__param">
                            <span className="deposits-calc-page__param-title">Капитализация процентов</span>
                            <select className="deposits-calc-page__param-currency deposits-calc-page__param-currency-select" {...register("capitalizationOfInterest")}>
                                <option value="true">Да</option>
                                <option value="false">Нет</option>
                            </select>
                        </li>
                        <li className="deposits-calc-page__param">
                            <span className="deposits-calc-page__param-title">Пополнение</span>
                            <input className="deposits-calc-page__param-input" type="number" placeholder="Сумма" {...register("topUpSum", {
                                required: "Введите сумму пополнения",
                                max: {
                                    value: 1_000_000,
                                    message: "Максимальная сумма пополнения 1 000 000₽",
                                },
                            })} />
                            <select className="deposits-calc-page__param-currency deposits-calc-page__param-currency-select" {...register("topUpPeriod")}>
                                <option value="everyMonth">Раз в месяц</option>
                                <option value="everyQuarter">Раз в квартал</option>
                                <option value="everySixMonths">Раз в полгода</option>
                                <option value="everyYear">Раз в год</option>
                            </select>
                        </li>
                        <li className="deposits-calc-page__param">
                            <span className="deposits-calc-page__param-title">Снятие</span>
                            <input className="deposits-calc-page__param-input" type="number" placeholder="Сумма" {...register("withdrawSum", {
                                required: "Введите сумму снятия",
                                max: {
                                    value: 1_000_000,
                                    message: "Максимальная сумма снятия 1 000 000₽",
                                },
                            })} />
                            <select className="deposits-calc-page__param-currency deposits-calc-page__param-currency-select" {...register("withdrawPeriod")}>
                                <option value="everyMonth">Раз в месяц</option>
                                <option value="everyQuarter">Раз в квартал</option>
                                <option value="everySixMonths">Раз в полгода</option>
                                <option value="everyYear">Раз в год</option>
                            </select>
                        </li>
                        <li className="deposits-calc-page__param">
                            <span className="deposits-calc-page__param-title">Учитывать инфляцию (8%)</span>
                            <select className="deposits-calc-page__param-currency deposits-calc-page__param-currency-select" {...register("inflationIsNeeded")}>
                                <option value="true">Да</option>
                                <option value="false">Нет</option>
                            </select>
                        </li>
                    </ul>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {errors.sum && <span className="error">{errors.sum.message}</span>}
                        {errors.period && <span className="error">{errors.period.message}</span>}
                        {errors.yieldValue && <span className="error">{errors.yieldValue.message}</span>}
                        {errors.frequencyOfPayments && <span className="error">{errors.frequencyOfPayments.message}</span>}
                    </div>
                    <button className="deposits-calc-page__btn btn" type="submit">Рассчитать</button>
                </form>
                {resultMonths.length !== 0 && (
                    <div className="deposits-calc-page__result">
                        <span className="deposits-calc-page__result-title">Ваш доход: +{getBeautifullNumber(totalIncome.toFixed(0))}₽</span>

                        <ul className="deposits-calc-page__result-list">
                            <li className="deposits-calc-page__result-item">
                                <span className="deposits-calc-page__result-item-month">Месяц</span>
                                <span className="deposits-calc-page__result-item-income">Доход</span>
                                <span className="deposits-calc-page__result-item-result-sum">Итоговая сумма</span>
                            </li>

                            {resultMonths.map(month => {
                                return (
                                    <li className="deposits-calc-page__result-item">
                                        <span className="deposits-calc-page__result-item-month">{month.month}</span>
                                        <span className="deposits-calc-page__result-item-income">{month.income !== 0 ? `+${getBeautifullNumber(month.income.toFixed(0))}₽` : `${getBeautifullNumber(month.income.toFixed(0))}₽`}</span>
                                        <span className="deposits-calc-page__result-item-result-sum">{getBeautifullNumber(month.resultSum.toFixed(0))}₽</span>
                                    </li>
                                );
                            })}
                        </ul>

                        {realYield !== 0 && <span className="deposits-calc-page__result-title">Реальная доходность: {realYield}% годовых</span>}
                    </div>
                )}
            </div>
        </div>
    );
};