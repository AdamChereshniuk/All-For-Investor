import { reverseNumber } from "./reverseNumber";

export const getBeautifullNumber = (num: string) => {
    const reversedNum = reverseNumber(num);
    let resultStr = "";
    let readyCharsAmount = 0;
    let currentIndex = 0;

    while(readyCharsAmount < reversedNum.length) {
        if(currentIndex % 3 === 0) {
            resultStr += reversedNum.substring(readyCharsAmount, readyCharsAmount + 3);
            resultStr += " ";
        };

        currentIndex++;
        readyCharsAmount++;
    };

    return reverseNumber(resultStr).trim();
};