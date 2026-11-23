import {
  CostingLineItem,
  CostingCalculationSummary,
  QuoteVersion,
  SupplierContract,
} from "@/types/admin";

export interface CalculateCostingParams {
  lineItems: CostingLineItem[];
  contingencyBufferRate?: number; // e.g. 0.05 for 5%
  markupRate?: number; // e.g. 0.28 for 28% markup
  minimumProfitThresholdMargin?: number; // e.g. 0.18 for 18% minimum gross margin
  targetMarginMode?: boolean; // if true, markup is derived from desired gross margin
  desiredGrossMargin?: number; // e.g. 0.22 (22%)
}

export const costingEngine = {
  /**
   * Deterministically calculates total direct costs, contingency buffers,
   * markup, selling price, gross profit, and gross margin.
   *
   * Formulations:
   * 1. sellingPrice = effectiveCost * (1 + markupRate)
   * 2. grossProfit = sellingPrice - effectiveCost
   * 3. grossMargin = (sellingPrice - effectiveCost) / sellingPrice
   * Note: A 25% markup yields a (0.25 / 1.25) = 20.0% gross margin.
   */
  calculate(params: CalculateCostingParams): CostingCalculationSummary {
    const contingencyRate = params.contingencyBufferRate ?? 0.05; // 5% default operational buffer
    const minThreshold = params.minimumProfitThresholdMargin ?? 0.18; // 18% minimum gross margin policy

    // 1. Calculate direct itemized costs
    let totalDirectCostUsd = 0;
    const warnings: string[] = [];

    for (const item of params.lineItems) {
      // Calculate unit math
      let computedTotal = 0;
      switch (item.rateBasis) {
        case "per_person_total":
          computedTotal = item.unitCost * item.quantity;
          break;
        case "per_person_per_night":
          computedTotal = item.unitCost * item.quantity * item.multiplier;
          break;
        case "per_vehicle_per_day":
          computedTotal = item.unitCost * item.quantity * item.multiplier;
          break;
        case "fixed_group":
          computedTotal = item.unitCost * item.quantity;
          break;
        default:
          computedTotal = item.unitCost * item.quantity;
      }

      // Convert currency if needed (stored at lowest decimal precision)
      const costInUsd = item.currency === "KES"
        ? Math.round((computedTotal / item.exchangeRateToUsd) * 100) / 100
        : Math.round(computedTotal * 100) / 100;

      item.totalCostUsd = costInUsd;
      totalDirectCostUsd += costInUsd;

      // Contract integrity verification
      if (!item.supplierContractId && item.category === "accommodation") {
        warnings.push(`Accommodation '${item.description}' has no linked active supplier contract.`);
      }
    }

    // Round direct cost
    totalDirectCostUsd = Math.round(totalDirectCostUsd * 100) / 100;

    // 2. Add Contingency Buffer (weather, fuel fluctuations, remote logistics)
    const contingencyBufferUsd = Math.round(totalDirectCostUsd * contingencyRate * 100) / 100;
    const effectiveTotalCostUsd = Math.round((totalDirectCostUsd + contingencyBufferUsd) * 100) / 100;

    // 3. Determine markup rate
    let effectiveMarkupRate = params.markupRate ?? 0.28; // Default 28% markup policy

    if (params.targetMarginMode && params.desiredGrossMargin !== undefined) {
      // Desired Margin Formula: markup = margin / (1 - margin)
      // e.g. 20% margin -> 0.20 / 0.80 = 25% markup
      if (params.desiredGrossMargin >= 0.99) {
        throw new Error("Target gross margin cannot exceed 99%");
      }
      effectiveMarkupRate = params.desiredGrossMargin / (1 - params.desiredGrossMargin);
    }

    // 4. Calculate Selling Price
    // sellingPrice = effectiveTotalCostUsd * (1 + markupRate)
    const rawSellingPrice = effectiveTotalCostUsd * (1 + effectiveMarkupRate);
    const sellingPriceUsd = Math.ceil(rawSellingPrice / 10) * 10; // Round up to nearest $10 for clean luxury quoting

    // 5. Calculate Gross Profit and Gross Margin Percentage
    const grossProfitUsd = Math.round((sellingPriceUsd - effectiveTotalCostUsd) * 100) / 100;
    const grossMargin = sellingPriceUsd > 0 ? (grossProfitUsd / sellingPriceUsd) : 0;
    const grossMarginPercentage = Math.round(grossMargin * 10000) / 100; // e.g. 21.88

    // 6. Enforce Profitability Threshold Gate
    const belowThresholdWarning = grossMargin < minThreshold;
    if (belowThresholdWarning) {
      warnings.push(
        `Target gross margin (${grossMarginPercentage}%) is below company threshold (${Math.round(minThreshold * 100)}%). Requires Director sign-off.`
      );
    }

    return {
      totalDirectCostUsd,
      contingencyBufferRate: contingencyRate,
      contingencyBufferUsd,
      effectiveTotalCostUsd,
      markupRate: Math.round(effectiveMarkupRate * 1000) / 1000,
      sellingPriceUsd,
      grossProfitUsd,
      grossMarginPercentage,
      minimumProfitThresholdMargin: minThreshold * 100,
      isProfitabilityApproved: !belowThresholdWarning,
      belowThresholdWarning,
      warningNotes: warnings.length > 0 ? warnings : undefined,
    };
  },

  /**
   * Formats a confidential internal breakdown for staff with supplier rate details.
   */
  generateStaffBreakdown(quote: QuoteVersion): {
    directCost: number;
    buffer: number;
    markup: number;
    profit: number;
    marginPercent: number;
    items: CostingLineItem[];
  } {
    return {
      directCost: quote.calculation.totalDirectCostUsd,
      buffer: quote.calculation.contingencyBufferUsd,
      markup: quote.calculation.markupRate,
      profit: quote.calculation.grossProfitUsd,
      marginPercent: quote.calculation.grossMarginPercentage,
      items: quote.lineItems,
    };
  },

  /**
   * Generates guest-friendly presentation that hides confidential supplier contracts,
   * unit net costs, and supplier margin details.
   */
  generateGuestFacingQuotation(quote: QuoteVersion): {
    quoteNumber: string;
    totalPriceUsd: number;
    perPersonUsd: number;
    guestCount: number;
    summary: string;
    inclusions: string[];
    terms: string;
  } {
    return {
      quoteNumber: quote.quoteNumber,
      totalPriceUsd: quote.calculation.sellingPriceUsd,
      perPersonUsd: Math.round(quote.calculation.sellingPriceUsd / 2),
      guestCount: 2,
      summary: quote.guestFriendlyItinerarySummary,
      inclusions: [
        "All national park conservation entries and community conservancy levies",
        "Private 4x4 extended safari Land Cruiser with open-roof viewing",
        "KPSGA certified English-speaking Gold guide",
        "Full board luxury lodge & tented camp accommodation",
        "AMREF Flying Doctors 24/7 air medical evacuation cover",
      ],
      terms: quote.termsConditionsSnippet,
    };
  },
};
