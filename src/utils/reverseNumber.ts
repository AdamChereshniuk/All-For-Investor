export const reverseNumber = (num: string) => {
    let resultArr = [];

    for (const char of num) {
        resultArr.unshift(char);
    };

    return resultArr.join().replaceAll(",", "");
};