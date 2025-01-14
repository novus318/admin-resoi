import React from 'react';
import { Download } from 'lucide-react';
import { Document, Page, Text, View, StyleSheet, pdf, Font, Image } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { Button } from '../ui/button';

// Register Roboto font
Font.register({
  family: 'Roboto',
  src: 'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf',
});

// Currency formatting function
const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Date formatting function
const formatDate = (dateString: string) => {
  return {
    dayMonthYear: format(new Date(dateString), 'dd MMM yyyy'),
    day: format(new Date(dateString), 'EEEE'),
  };
};

const DownloadPayslip = ({ payslip, staff }: any) => {
  const handlePayslipClick = async () => {
    try {
      const doc = (
        <Document>
          <Page size="A5" style={styles.page}>
            {/* Header Section with Logo */}
            <View style={styles.header}>
              <Image src="/logo.png" style={styles.logo} />
              <Text style={styles.headerText}>16/745, Main Road, Opp. Ramraj Petrol Pump (Bharat Petroleum)</Text>
              <Text style={styles.headerText}>Perumba Payyannur</Text>
              <Text style={styles.headerText}>Phone: +91 8281930611</Text>
              <View style={styles.separator} />
            </View>

            {/* Employee Details */}
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Employee Name:</Text>
                <Text style={styles.infoValue}>{staff?.name || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Employee ID:</Text>
                <Text style={styles.infoValue}>{staff?.employeeId || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone:</Text>
                <Text style={styles.infoValue}>{staff?.contactInfo?.phone || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Department:</Text>
                <Text style={styles.infoValue}>{staff?.department || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Position:</Text>
                <Text style={styles.infoValue}>{staff?.position || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.separator} />

            {/* Payslip Information */}
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Join Date:</Text>
                <Text style={styles.infoValue}>{staff?.joinDate ? formatDate(staff.joinDate).dayMonthYear : 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Payment Date:</Text>
                <Text style={styles.infoValue}>
                  {payslip?.paymentDate
                    ? format(new Date(payslip.paymentDate), 'dd MMM yyyy')
                    : 'N/A'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status:</Text>
                <Text style={styles.infoValue}>{payslip?.status || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.separator} />

            {/* Net Pay Highlighted */}
            <View style={styles.totalSection}>
              <Text style={styles.totalText}>Net Pay: {formatCurrency(payslip?.amount || 0)}</Text>
            </View>

            <View style={styles.separator} />

            {/* Footer Section */}
            <View style={styles.footer}>
              <Text style={styles.regards}>Regards,</Text>
              <Text style={styles.signature}>Malabar Resoi</Text>
            </View>
          </Page>
        </Document>
      );

      // Generate PDF and save it
      const blob = await pdf(doc).toBlob();
      saveAs(
        blob,
        `Payslip-${staff?.employeeId || 'Unknown'}-${format(
          new Date(payslip?.salaryPeriod?.startDate || new Date()),
          'MMM yyyy'
        )}.pdf`
      );
    } catch (error) {
      console.error('Error generating payslip:', error);
      alert('Failed to generate payslip. Please try again.');
    }
  };

  // Styles for the PDF
  const styles = StyleSheet.create({
    page: {
      padding: 10,
      fontFamily: 'Roboto',
      fontSize: 12,
      lineHeight: 1.5,
      backgroundColor: '#F3F4F6',
    },
    header: {
      textAlign: 'center',
      marginBottom: 8,
    },
    headerText: {
      fontSize: 10,
      marginBottom: 2,
      color: '#4B5563',
    },
    logo: {
      height: 50,
      alignSelf: 'center',
    },
    separator: {
      borderBottom: '1px solid #D1D5DB',
      marginVertical: 8,
    },
    infoSection: {
      marginVertical: 8,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    infoLabel: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#4B5563',
    },
    infoValue: {
      fontSize: 10,
      color: '#111827',
    },
    totalSection: {
      textAlign: 'right',
      padding: 8,
    },
    totalText: {
      fontSize: 11,
      fontWeight: 'bold',
      color: '#111827',
    },
    footer: {
      marginTop: 15,
      fontSize: 10,
    },
    regards: {
      marginBottom: 4,
    },
    signature: {
      fontWeight: 'bold',
      fontSize: 10,
      color: '#4B5563',
    },
  });

  return (
    <Button onClick={handlePayslipClick} size="sm">
      <Download className="h-4" />
      Download
    </Button>
  );
};

export default DownloadPayslip;