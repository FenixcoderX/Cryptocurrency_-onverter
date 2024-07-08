import converterStore from '../store/converterStore';
import { useEffect, useState } from 'react';
import { fetchExchangeRates } from '../api/exchangeRatesApi';

const ConverterCrypto = () => {
  const {
    valueFrom,
    valueTo,
    currencyFrom,
    currencyTo,
    setValueFrom,
    setValueTo,
    setCurrencyFrom,
    setCurrencyTo,
  } = converterStore();

  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>(
    {}
  );
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    fetchExchangeRates().then((rates) => {
      if (rates) {
        setExchangeRates(rates);
      }
    });
    setLastUpdated(new Date().toLocaleString());
  }, []);

  useEffect(() => {
    handleValueChange(valueFrom, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencyFrom, currencyTo, exchangeRates]);

  /**
   * Rounds a number after the first non-zero digit
   * @param {number} number - The number to round
   * @returns {number} The rounded number
   */
  const roundAfterFirstNonZeroDigit = (number: number): number => {
    const numberStr: string = number.toString();

    // Find the first non-zero digit after the decimal point
    let index: number = numberStr.indexOf('.') + 1;
    while (numberStr[index] === '0') {
      index++;
    }

    // Calculate the number of digits after the first non-zero digit
    const digitsAfterFirstNonZero: number =
      index - numberStr.indexOf('.') - 1 + 2;

    return Number(number.toFixed(digitsAfterFirstNonZero));
  };

  /**
   * Fixes the value by removing non-numeric characters limit the dots to one and digits after the dot to 6
   * @param (string) value - The value to fix
   * @returns (string) The fixed value
   */
  const valueFix = (value: string): string => {
    let fixedValue = value.toString().replace(/[^0-9.]/g, '');

    if ((fixedValue.match(/\./g) || []).length > 1) {
      fixedValue = fixedValue.slice(0, fixedValue.lastIndexOf('.'));
    }

    if (fixedValue.includes('.')) {
      const fixedValueSplit = fixedValue.split('.');
      if (fixedValueSplit[1].length > 6) {
        fixedValue = `${fixedValueSplit[0]}.${fixedValueSplit[1].slice(0, 6)}`;
      }
    }
    return fixedValue;
  };

  /**
   * Handles the value change in the input fields
   * @param {string} value - The value of the input field
   * @param {boolean} isFrom - Whether the value is from the "from" input field
   */
  const handleValueChange = (value: string, isFrom: boolean): void => {
    const fixedValue = valueFix(value);

    if (isFrom) {
      setValueFrom(fixedValue);
      const rateKey = `${currencyFrom}${currencyTo}`;
      const rateKeyReverse = `${currencyTo}${currencyFrom}`;
      if (fixedValue === '' || fixedValue === '.') {
        setValueTo('');
      } else {
        if (currencyFrom === currencyTo) {
          setValueTo(fixedValue);
        } else {
          const convertedValue =
            Number(fixedValue) * exchangeRates[rateKey] ||
            Number(fixedValue) * (1 / exchangeRates[rateKeyReverse]) ||
            0;
          setValueTo(roundAfterFirstNonZeroDigit(convertedValue).toString());
        }
      }
    } else {
      setValueTo(fixedValue);
      const rateKey = `${currencyTo}${currencyFrom}`;
      const rateKeyReverse = `${currencyFrom}${currencyTo}`;
      if (currencyFrom === currencyTo) {
        setValueFrom(fixedValue);
      } else {
        const convertedValue =
          Number(fixedValue) * exchangeRates[rateKey] ||
          Number(fixedValue) * (1 / exchangeRates[rateKeyReverse]) ||
          0;
        setValueFrom(roundAfterFirstNonZeroDigit(convertedValue).toString());
      }
    }
  };

  return (
    <>
      <div className="text-xl mb-4 text-center">
        Виджет конвертации криптовалют
      </div>

      {!(Object.keys(exchangeRates).length === 0) && (
        <div className="flex flex-col items-center p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
          <div className="flex flex-col items-center md:flex-row md:justify-around w-full">
            <div className="flex flex-row m-4">
              <select
                className="p-3 rounded-none rounded-l-lg text-white bg-blue-700 focus:outline-none h-12"
                value={currencyFrom}
                onChange={(e) => setCurrencyFrom(e.target.value)}
              >
                <option value="USDT">USDT</option>
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
              </select>
              <input
                className="p-3 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-48 h-12 bg-gray-800 text-white"
                type="text"
                placeholder="0.00"
                value={valueFrom}
                onChange={(e) => handleValueChange(e.target.value, true)}
              />
            </div>
            <div className="flex flex-row m-4">
              <select
                className="p-3 rounded-none rounded-l-lg text-white bg-blue-700 focus:outline-none  h-12"
                value={currencyTo}
                onChange={(e) => setCurrencyTo(e.target.value)}
              >
                <option value="USDT">USDT</option>
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
              </select>
              <input
                className="p-3 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-48 h-12 bg-gray-800 text-white"
                type="text"
                placeholder="0.00"
                value={valueTo}
                onChange={(e) => handleValueChange(e.target.value, false)}
              />
            </div>
          </div>
          <div>
            <div className="text-sm mt-2 text-center text-white">
              1 {currencyFrom} ={' '}
              {currencyFrom === currencyTo
                ? 1
                : roundAfterFirstNonZeroDigit(
                    Number(
                      exchangeRates[`${currencyFrom}${currencyTo}`] ||
                        1 / exchangeRates[`${currencyTo}${currencyFrom}`]
                    )
                  )}{' '}
              {currencyTo}
            </div>

            <div className="text-sm mt-1 text-center text-gray-300">
              Данные носят ознакомительный характер.
              <p>Дата обновления: {lastUpdated}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConverterCrypto;
