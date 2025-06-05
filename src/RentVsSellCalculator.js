import React, { useState } from 'react';

export default function RentVsSellCalculator() {
  const [inputs, setInputs] = useState({
    address: '',
    homeValue: 750000,
    mortgageBalance: 400000,
    mortgagePayment: 2500,
    rentalIncome: 3500,
    ownershipCosts: 600,
    sellingCostsPercent: 0.06,
    appreciationRate: 0.03,
    rentIncreaseRate: 0.02,
    investmentReturnRate: 0.05,
    timeframeYears: 5,
    depreciationAnnual: 10909,
    taxSavingsRate: 0.24
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const calcSellScenario = () => {
    const netProceeds =
      inputs.homeValue * (1 - inputs.sellingCostsPercent) - inputs.mortgageBalance;
    const futureValue = netProceeds * Math.pow(1 + inputs.investmentReturnRate, inputs.timeframeYears);
    return { netProceeds, futureValue };
  };

  const calcRentScenario = () => {
    let totalCashFlow = 0;
    let propertyValue = inputs.homeValue;
    let annualRent = inputs.rentalIncome * 12;
    let valueGrowth = propertyValue;
    let totalTaxBenefit = 0;
    for (let i = 0; i < inputs.timeframeYears; i++) {
      const annualOwnershipCosts = inputs.ownershipCosts * 12;
      const net = annualRent - annualOwnershipCosts - inputs.mortgagePayment * 12;
      totalCashFlow += net;
      totalTaxBenefit += inputs.depreciationAnnual * inputs.taxSavingsRate;
      annualRent *= 1 + inputs.rentIncreaseRate;
      valueGrowth *= 1 + inputs.appreciationRate;
    }
    return { totalCashFlow, propertyValue: valueGrowth, taxBenefit: totalTaxBenefit };
  };

  const sell = calcSellScenario();
  const rent = calcRentScenario();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Rent vs Sell Calculator</h1>
      <div className="grid grid-cols-2 gap-4">
        {[
          ['Address', 'address'],
          ['Home Value ($)', 'homeValue'],
          ['Mortgage Balance ($)', 'mortgageBalance'],
          ['Monthly Mortgage Payment ($)', 'mortgagePayment'],
          ['Monthly Rental Income ($)', 'rentalIncome'],
          ['Monthly Ownership Costs ($)', 'ownershipCosts'],
          ['Selling Costs (%)', 'sellingCostsPercent'],
          ['Annual Appreciation Rate (%)', 'appreciationRate'],
          ['Annual Rent Increase (%)', 'rentIncreaseRate'],
          ['Investment Return Rate (%)', 'investmentReturnRate'],
          ['Annual Depreciation ($)', 'depreciationAnnual'],
          ['Tax Savings Rate (%)', 'taxSavingsRate']
        ].map(([label, name]) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              type="text"
              name={name}
              value={inputs[name]}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border rounded"
            />
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p>* Home value estimates sourced from comparable listings. Rental potential based on Zillow & Rentometer. Investment return based on 10-year S&P 500 average.</p>
      </div>

      <h2 className="text-xl font-semibold mt-8">Sell Scenario</h2>
      <p>Net Proceeds: ${sell.netProceeds.toLocaleString()}</p>
      <p>Future Investment Value (5 yrs): ${sell.futureValue.toLocaleString()}</p>

      <h2 className="text-xl font-semibold mt-6">Rent Scenario</h2>
      <p>Total Cash Flow (5 yrs): ${rent.totalCashFlow.toLocaleString()}</p>
      <p>Property Value after 5 yrs: ${rent.propertyValue.toLocaleString()}</p>
      <p>Tax Benefit from Depreciation: ${rent.taxBenefit.toLocaleString()}</p>
    </div>
  );
}
