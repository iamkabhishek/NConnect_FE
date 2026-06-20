import { TemplateElement, TemplateElementType } from './template-elements';

export function createDefaultElement(type: TemplateElementType): TemplateElement {
  const id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const order = 0;

  switch (type) {
    case 'heading':
      return {
        id,
        type: 'heading',
        order,
        content: 'Your Heading Here',
        level: 'h1',
        color: '#111827',
        backgroundColor: 'transparent',
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'normal',
        textDecoration: 'none',
        align: 'left',
        padding: 20,
      };

    case 'subheading':
      return {
        id,
        type: 'subheading',
        order,
        content: 'Your subheading text',
        color: '#6b7280',
        backgroundColor: 'transparent',
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'normal',
        textDecoration: 'none',
        align: 'left',
        padding: 15,
      };

    case 'text':
      return {
        id,
        type: 'text',
        order,
        content: 'Enter your text here...',
        fontSize: 16,
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        fontFamily: 'Arial, sans-serif',
        color: '#333333',
        backgroundColor: 'transparent',
        align: 'left',
        padding: 20,
      };

    case 'quote':
      return {
        id,
        type: 'quote',
        order,
        text: 'This is an inspiring quote that adds credibility to your newsletter.',
        author: '— John Doe',
        fontSize: 18,
        fontFamily: 'Georgia, serif',
        fontWeight: 'normal',
        fontStyle: 'italic',
        textDecoration: 'none',
        color: '#374151',
        backgroundColor: '#f9fafb',
        borderColor: '#4A90E2',
        borderWidth: 3,
        padding: 24,
        align: 'left',
      };

    case 'list':
      return {
        id,
        type: 'list',
        order,
        items: ['First item', 'Second item', 'Third item'],
        color: '#333333',
        backgroundColor: 'transparent',
        padding: 20,
        align: 'left',
        bulletStyle: 'disc',
        fontSize: 16,
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
      };

    case 'twocolumn':
      return {
        id,
        type: 'twocolumn',
        order,
        leftContent: {
          type: 'text',
          content: 'Left column content goes here. Add text or images.',
          fontSize: 16,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'normal',
          fontStyle: 'normal',
          textDecoration: 'none',
          textColor: '#333333',
        },
        rightContent: {
          type: 'text',
          content: 'Right column content goes here. Add text or images.',
          fontSize: 16,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'normal',
          fontStyle: 'normal',
          textDecoration: 'none',
          textColor: '#333333',
        },
        padding: 20,
        columnGap: 20,
        backgroundColor: 'transparent',
      };

    case 'cta':
      return {
        id,
        type: 'cta',
        order,
        title: 'Don\'t Miss Out!',
        description: 'Join thousands of subscribers who are already benefiting from our content.',
        buttonText: 'Get Started Now',
        buttonUrl: '#',
        backgroundColor: '#4A90E2',
        textColor: '#ffffff',
        buttonColor: '#1e40af',
        buttonTextColor: '#ffffff',
        padding: 32,
        align: 'center',
        // Title styling
        titleFontSize: 24,
        titleFontFamily: 'Arial, sans-serif',
        titleFontWeight: 'bold',
        titleFontStyle: 'normal',
        titleTextDecoration: 'none',
        // Description styling
        descriptionFontSize: 16,
        descriptionFontFamily: 'Arial, sans-serif',
        descriptionFontWeight: 'normal',
        descriptionFontStyle: 'normal',
        descriptionTextDecoration: 'none',
        // Button styling
        buttonFontSize: 16,
        buttonFontFamily: 'Arial, sans-serif',
        buttonFontWeight: 'bold',
      };

    case 'video':
      return {
        id,
        type: 'video',
        order,
        url: '',
        thumbnailUrl: '',
        align: 'center',
        width: 100,
        padding: 20,
      };

    case 'product':
      return {
        id,
        type: 'product',
        order,
        imageUrl: '',
        name: 'Product Name',
        description: 'Product description and key features that make it amazing.',
        price: '$99.00', // Kept for backward compatibility
        basePrice: '149.00',
        offerPrice: '99.00',
        showBasePrice: true,
        currency: 'USD',
        currencySymbol: '$',
        buttonText: 'Buy Now',
        buttonUrl: '#',
        buttonColor: '#4A90E2',
        buttonTextColor: '#ffffff',
        align: 'center',
        padding: 20,
        // Product name styling
        nameFontSize: 20,
        nameFontFamily: 'Arial, sans-serif',
        nameFontWeight: 'bold',
        nameFontStyle: 'normal',
        nameTextDecoration: 'none',
        nameColor: '#111827',
        // Description styling
        descriptionFontSize: 14,
        descriptionFontFamily: 'Arial, sans-serif',
        descriptionFontWeight: 'normal',
        descriptionFontStyle: 'normal',
        descriptionTextDecoration: 'none',
        descriptionColor: '#6b7280',
        // Price styling
        priceFontSize: 24,
        priceFontFamily: 'Arial, sans-serif',
        priceFontWeight: 'bold',
        priceColor: '#4A90E2',
        // Button styling
        buttonFontSize: 16,
        buttonFontFamily: 'Arial, sans-serif',
        buttonFontWeight: 'bold',
      };

    case 'announcement':
      return {
        id,
        type: 'announcement',
        order,
        text: '🎉 Special Announcement: Limited Time Offer!',
        backgroundColor: '#fef3c7',
        textColor: '#92400e',
        fontSize: 14,
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        padding: 12,
      };

    case 'navigation':
      return {
        id,
        type: 'navigation',
        order,
        links: [
          { text: 'Home', url: '#' },
          { text: 'About', url: '#' },
          { text: 'Services', url: '#' },
          { text: 'Contact', url: '#' },
        ],
        backgroundColor: '#ffffff',
        textColor: '#4A90E2',
        fontSize: 14,
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        align: 'center',
        padding: 15,
      };

    case 'logo':
      return {
        id,
        type: 'logo',
        order,
        url: '',
        alt: 'Company Logo',
        width: 150,
        align: 'center',
        padding: 20,
        link: '',
        circular: false,
      };

    case 'signature':
      return {
        id,
        type: 'signature',
        order,
        name: 'John Doe',
        title: 'Marketing Manager',
        company: 'NConnect',
        imageUrl: '',
        imageAlign: 'left',
        fontSize: 14,
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        textColor: '#333333',
        backgroundColor: '#ffffff',
        padding: 20,
      };

    case 'social':
      return {
        id,
        type: 'social',
        order,
        platforms: [
          { name: 'facebook', url: 'https://facebook.com', enabled: true },
          { name: 'twitter', url: 'https://twitter.com', enabled: true },
          { name: 'instagram', url: 'https://instagram.com', enabled: true },
          { name: 'linkedin', url: 'https://linkedin.com', enabled: false },
          { name: 'youtube', url: 'https://youtube.com', enabled: false },
        ],
        iconSize: 36,
        iconColor: '#4A90E2',
        align: 'center',
        padding: 20,
      };

    case 'footer':
      return {
        id,
        type: 'footer',
        order,
        companyName: 'NConnect',
        address: '123 Main Street, City, State 12345',
        links: [
          { text: 'Privacy Policy', url: '#' },
          { text: 'Terms of Service', url: '#' },
          { text: 'Contact Us', url: '#' },
        ],
        backgroundColor: '#f3f4f6',
        textColor: '#6b7280',
        fontSize: 12,
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        padding: 30,
        showUnsubscribe: true,
      };

    case 'image':
      return {
        id,
        type: 'image',
        order,
        url: '',
        alt: '',
        width: 100,
        align: 'center',
        padding: 20,
        backgroundColor: 'transparent',
        borderRadius: 0,
        link: '',
      };

    case 'button':
      return {
        id,
        type: 'button',
        order,
        text: 'Click Here',
        url: 'https://example.com',
        backgroundColor: '#4A90E2',
        textColor: '#ffffff',
        align: 'center',
        padding: 20,
        borderRadius: 4,
        buttonWidth: 0, // 0 = auto
        buttonHeight: 0, // 0 = auto
      };

    case 'divider':
      return {
        id,
        type: 'divider',
        order,
        color: '#e5e7eb',
        thickness: 1,
        padding: 20,
        style: 'solid',
      };

    case 'spacer':
      return {
        id,
        type: 'spacer',
        order,
        height: 40,
      };

    case 'columns':
      return {
        id,
        type: 'columns',
        order,
        columnCount: 2,
        columns: [{ elements: [] }, { elements: [] }],
        padding: 20,
      };

    case 'coupon':
      return {
        id,
        type: 'coupon',
        order,
        code: 'SAVE20',
        title: 'Special Offer',
        description: 'Use this code to get 20% off your next purchase',
        backgroundColor: '#f0f9ff',
        textColor: '#1e40af',
        codeBackgroundColor: '#4A90E2',
        codeTextColor: '#ffffff',
        borderColor: '#4A90E2',
        align: 'center',
        padding: 30,
        borderRadius: 8,
        // Title styling
        titleFontSize: 24,
        titleFontFamily: 'Arial, sans-serif',
        titleFontWeight: 'bold',
        titleFontStyle: 'normal',
        titleTextDecoration: 'none',
        // Description styling
        descriptionFontSize: 14,
        descriptionFontFamily: 'Arial, sans-serif',
        descriptionFontWeight: 'normal',
        descriptionFontStyle: 'normal',
        descriptionTextDecoration: 'none',
        // Code styling
        codeFontSize: 20,
        codeFontFamily: 'monospace',
        codeFontWeight: 'bold',
      };

    case 'greeting':
      return {
        id,
        type: 'greeting',
        order,
        template: 'Hello {{first_name}},',
        fallback: 'Hello there,',
        fontSize: 18,
        fontWeight: 'normal',
        fontStyle: 'normal',
        fontFamily: 'Arial, sans-serif',
        color: '#111827',
        backgroundColor: 'transparent',
        align: 'left',
        padding: 20,
        availableFields: ['first_name', 'last_name', 'full_name', 'email', 'company'],
      };

    case 'pricing':
      return {
        id,
        type: 'pricing',
        order,
        name: 'Premium Plan',
        description: 'Perfect for growing businesses',
        currency: 'USD',
        currencySymbol: '$',
        originalPrice: '99.00',
        offerPrice: '49.00',
        features: [
          'Unlimited Contacts',
          'Advanced Analytics',
          'Priority Support',
          '10 Team Members',
        ],
        buttonText: 'Get Started',
        buttonUrl: '#',
        backgroundColor: '#ffffff',
        textColor: '#111827',
        buttonColor: '#4A90E2',
        buttonTextColor: '#ffffff',
        align: 'center',
        padding: 30,
        showOriginalPrice: true,
        // Name styling
        nameFontSize: 28,
        nameFontFamily: 'Arial, sans-serif',
        nameFontWeight: 'bold',
        nameFontStyle: 'normal',
        nameTextDecoration: 'none',
        // Description styling
        descriptionFontSize: 14,
        descriptionFontFamily: 'Arial, sans-serif',
        descriptionFontWeight: 'normal',
        descriptionFontStyle: 'normal',
        descriptionTextDecoration: 'none',
        // Features styling
        featuresFontSize: 14,
        featuresFontFamily: 'Arial, sans-serif',
        featuresFontWeight: 'normal',
        featuresFontStyle: 'normal',
        featuresTextDecoration: 'none',
      };

    case 'table':
      return {
        id,
        type: 'table',
        order,
        headers: ['Column 1', 'Column 2', 'Column 3'],
        rows: [
          ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
          ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3'],
          ['Row 3 Col 1', 'Row 3 Col 2', 'Row 3 Col 3'],
        ],
        tableWidth: 100,
        cellPadding: 12,
        headerBackgroundColor: '#4A90E2',
        headerTextColor: '#ffffff',
        rowBackgroundColor: '#ffffff',
        rowTextColor: '#111827',
        borderColor: '#e5e7eb',
        fontSize: 14,
        fontWeight: 'normal',
        fontFamily: 'Arial, sans-serif',
        align: 'center',
        padding: 20,
      };

    default:
      throw new Error(`Unknown element type: ${type}`);
  }
}