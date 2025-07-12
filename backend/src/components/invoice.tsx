import { Document, Page, renderToBuffer, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontSize: 10,
    lineHeight: 1.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
  },
  companySection: {
    flex: 1,
  },
  companyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  invoiceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b7280',
    textAlign: 'right',
  },
  invoiceNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
    textAlign: 'right',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  column: {
    flex: 1,
    marginRight: 20,
  },
  columnLast: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  text: {
    fontSize: 10,
    color: '#4b5563',
    marginBottom: 4,
  },
  textBold: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    color: '#374151',
  },
  tableCellHeader: {
    flex: 1,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1f2937',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  tableCellRight: {
    flex: 1,
    fontSize: 9,
    color: '#374151',
    textAlign: 'right',
  },
  tableCellHeaderRight: {
    flex: 1,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  totalsSection: {
    alignItems: 'flex-end',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 6,
    minWidth: 200,
  },
  totalLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginRight: 40,
    textAlign: 'right',
    flex: 1,
  },
  totalValue: {
    fontSize: 10,
    color: '#374151',
    textAlign: 'right',
    minWidth: 80,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#d1d5db',
    minWidth: 200,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginRight: 40,
    textAlign: 'right',
    flex: 1,
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563eb',
    textAlign: 'right',
    minWidth: 80,
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

interface InvoiceData {
  invoiceNumber: string;
  client: {
    name: string;
    email: string;
    address?: string | null;
    gstin?: string | null;
  };
  currency?: string | null;
  invoiceDate?: string | null;
  dueDate?: string | null;
  items?: Array<{
    product: string;
    quantity: string;
    unitPrice: string;
  }>;
}

const formatCurrency = (amount: number, currency: string = 'USD') => {
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    AUD: 'A$',
    CAD: 'C$',
    JPY: '¥',
    CHF: 'CHF',
    CNY: '¥',
    SEK: 'kr',
    NZD: 'NZ$',
  };
  
  const symbol = currencySymbols[currency] || currency;
  return `${symbol}${amount.toFixed(2)}`;
};

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

const calculateItemTotal = (quantity: string, unitPrice: string): number => {
  const qty = parseFloat(quantity) || 0;
  const price = parseFloat(unitPrice) || 0;
  return qty * price;
};

const InvoicePDF = ({ invoiceData }: { invoiceData: InvoiceData }) => {
  const currency = invoiceData.currency || 'USD';
  
  // Calculate totals
  const subtotal = invoiceData.items?.reduce((acc, item) => 
    acc + calculateItemTotal(item.quantity, item.unitPrice), 0) || 0;
  
  // For now, we'll assume no tax. In the future, this could be configurable
  const tax = 0;
  const total = subtotal + tax;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companySection}>
            <Text style={styles.companyTitle}>Your Company</Text>
            <Text style={styles.text}>Your Company Address</Text>
            <Text style={styles.text}>City, State, ZIP</Text>
            <Text style={styles.text}>Email: contact@company.com</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>#{invoiceData.invoiceNumber}</Text>
          </View>
        </View>

        {/* Client and Invoice Details */}
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Bill To</Text>
            <Text style={styles.textBold}>{invoiceData.client.name}</Text>
            <Text style={styles.text}>{invoiceData.client.email}</Text>
            {invoiceData.client.address && (
              <Text style={styles.text}>{invoiceData.client.address}</Text>
            )}
            {invoiceData.client.gstin && (
              <Text style={styles.text}>GSTIN: {invoiceData.client.gstin}</Text>
            )}
          </View>
          
          <View style={styles.columnLast}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Invoice Date:</Text>
              <Text style={styles.totalValue}>{formatDate(invoiceData.invoiceDate)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Due Date:</Text>
              <Text style={styles.totalValue}>{formatDate(invoiceData.dueDate)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Currency:</Text>
              <Text style={styles.totalValue}>{currency}</Text>
            </View>
          </View>
        </View>
        
        {/* Items Table */}
        {invoiceData.items && invoiceData.items.length > 0 && (
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCellHeader, { flex: 3 }]}>Description</Text>
              <Text style={styles.tableCellHeaderRight}>Qty</Text>
              <Text style={styles.tableCellHeaderRight}>Unit Price</Text>
              <Text style={styles.tableCellHeaderRight}>Total</Text>
            </View>
            
            {/* Table Rows */}
            {invoiceData.items.map((item, index) => {
              const itemTotal = calculateItemTotal(item.quantity, item.unitPrice);
              return (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 3 }]}>{item.product}</Text>
                  <Text style={styles.tableCellRight}>{item.quantity}</Text>
                  <Text style={styles.tableCellRight}>{formatCurrency(parseFloat(item.unitPrice) || 0, currency)}</Text>
                  <Text style={styles.tableCellRight}>{formatCurrency(itemTotal, currency)}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Totals Section */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{formatCurrency(subtotal, currency)}</Text>
          </View>
          
          {tax > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax:</Text>
              <Text style={styles.totalValue}>{formatCurrency(tax, currency)}</Text>
            </View>
          )}
          
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total:</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(total, currency)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for your business!
          </Text>
          <Text style={styles.footerText}>
            Generated on {new Date().toLocaleDateString()}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default async (invoiceData: InvoiceData) => {
  return await renderToBuffer(<InvoicePDF invoiceData={invoiceData} />);
};
