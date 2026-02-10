      margin: 1,
      color: {
        dark: '#11885a',
        light: '#ffffff',
      },
    });
    
    const qrCodeImageBytes = Buffer.from(qrCodeDataURL.split(',')[1], 'base64');
    const qrCodeImage = await pdfDoc.embedPng(qrCodeImageBytes);
    
    page.drawImage(qrCodeImage, {
      x: (width - 80) / 2,
      y: sigY + 10,
      width: 80,
      height: 80,
    });

    const scanText = 'Scan to Verify';
    const scanWidth = helveticaFont.widthOfTextAtSize(scanText, 8);
    page.drawText(scanText, {
      x: (width - scanWidth) / 2,
      y: sigY,
      size: 8,
      font: helveticaFont,
      color: COLORS.lightGray,
    });

    // Right: Authorized By
    page.drawText('Authorized By', {
      x: width - 180,
      y: sigY + 50,
      size: 10,
      font: helveticaFont,
      color: COLORS.lightGray,
    });

    page.drawText('CEASAI Board', {
      x: width - 180,
      y: sigY + 35,
      size: 12,
      font: helveticaBoldFont,
      color: COLORS.dark,
    });

    page.drawLine({
      start: { x: width - 200, y: sigY + 25 },
      end: { x: width - 60, y: sigY + 25 },
      thickness: 1,
      color: COLORS.veryLightGray,
    });

    page.drawText('Training & Certification Authority', {
      x: width - 200,
      y: sigY + 12,
      size: 8,
      font: helveticaFont,
      color: COLORS.lightGray,
    });

    // ===== FOOTER =====
    // Certificate ID
    const certIdText = `Certificate ID: ${data.certificateId}`;
    const certIdWidth = helveticaFont.widthOfTextAtSize(certIdText, 9);
    page.drawText(certIdText, {
      x: (width - certIdWidth) / 2,
      y: 55,
      size: 9,
      font: helveticaFont,
      color: COLORS.lightGray,
    });

    // Verification URL
    const verifyText = `Verify at: ${data.verificationUrl}`;
    const verifyWidth = helveticaFont.widthOfTextAtSize(verifyText, 8);
    page.drawText(verifyText, {
      x: (width - verifyWidth) / 2,
      y: 42,
      size: 8,
      font: helveticaFont,
      color: COLORS.primary,
    });

    // Legal text
    const legalText = 'This certificate is issued by CEASAI in partnership with CSOAI. The holder has demonstrated competency in AI safety frameworks. Valid for 1 year.';
    const legalWidth = helveticaFont.widthOfTextAtSize(legalText, 6);
    page.drawText(legalText, {
      x: (width - Math.min(legalWidth, width - 100)) / 2,
      y: 30,
      size: 6,
      font: helveticaFont,
      color: rgb(0.667, 0.667, 0.667),
      maxWidth: width - 100,
    });

    // ===== METADATA =====
    pdfDoc.setTitle(`CEASAI Certificate - ${data.studentName}`);
    pdfDoc.setSubject(`Certificate of Professional Achievement for ${data.courseName}`);
    pdfDoc.setAuthor('CEASAI - Certified Enterprise AI Safety Institute');
    pdfDoc.setCreator('CSOAI Platform');
    pdfDoc.setProducer('CEASAI Certificate Generator V2');
    pdfDoc.setKeywords(['AI Safety', 'Certification', 'CEASAI', 'CSOAI', data.framework]);
    pdfDoc.setCreationDate(new Date());

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);