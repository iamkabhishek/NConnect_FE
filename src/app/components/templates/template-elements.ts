export type TemplateElementType = 'text' | 'image' | 'button' | 'divider' | 'spacer' | 'columns' | 'logo' | 'signature' | 'social' | 'footer' | 'heading' | 'subheading' | 'quote' | 'list' | 'twocolumn' | 'cta' | 'video' | 'product' | 'announcement' | 'navigation' | 'coupon' | 'greeting' | 'pricing' | 'table';

export interface BaseTemplateElement {
  id: string;
  type: TemplateElementType;
  order: number;
}

// Enhanced Text Element (1, 2, 3)
export interface TextElement extends BaseTemplateElement {
  type: 'text';
  content: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic'; // #1, #3
  textDecoration: 'none' | 'underline'; // #3
  fontFamily: string; // #1
  color: string;
  backgroundColor: string; // #2
  align: 'left' | 'center' | 'right';
  padding: number;
}

// Enhanced Image Element (#4, #9)
export interface ImageElement extends BaseTemplateElement {
  type: 'image';
  url: string;
  alt: string;
  width: number; // percentage
  align: 'left' | 'center' | 'right';
  padding: number;
  backgroundColor: string; // #2
  borderRadius: number; // #4
  link?: string; // #9 - Optional URL for redirection
  mediaId?: string;
}

// Enhanced Button Element (#2, #13)
export interface ButtonElement extends BaseTemplateElement {
  type: 'button';
  text: string;
  url: string;
  backgroundColor: string; // #2
  textColor: string;
  align: 'left' | 'center' | 'right';
  padding: number;
  borderRadius: number;
  buttonWidth: number; // #13 - in pixels, 0 = auto
  buttonHeight: number; // #13 - in pixels, 0 = auto
}

// Enhanced Divider Element (#7)
export interface DividerElement extends BaseTemplateElement {
  type: 'divider';
  color: string;
  thickness: number;
  padding: number;
  style: 'solid' | 'dotted' | 'dashed'; // #7
}

export interface SpacerElement extends BaseTemplateElement {
  type: 'spacer';
  height: number;
}

export interface ColumnsElement extends BaseTemplateElement {
  type: 'columns';
  columnCount: 2;
  columns: {
    elements: TemplateElement[];
  }[];
  padding: number;
}

export interface LogoElement extends BaseTemplateElement {
  type: 'logo';
  url: string;
  alt: string;
  width: number; // in pixels
  align: 'left' | 'center' | 'right';
  padding: number;
  link?: string;
  mediaId?: string;
  circular?: boolean; // Apply circular crop for circular logos
}

export interface SignatureElement extends BaseTemplateElement {
  type: 'signature';
  name: string;
  title: string;
  company: string;
  imageUrl: string;
  imageAlign: 'left' | 'right';
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
  textColor: string;
  backgroundColor: string;
  padding: number;
  mediaId?: string;
}

// Enhanced Social Media Element (#17)
export interface SocialMediaElement extends BaseTemplateElement {
  type: 'social';
  platforms: {
    name: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube';
    url: string;
    enabled: boolean;
  }[];
  iconSize: number;
  iconColor: string; // #17
  align: 'left' | 'center' | 'right';
  padding: number;
}

export interface FooterElement extends BaseTemplateElement {
  type: 'footer';
  companyName: string;
  address: string;
  links: {
    text: string;
    url: string;
  }[];
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
  padding: number;
  showUnsubscribe: boolean;
}

// Enhanced Heading Element (#1, #2, #3)
export interface HeadingElement extends BaseTemplateElement {
  type: 'heading';
  content: string;
  level: 'h1' | 'h2' | 'h3';
  color: string;
  backgroundColor: string; // #2
  fontFamily: string; // #1
  fontStyle: 'normal' | 'italic'; // #3
  textDecoration: 'none' | 'underline'; // #3
  align: 'left' | 'center' | 'right';
  padding: number;
}

// Enhanced Subheading Element (#1, #2, #3)
export interface SubheadingElement extends BaseTemplateElement {
  type: 'subheading';
  content: string;
  color: string;
  backgroundColor: string; // #2
  fontFamily: string; // #1
  fontStyle: 'normal' | 'italic'; // #3
  textDecoration: 'none' | 'underline'; // #3
  align: 'left' | 'center' | 'right';
  padding: number;
}

export interface QuoteElement extends BaseTemplateElement {
  type: 'quote';
  text: string;
  author?: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
  color: string;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  padding: number;
  align: 'left' | 'center' | 'right';
}

// Enhanced List Element (#5, #6)
export interface ListElement extends BaseTemplateElement {
  type: 'list';
  items: string[];
  color: string;
  backgroundColor: string; // #6
  padding: number;
  align: 'left' | 'center' | 'right'; // #5
  bulletStyle: 'disc' | 'circle' | 'square' | 'decimal'; // #6
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
}

// Enhanced Two Column Element (#10, #11)
export interface TwoColumnElement extends BaseTemplateElement {
  type: 'twocolumn';
  leftContent: {
    type: 'text' | 'image' | 'video'; // #10 - Added video
    content?: string;
    url?: string;
    alt?: string;
    width?: number; // #10 - Width adjustment
    height?: number; // #10 - Height adjustment
    // Text properties
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    textDecoration?: 'none' | 'underline';
    textColor?: string;
  };
  rightContent: {
    type: 'text' | 'image' | 'video'; // #10 - Added video
    content?: string;
    url?: string;
    alt?: string;
    width?: number; // #10 - Width adjustment
    height?: number; // #10 - Height adjustment
    // Text properties
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    textDecoration?: 'none' | 'underline';
    textColor?: string;
  };
  padding: number;
  columnGap: number;
  backgroundColor: string; // #11
}

export interface CTAElement extends BaseTemplateElement {
  type: 'cta';
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  padding: number;
  align: 'left' | 'center' | 'right';
  // Title styling
  titleFontSize: number;
  titleFontFamily: string;
  titleFontWeight: 'normal' | 'bold';
  titleFontStyle: 'normal' | 'italic';
  titleTextDecoration: 'none' | 'underline';
  // Description styling
  descriptionFontSize: number;
  descriptionFontFamily: string;
  descriptionFontWeight: 'normal' | 'bold';
  descriptionFontStyle: 'normal' | 'italic';
  descriptionTextDecoration: 'none' | 'underline';
  // Button styling
  buttonFontSize: number;
  buttonFontFamily: string;
  buttonFontWeight: 'normal' | 'bold';
}

export interface VideoElement extends BaseTemplateElement {
  type: 'video';
  url: string; // YouTube or Vimeo embed URL
  thumbnailUrl: string;
  align: 'left' | 'center' | 'right';
  width: number; // percentage
  padding: number;
  mediaId?: string;
}

// Enhanced Product Element (#15)
export interface ProductElement extends BaseTemplateElement {
  type: 'product';
  imageUrl: string;
  name: string;
  description: string;
  price: string; // Kept for backward compatibility
  basePrice: string;
  offerPrice: string;
  showBasePrice: boolean;
  currency: string;
  currencySymbol: string;
  buttonText: string;
  buttonUrl: string;
  buttonColor: string; // #15
  buttonTextColor: string; // #15
  align: 'left' | 'center' | 'right';
  padding: number;
  mediaId?: string;
  // Product name styling
  nameFontSize: number;
  nameFontFamily: string;
  nameFontWeight: 'normal' | 'bold';
  nameFontStyle: 'normal' | 'italic';
  nameTextDecoration: 'none' | 'underline';
  nameColor: string;
  // Description styling
  descriptionFontSize: number;
  descriptionFontFamily: string;
  descriptionFontWeight: 'normal' | 'bold';
  descriptionFontStyle: 'normal' | 'italic';
  descriptionTextDecoration: 'none' | 'underline';
  descriptionColor: string;
  // Price styling
  priceFontSize: number;
  priceFontFamily: string;
  priceFontWeight: 'normal' | 'bold';
  priceColor: string;
  // Button styling
  buttonFontSize: number;
  buttonFontFamily: string;
  buttonFontWeight: 'normal' | 'bold';
}

export interface AnnouncementElement extends BaseTemplateElement {
  type: 'announcement';
  text: string;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
  padding: number;
}

export interface NavigationElement extends BaseTemplateElement {
  type: 'navigation';
  links: {
    text: string;
    url: string;
  }[];
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
  align: 'left' | 'center' | 'right';
  padding: number;
}

export interface CouponElement extends BaseTemplateElement {
  type: 'coupon';
  code: string;
  title: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  codeBackgroundColor: string;
  codeTextColor: string;
  borderColor: string;
  align: 'left' | 'center' | 'right';
  padding: number;
  borderRadius: number;
  // Title styling
  titleFontSize: number;
  titleFontFamily: string;
  titleFontWeight: 'normal' | 'bold';
  titleFontStyle: 'normal' | 'italic';
  titleTextDecoration: 'none' | 'underline';
  // Description styling
  descriptionFontSize: number;
  descriptionFontFamily: string;
  descriptionFontWeight: 'normal' | 'bold';
  descriptionFontStyle: 'normal' | 'italic';
  descriptionTextDecoration: 'none' | 'underline';
  // Code styling
  codeFontSize: number;
  codeFontFamily: string;
  codeFontWeight: 'normal' | 'bold';
}

// NEW: Greeting Element (#8)
export interface GreetingElement extends BaseTemplateElement {
  type: 'greeting';
  template: string; // e.g., "Hello {{first_name}}," or "Dear {{full_name}},"
  fallback: string; // e.g., "Hello there," if no contact data
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  fontFamily: string;
  color: string;
  backgroundColor: string;
  align: 'left' | 'center' | 'right';
  padding: number;
  availableFields: string[]; // Available contact fields: first_name, last_name, full_name, email, company
}

// NEW: Pricing Element (#14)
export interface PricingElement extends BaseTemplateElement {
  type: 'pricing';
  name: string;
  description: string;
  currency: string; // #14 - Currency selection (USD, EUR, GBP, INR, etc.)
  currencySymbol: string; // $, €, £, ₹, etc.
  originalPrice: string; // #14 - Base price with strikethrough
  offerPrice: string; // #14 - Highlighted offer price
  features: string[];
  buttonText: string;
  buttonUrl: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  align: 'left' | 'center' | 'right';
  padding: number;
  showOriginalPrice: boolean; // #14 - Show/hide strikethrough price
  // Name styling
  nameFontSize: number;
  nameFontFamily: string;
  nameFontWeight: 'normal' | 'bold';
  nameFontStyle: 'normal' | 'italic';
  nameTextDecoration: 'none' | 'underline';
  // Description styling
  descriptionFontSize: number;
  descriptionFontFamily: string;
  descriptionFontWeight: 'normal' | 'bold';
  descriptionFontStyle: 'normal' | 'italic';
  descriptionTextDecoration: 'none' | 'underline';
  // Features styling
  featuresFontSize: number;
  featuresFontFamily: string;
  featuresFontWeight: 'normal' | 'bold';
  featuresFontStyle: 'normal' | 'italic';
  featuresTextDecoration: 'none' | 'underline';
}

// NEW: Table Element (#18)
export interface TableElement extends BaseTemplateElement {
  type: 'table';
  headers: string[];
  rows: string[][];
  tableWidth: number; // #18 - percentage
  cellPadding: number;
  headerBackgroundColor: string;
  headerTextColor: string;
  rowBackgroundColor: string;
  rowTextColor: string;
  borderColor: string;
  fontSize: number; // #18 - Text styling
  fontWeight: 'normal' | 'bold'; // #18
  fontFamily: string; // #18
  align: 'left' | 'center' | 'right';
  padding: number;
}

export type TemplateElement =
  | TextElement
  | ImageElement
  | ButtonElement
  | DividerElement
  | SpacerElement
  | ColumnsElement
  | LogoElement
  | SignatureElement
  | SocialMediaElement
  | FooterElement
  | HeadingElement
  | SubheadingElement
  | QuoteElement
  | ListElement
  | TwoColumnElement
  | CTAElement
  | VideoElement
  | ProductElement
  | AnnouncementElement
  | NavigationElement
  | CouponElement
  | GreetingElement
  | PricingElement
  | TableElement;