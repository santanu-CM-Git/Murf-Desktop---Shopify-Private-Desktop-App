import Dexie from "dexie";

// Initialize IndexedDB with Dexie
const db = new Dexie("OrderDatabase");
db.version(1).stores({
  orders:
    "++id, __id, name, paymentMethod, realSource, sourceName, createdAt, cancelledAt, email, financialStatus, fulfillmentStatus, line_item_name, line_item_price, line_item_quantity, line_item_sku, line_item_discount, processedAt, subtotal, discount_dont_use, total, tax_dont_use, currentSubtotalPrice, customerEmail, discountCodes_Code, fulfillmentOrdersFulfillAtDates, lineitemDiscountAllocationsDiscountCodes, lineitemFulfillmentLocationNames, line_item_product_type, lineitemRefundedSubtotal, lineitemRefundedTaxes, lineitemTaxLinesPrices, lineitemVariantInventoryItemCost, shippingLinesPrices, tags, totalOutstanding, taxes, userId, paymentGatewayNames, lineitemFulfillmentTrackingNumbers, lineitemRefundedQuantity, extendedPrice, discountAmount, shipping, refundedAmount, employeeName, lineItemCogs, refundedCogs, countPay, transactions, gatewayName, fulfillAt, [__id]",
  filterMetadata: "id, createdAtStart, createdAtEnd",
  currentStore: "id, store_url",
});

export function getDb() {
  const storeUrl = localStorage.getItem("activeStore");
  if (!storeUrl) {
    throw new Error("No active store selected");
  }

  return new Dexie(`OrderDatabase_${storeUrl}`).version(1).stores({
    orders:
    "++id, __id, name, paymentMethod, realSource, sourceName, createdAt, email, financialStatus, fulfillmentStatus, line_item_name, line_item_price, line_item_quantity, line_item_sku, line_item_discount, processedAt, subtotal, discount_dont_use, total, tax_dont_use, currentSubtotalPrice, customerEmail, discountCodes_Code, fulfillmentOrdersFulfillAtDates, lineitemDiscountAllocationsDiscountCodes, lineitemFulfillmentLocationNames, line_item_product_type, lineitemRefundedSubtotal, lineitemRefundedTaxes, lineitemTaxLinesPrices, lineitemVariantInventoryItemCost, shippingLinesPrices, tags, totalOutstanding, taxes, userId, paymentGatewayNames, lineitemFulfillmentTrackingNumbers, lineitemRefundedQuantity, extendedPrice, discountAmount, shipping, refundedAmount, employeeName, lineItemCogs, refundedCogs, countPay,  fulfillAt, [__id]",
    filterMetadata: "id, createdAtStart, createdAtEnd",
  });
}

export default db