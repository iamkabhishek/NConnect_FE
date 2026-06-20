import { TemplateElement } from './template-elements';
import {
  Type,
  ImageIcon,
  Square,
  FileImage,
  PenTool,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Play,
  ShoppingBag,
  List as ListIcon,
  DollarSign,
  Check,
  Hand,
} from 'lucide-react';

const socialIcons = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
};

export function renderTemplateElement(element: TemplateElement): JSX.Element {
  switch (element.type) {
    case 'heading':
      const headingSizes = { h1: '32px', h2: '28px', h3: '24px' };
      const headingWeights = { h1: '700', h2: '600', h3: '600' };
      return (
        <div style={{ padding: `${element.padding}px`, textAlign: element.align, backgroundColor: element.backgroundColor }}>
          <div
            style={{
              fontSize: headingSizes[element.level],
              fontWeight: headingWeights[element.level],
              color: element.color,
              fontFamily: element.fontFamily,
              fontStyle: element.fontStyle,
              textDecoration: element.textDecoration,
              lineHeight: '1.2',
            }}
          >
            {element.content || 'Your Heading Here'}
          </div>
        </div>
      );

    case 'subheading':
      return (
        <div style={{ padding: `${element.padding}px`, textAlign: element.align, backgroundColor: element.backgroundColor }}>
          <div
            style={{
              fontSize: `${element.fontSize}px`,
              fontWeight: '400',
              color: element.color,
              fontFamily: element.fontFamily,
              fontStyle: element.fontStyle,
              textDecoration: element.textDecoration,
              lineHeight: '1.5',
            }}
          >
            {element.content || 'Your subheading text'}
          </div>
        </div>
      );

    case 'quote':
      return (
        <div
          style={{
            padding: `${element.padding}px`,
            backgroundColor: element.backgroundColor,
            borderLeft: `${element.borderWidth}px solid ${element.borderColor}`,
            margin: '20px 0',
            textAlign: element.align,
          }}
        >
          <p
            style={{
              fontSize: `${element.fontSize}px`,
              fontFamily: element.fontFamily,
              fontWeight: element.fontWeight,
              fontStyle: element.fontStyle,
              textDecoration: element.textDecoration,
              color: element.color,
              margin: '0 0 10px 0',
              lineHeight: '1.6',
            }}
          >
            "{element.text}"
          </p>
          {element.author && (
            <p
              style={{
                fontSize: `${element.fontSize * 0.85}px`,
                fontFamily: element.fontFamily,
                color: element.color,
                opacity: 0.8,
                margin: 0,
              }}
            >
              {element.author}
            </p>
          )}
        </div>
      );

    case 'list':
      const ListTag = element.bulletStyle === 'decimal' ? 'ol' : 'ul';
      return (
        <div style={{ padding: `${element.padding}px`, backgroundColor: element.backgroundColor, textAlign: element.align }}>
          <ListTag 
            style={{ 
              margin: 0, 
              paddingLeft: '24px', 
              color: element.color,
              listStyleType: element.bulletStyle,
              display: 'inline-block',
              textAlign: 'left',
              fontSize: `${element.fontSize}px`,
              fontFamily: element.fontFamily,
              fontWeight: element.fontWeight,
            }}
          >
            {element.items.map((item, idx) => (
              <li 
                key={idx} 
                style={{ 
                  marginBottom: '8px', 
                  lineHeight: '1.5',
                  fontStyle: element.fontStyle,
                  textDecoration: element.textDecoration,
                }}
              >
                {item}
              </li>
            ))}
          </ListTag>
        </div>
      );

    case 'twocolumn':
      const renderColumnContent = (content: typeof element.leftContent, side: string) => {
        if (content.type === 'video' && content.url) {
          return (
            <div
              style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                overflow: 'hidden',
                backgroundColor: '#000',
                borderRadius: '8px',
                width: content.width ? `${content.width}%` : '100%',
                maxHeight: content.height ? `${content.height}px` : 'auto',
              }}
            >
              <iframe
                src={content.url}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                allowFullScreen
              />
            </div>
          );
        } else if (content.type === 'image' && content.url) {
          return (
            <img
              src={content.url}
              alt={content.alt || ''}
              style={{ 
                width: content.width ? `${content.width}%` : '100%', 
                height: content.height ? `${content.height}px` : 'auto',
                borderRadius: '4px',
                objectFit: 'cover',
              }}
            />
          );
        } else if (content.type === 'image') {
          return (
            <div
              className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
              style={{ minHeight: '150px' }}
            >
              <div className="text-center p-4">
                <ImageIcon className="size-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">No {side} image</p>
              </div>
            </div>
          );
        } else if (content.type === 'video') {
          return (
            <div
              className="bg-gray-900 rounded-lg flex items-center justify-center"
              style={{ minHeight: '150px' }}
            >
              <div className="text-center">
                <Play className="size-12 text-white opacity-50 mx-auto mb-2" />
                <p className="text-white text-xs">No {side} video</p>
              </div>
            </div>
          );
        } else {
          return (
            <p
              style={{
                fontSize: `${content.fontSize || 16}px`,
                fontFamily: content.fontFamily || 'Arial, sans-serif',
                fontWeight: content.fontWeight || 'normal',
                fontStyle: content.fontStyle || 'normal',
                textDecoration: content.textDecoration || 'none',
                color: content.textColor || '#333',
                lineHeight: '1.6',
              }}
            >
              {content.content || `${side} column content`}
            </p>
          );
        }
      };

      return (
        <div
          style={{
            padding: `${element.padding}px`,
            display: 'flex',
            gap: `${element.columnGap}px`,
            backgroundColor: element.backgroundColor,
          }}
        >
          <div style={{ flex: 1 }}>
            {renderColumnContent(element.leftContent, 'Left')}
          </div>
          <div style={{ flex: 1 }}>
            {renderColumnContent(element.rightContent, 'Right')}
          </div>
        </div>
      );

    case 'cta':
      return (
        <div
          style={{
            padding: `${element.padding}px`,
            backgroundColor: element.backgroundColor,
            textAlign: element.align,
            borderRadius: '8px',
          }}
        >
          <h3
            style={{
              fontSize: `${element.titleFontSize || 24}px`,
              fontFamily: element.titleFontFamily || 'Arial, sans-serif',
              fontWeight: element.titleFontWeight || 'bold',
              fontStyle: element.titleFontStyle || 'normal',
              textDecoration: element.titleTextDecoration || 'none',
              color: element.textColor,
              margin: '0 0 12px 0',
            }}
          >
            {element.title}
          </h3>
          <p
            style={{
              fontSize: `${element.descriptionFontSize || 16}px`,
              fontFamily: element.descriptionFontFamily || 'Arial, sans-serif',
              fontWeight: element.descriptionFontWeight || 'normal',
              fontStyle: element.descriptionFontStyle || 'normal',
              textDecoration: element.descriptionTextDecoration || 'none',
              color: element.textColor,
              margin: '0 0 20px 0',
              opacity: 0.9,
            }}
          >
            {element.description}
          </p>
          <a
            href={element.buttonUrl || '#'}
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              backgroundColor: element.buttonColor,
              color: element.buttonTextColor,
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: `${element.buttonFontSize || 16}px`,
              fontFamily: element.buttonFontFamily || 'Arial, sans-serif',
              fontWeight: element.buttonFontWeight || 'bold',
            }}
          >
            {element.buttonText}
          </a>
        </div>
      );

    case 'video':
      return (
        <div
          style={{
            padding: `${element.padding}px`,
            textAlign: element.align,
          }}
        >
          {element.url ? (
            <div
              style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                overflow: 'hidden',
                maxWidth: `${element.width}%`,
                margin: element.align === 'center' ? '0 auto' : element.align === 'right' ? '0 0 0 auto' : '0',
                backgroundColor: '#000',
                borderRadius: '8px',
              }}
            >
              <iframe
                src={element.url}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                allowFullScreen
              />
            </div>
          ) : (
            <div
              className="bg-gray-900 rounded-lg flex items-center justify-center"
              style={{
                minHeight: '200px',
                maxWidth: `${element.width}%`,
                margin: element.align === 'center' ? '0 auto' : element.align === 'right' ? '0 0 0 auto' : '0',
              }}
            >
              <div className="text-center">
                <Play className="size-16 text-white opacity-50 mx-auto mb-3" />
                <p className="text-white text-sm">No video URL provided</p>
              </div>
            </div>
          )}
        </div>
      );

    case 'product':
      return (
        <div
          style={{
            padding: `${element.padding}px`,
            textAlign: element.align,
          }}
        >
          <div
            style={{
              maxWidth: '400px',
              margin: element.align === 'center' ? '0 auto' : element.align === 'right' ? '0 0 0 auto' : '0',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            {element.imageUrl ? (
              <img
                src={element.imageUrl}
                alt={element.name}
                style={{ width: '100%', height: '250px', objectFit: 'cover' }}
              />
            ) : (
              <div
                className="bg-gray-100 flex items-center justify-center"
                style={{ width: '100%', height: '250px' }}
              >
                <ShoppingBag className="size-16 text-gray-400" />
              </div>
            )}
            <div style={{ padding: '20px' }}>
              <h3
                style={{
                  fontSize: `${element.nameFontSize || 20}px`,
                  fontFamily: element.nameFontFamily || 'Arial, sans-serif',
                  fontWeight: element.nameFontWeight || 'bold',
                  fontStyle: element.nameFontStyle || 'normal',
                  textDecoration: element.nameTextDecoration || 'none',
                  color: element.nameColor || '#111827',
                  margin: '0 0 8px 0',
                }}
              >
                {element.name}
              </h3>
              <p
                style={{
                  fontSize: `${element.descriptionFontSize || 14}px`,
                  fontFamily: element.descriptionFontFamily || 'Arial, sans-serif',
                  fontWeight: element.descriptionFontWeight || 'normal',
                  fontStyle: element.descriptionFontStyle || 'normal',
                  textDecoration: element.descriptionTextDecoration || 'none',
                  color: element.descriptionColor || '#6b7280',
                  margin: '0 0 12px 0',
                  lineHeight: '1.5',
                }}
              >
                {element.description}
              </p>
              <div style={{ margin: '0 0 16px 0' }}>
                {element.showBasePrice && element.basePrice && (
                  <p
                    style={{
                      fontSize: `${(element.priceFontSize || 24) * 0.7}px`,
                      fontFamily: element.priceFontFamily || 'Arial, sans-serif',
                      fontWeight: element.priceFontWeight || 'bold',
                      color: element.priceColor || '#4A90E2',
                      textDecoration: 'line-through',
                      opacity: 0.6,
                      margin: '0 0 4px 0',
                    }}
                  >
                    {element.currencySymbol || '$'}{element.basePrice}
                  </p>
                )}
                <p
                  style={{
                    fontSize: `${element.priceFontSize || 24}px`,
                    fontFamily: element.priceFontFamily || 'Arial, sans-serif',
                    fontWeight: element.priceFontWeight || 'bold',
                    color: element.priceColor || '#4A90E2',
                    margin: 0,
                  }}
                >
                  {element.currencySymbol || '$'}{element.offerPrice || element.price?.replace(/[^\d.]/g, '') || '99.00'}
                </p>
              </div>
              <a
                href={element.buttonUrl || '#'}
                style={{
                  display: 'block',
                  padding: '12px 24px',
                  backgroundColor: element.buttonColor,
                  color: element.buttonTextColor,
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: `${element.buttonFontSize || 16}px`,
                  fontFamily: element.buttonFontFamily || 'Arial, sans-serif',
                  fontWeight: element.buttonFontWeight || 'bold',
                  textAlign: 'center',
                }}
              >
                {element.buttonText}
              </a>
            </div>
          </div>
        </div>
      );

    case 'announcement':
      return (
        <div
          style={{
            padding: `${element.padding}px`,
            backgroundColor: element.backgroundColor,
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: `${element.fontSize}px`,
              fontFamily: element.fontFamily || 'Arial, sans-serif',
              fontWeight: element.fontWeight || 'normal',
              fontStyle: element.fontStyle || 'normal',
              textDecoration: element.textDecoration || 'none',
              color: element.textColor,
              margin: 0,
            }}
          >
            {element.text}
          </p>
        </div>
      );

    case 'navigation':
      return (
        <div
          style={{
            padding: `${element.padding}px`,
            backgroundColor: element.backgroundColor,
            textAlign: element.align,
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '24px',
              justifyContent: element.align === 'center' ? 'center' : element.align === 'right' ? 'flex-end' : 'flex-start',
              flexWrap: 'wrap',
            }}
          >
            {element.links.map((link, idx) => (
              <a
                key={idx}
                href={link.url || '#'}
                style={{
                  fontSize: `${element.fontSize || 14}px`,
                  fontFamily: element.fontFamily || 'Arial, sans-serif',
                  fontWeight: element.fontWeight || 'normal',
                  fontStyle: element.fontStyle || 'normal',
                  textDecoration: element.textDecoration || 'none',
                  color: element.textColor,
                }}
              >
                {link.text}
              </a>
            ))}
          </div>
        </div>
      );

    case 'text':
      return (
        <div
          style={{
            fontSize: `${element.fontSize}px`,
            fontWeight: element.fontWeight,
            fontFamily: element.fontFamily,
            fontStyle: element.fontStyle,
            textDecoration: element.textDecoration,
            color: element.color,
            backgroundColor: element.backgroundColor,
            textAlign: element.align,
            padding: `${element.padding}px`,
            lineHeight: '1.6',
          }}
        >
          {element.content || 'Enter your text here...'}
        </div>
      );

    case 'logo':
      const logoImageStyle = {
        width: `${element.width}px`,
        height: element.circular ? `${element.width}px` : 'auto',
        display: 'inline-block',
        borderRadius: element.circular ? '50%' : '0',
        objectFit: element.circular ? ('cover' as const) : ('none' as const),
      };
      
      return (
        <div
          style={{
            textAlign: element.align,
            padding: `${element.padding}px`,
          }}
        >
          {element.url ? (
            element.link ? (
              <a href={element.link} target="_blank" rel="noopener noreferrer">
                <img
                  src={element.url}
                  alt={element.alt}
                  style={logoImageStyle}
                />
              </a>
            ) : (
              <img
                src={element.url}
                alt={element.alt}
                style={logoImageStyle}
              />
            )
          ) : (
            <div
              className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
              style={{
                width: `${element.width}px`,
                minHeight: '80px',
                display: 'inline-block',
              }}
            >
              <div className="text-center p-4">
                <FileImage className="size-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">No logo</p>
              </div>
            </div>
          )}
        </div>
      );

    case 'signature':
      return (
        <div 
          style={{ 
            padding: `${element.padding}px`,
            backgroundColor: element.backgroundColor,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              flexDirection: element.imageAlign === 'left' ? 'row' : 'row-reverse',
            }}
          >
            {element.imageUrl ? (
              <img
                src={element.imageUrl}
                alt={element.name}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: '#e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PenTool className="size-6 text-gray-400" />
              </div>
            )}
            <div>
              <div 
                style={{ 
                  fontSize: `${element.fontSize || 14}px`, 
                  fontFamily: element.fontFamily || 'Arial, sans-serif',
                  fontWeight: element.fontWeight || 'normal',
                  fontStyle: element.fontStyle || 'normal',
                  textDecoration: element.textDecoration || 'none',
                  color: element.textColor || '#111827', 
                  marginBottom: '4px' 
                }}
              >
                {element.name || 'Your Name'}
              </div>
              <div 
                style={{ 
                  fontSize: `${(element.fontSize || 14) * 0.9}px`, 
                  fontFamily: element.fontFamily || 'Arial, sans-serif',
                  fontWeight: element.fontWeight || 'normal',
                  fontStyle: element.fontStyle || 'normal',
                  textDecoration: element.textDecoration || 'none',
                  color: element.textColor || '#6b7280', 
                  marginBottom: '2px',
                  opacity: 0.8,
                }}
              >
                {element.title || 'Your Title'}
              </div>
              <div 
                style={{ 
                  fontSize: `${(element.fontSize || 14) * 0.9}px`, 
                  fontFamily: element.fontFamily || 'Arial, sans-serif',
                  fontWeight: element.fontWeight || 'normal',
                  fontStyle: element.fontStyle || 'normal',
                  textDecoration: element.textDecoration || 'none',
                  color: element.textColor || '#9ca3af',
                  opacity: 0.7,
                }}
              >
                {element.company || 'Company Name'}
              </div>
            </div>
          </div>
        </div>
      );

    case 'social':
      return (
        <div
          style={{
            textAlign: element.align,
            padding: `${element.padding}px`,
          }}
        >
          <div style={{ display: 'flex', gap: '12px', justifyContent: element.align === 'center' ? 'center' : element.align === 'right' ? 'flex-end' : 'flex-start' }}>
            {element.platforms.filter(p => p.enabled).map((platform) => {
              const Icon = socialIcons[platform.name];
              return (
                <a
                  key={platform.name}
                  href={platform.url || '#'}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: `${element.iconSize}px`,
                    height: `${element.iconSize}px`,
                    borderRadius: '50%',
                    backgroundColor: element.iconColor,
                    color: '#ffffff',
                  }}
                >
                  <Icon style={{ width: `${element.iconSize * 0.5}px`, height: `${element.iconSize * 0.5}px` }} />
                </a>
              );
            })}
          </div>
        </div>
      );

    case 'footer':
      return (
        <div
          style={{
            backgroundColor: element.backgroundColor,
            color: element.textColor,
            padding: `${element.padding}px`,
            textAlign: 'center',
          }}
        >
          <div 
            style={{ 
              fontSize: `${element.fontSize || 12}px`, 
              fontFamily: element.fontFamily || 'Arial, sans-serif',
              fontWeight: element.fontWeight || 'normal',
              fontStyle: element.fontStyle || 'normal',
              textDecoration: element.textDecoration || 'none',
              marginBottom: '8px' 
            }}
          >
            {element.companyName || 'Company Name'}
          </div>
          <div 
            style={{ 
              fontSize: `${(element.fontSize || 12) * 0.9}px`, 
              fontFamily: element.fontFamily || 'Arial, sans-serif',
              fontWeight: element.fontWeight || 'normal',
              fontStyle: element.fontStyle || 'normal',
              textDecoration: element.textDecoration || 'none',
              marginBottom: '12px', 
              opacity: 0.8 
            }}
          >
            {element.address || 'Company Address'}
          </div>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '12px' }}>
            {element.links.map((link, idx) => (
              <a
                key={idx}
                href={link.url || '#'}
                style={{
                  fontSize: `${(element.fontSize || 12) * 0.9}px`,
                  fontFamily: element.fontFamily || 'Arial, sans-serif',
                  fontWeight: element.fontWeight || 'normal',
                  fontStyle: element.fontStyle || 'normal',
                  textDecoration: element.textDecoration || 'none',
                  color: element.textColor,
                }}
              >
                {link.text}
              </a>
            ))}
          </div>
          {element.showUnsubscribe && (
            <div 
              style={{ 
                fontSize: `${(element.fontSize || 12) * 0.85}px`, 
                fontFamily: element.fontFamily || 'Arial, sans-serif',
                marginTop: '12px', 
                opacity: 0.6 
              }}
            >
              <a 
                href="#" 
                style={{ 
                  color: element.textColor, 
                  textDecoration: 'underline',
                  fontWeight: element.fontWeight || 'normal',
                  fontStyle: element.fontStyle || 'normal',
                }}
              >
                Unsubscribe
              </a>
            </div>
          )}
        </div>
      );

    case 'image':
      const imageElement = (
        <img
          src={element.url}
          alt={element.alt}
          style={{
            width: `${element.width}%`,
            maxWidth: '100%',
            height: 'auto',
            display: 'inline-block',
            borderRadius: `${element.borderRadius}px`,
            backgroundColor: element.backgroundColor,
          }}
        />
      );

      const imagePlaceholder = (
        <div
          className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
          style={{
            width: `${element.width}%`,
            minHeight: '200px',
            display: 'inline-block',
            borderRadius: `${element.borderRadius}px`,
            backgroundColor: element.backgroundColor,
          }}
        >
          <div className="text-center">
            <ImageIcon className="size-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No image selected</p>
          </div>
        </div>
      );

      return (
        <div
          style={{
            textAlign: element.align,
            padding: `${element.padding}px`,
          }}
        >
          {element.url ? (
            element.link ? (
              <a href={element.link} target="_blank" rel="noopener noreferrer">
                {imageElement}
              </a>
            ) : (
              imageElement
            )
          ) : (
            imagePlaceholder
          )}
        </div>
      );

    case 'button':
      const buttonWidth = element.buttonWidth > 0 ? `${element.buttonWidth}px` : 'auto';
      const buttonHeight = element.buttonHeight > 0 ? `${element.buttonHeight}px` : 'auto';
      const buttonPadding = element.buttonWidth > 0 || element.buttonHeight > 0 ? '0' : '12px 32px';

      return (
        <div
          style={{
            textAlign: element.align,
            padding: `${element.padding}px`,
          }}
        >
          <a
            href={element.url || '#'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: buttonPadding,
              width: buttonWidth,
              height: buttonHeight,
              backgroundColor: element.backgroundColor,
              color: element.textColor,
              textDecoration: 'none',
              borderRadius: `${element.borderRadius}px`,
              fontWeight: 'bold',
            }}
          >
            {element.text || 'Button Text'}
          </a>
        </div>
      );

    case 'divider':
      return (
        <div style={{ padding: `${element.padding}px` }}>
          <hr
            style={{
              border: 'none',
              borderTop: `${element.thickness}px ${element.style} ${element.color}`,
              margin: 0,
            }}
          />
        </div>
      );

    case 'spacer':
      return (
        <div
          style={{ height: `${element.height}px` }}
          className="bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center"
        >
          <span className="text-xs text-gray-400">{element.height}px</span>
        </div>
      );

    case 'columns':
      return (
        <div style={{ padding: `${element.padding}px` }}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${element.columnCount}, 1fr)`, gap: '16px' }}>
            {element.columns.map((column, idx) => (
              <div key={idx} style={{ minHeight: '100px', border: '1px dashed #d1d5db', borderRadius: '4px', padding: '12px' }}>
                <p className="text-xs text-gray-500 text-center">Column {idx + 1}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'coupon':
      return (
        <div
          style={{
            padding: `${element.padding}px`,
            textAlign: element.align,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              backgroundColor: element.backgroundColor,
              border: `2px dashed ${element.borderColor}`,
              borderRadius: `${element.borderRadius}px`,
              padding: '24px 32px',
              textAlign: 'center',
              maxWidth: '500px',
            }}
          >
            <h3
              style={{
                fontSize: `${element.titleFontSize || 24}px`,
                fontFamily: element.titleFontFamily || 'Arial, sans-serif',
                fontWeight: element.titleFontWeight || 'bold',
                fontStyle: element.titleFontStyle || 'normal',
                textDecoration: element.titleTextDecoration || 'none',
                color: element.textColor,
                margin: '0 0 8px 0',
              }}
            >
              {element.title}
            </h3>
            <p
              style={{
                fontSize: `${element.descriptionFontSize || 14}px`,
                fontFamily: element.descriptionFontFamily || 'Arial, sans-serif',
                fontWeight: element.descriptionFontWeight || 'normal',
                fontStyle: element.descriptionFontStyle || 'normal',
                textDecoration: element.descriptionTextDecoration || 'none',
                color: element.textColor,
                margin: '0 0 16px 0',
                opacity: 0.9,
              }}
            >
              {element.description}
            </p>
            <div
              style={{
                backgroundColor: element.codeBackgroundColor,
                color: element.codeTextColor,
                padding: '12px 24px',
                borderRadius: '6px',
                display: 'inline-block',
                fontSize: `${element.codeFontSize || 20}px`,
                fontFamily: element.codeFontFamily || 'monospace',
                fontWeight: element.codeFontWeight || 'bold',
                letterSpacing: '2px',
                border: `1px solid ${element.borderColor}`,
              }}
            >
              {element.code}
            </div>
          </div>
        </div>
      );

    case 'greeting':
      return (
        <div
          style={{
            padding: `${element.padding}px`,
            textAlign: element.align,
            backgroundColor: element.backgroundColor,
          }}
        >
          <div
            style={{
              fontSize: `${element.fontSize}px`,
              fontWeight: element.fontWeight,
              fontFamily: element.fontFamily,
              fontStyle: element.fontStyle,
              color: element.color,
              lineHeight: '1.6',
            }}
          >
            {element.template || element.fallback}
          </div>
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
            <Hand className="size-3 inline mr-1" />
            <span className="font-semibold">Dynamic Variables:</span> {element.availableFields.map(f => `{{${f}}}`).join(', ')}
          </div>
        </div>
      );

    case 'pricing':
      return (
        <div
          style={{
            padding: `${element.padding}px`,
            textAlign: element.align,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              maxWidth: '400px',
              backgroundColor: element.backgroundColor,
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center',
            }}
          >
            <h3
              style={{
                fontSize: `${element.nameFontSize || 28}px`,
                fontFamily: element.nameFontFamily || 'Arial, sans-serif',
                fontWeight: element.nameFontWeight || 'bold',
                fontStyle: element.nameFontStyle || 'normal',
                textDecoration: element.nameTextDecoration || 'none',
                color: element.textColor,
                margin: '0 0 8px 0',
              }}
            >
              {element.name}
            </h3>
            <p
              style={{
                fontSize: `${element.descriptionFontSize || 14}px`,
                fontFamily: element.descriptionFontFamily || 'Arial, sans-serif',
                fontWeight: element.descriptionFontWeight || 'normal',
                fontStyle: element.descriptionFontStyle || 'normal',
                textDecoration: element.descriptionTextDecoration || 'none',
                color: element.textColor,
                opacity: 0.7,
                margin: '0 0 24px 0',
              }}
            >
              {element.description}
            </p>
            <div style={{ marginBottom: '24px' }}>
              {element.showOriginalPrice && (
                <div
                  style={{
                    fontSize: '18px',
                    color: element.textColor,
                    opacity: 0.5,
                    textDecoration: 'line-through',
                    marginBottom: '8px',
                  }}
                >
                  {element.currencySymbol}{element.originalPrice}
                </div>
              )}
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: '700',
                  color: element.buttonColor,
                  lineHeight: '1',
                }}
              >
                {element.currencySymbol}{element.offerPrice}
                <span style={{ fontSize: '18px', fontWeight: '400', opacity: 0.7 }}>/{element.currency}</span>
              </div>
            </div>
            <div style={{ marginBottom: '24px', textAlign: 'left' }}>
              {element.features.map((feature, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                    fontSize: `${element.featuresFontSize || 14}px`,
                    fontFamily: element.featuresFontFamily || 'Arial, sans-serif',
                    fontWeight: element.featuresFontWeight || 'normal',
                    fontStyle: element.featuresFontStyle || 'normal',
                    textDecoration: element.featuresTextDecoration || 'none',
                    color: element.textColor,
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: element.buttonColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Check style={{ width: '12px', height: '12px', color: '#ffffff' }} />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <a
              href={element.buttonUrl || '#'}
              style={{
                display: 'block',
                padding: '14px 32px',
                backgroundColor: element.buttonColor,
                color: element.buttonTextColor,
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              {element.buttonText}
            </a>
          </div>
        </div>
      );

    case 'table':
      return (
        <div
          style={{
            padding: `${element.padding}px`,
            textAlign: element.align,
          }}
        >
          <table
            style={{
              width: `${element.tableWidth}%`,
              borderCollapse: 'collapse',
              margin: element.align === 'center' ? '0 auto' : element.align === 'right' ? '0 0 0 auto' : '0',
              fontFamily: element.fontFamily,
              fontSize: `${element.fontSize}px`,
              fontWeight: element.fontWeight,
              border: `1px solid ${element.borderColor}`,
            }}
          >
            <thead>
              <tr>
                {element.headers.map((header, idx) => (
                  <th
                    key={idx}
                    style={{
                      backgroundColor: element.headerBackgroundColor,
                      color: element.headerTextColor,
                      padding: `${element.cellPadding}px`,
                      border: `1px solid ${element.borderColor}`,
                      textAlign: 'left',
                      fontWeight: 'bold',
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {element.rows.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {row.map((cell, cellIdx) => (
                    <td
                      key={cellIdx}
                      style={{
                        backgroundColor: element.rowBackgroundColor,
                        color: element.rowTextColor,
                        padding: `${element.cellPadding}px`,
                        border: `1px solid ${element.borderColor}`,
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      return <div>Unknown element type</div>;
  }
}