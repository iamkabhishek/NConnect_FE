import { TemplateElement } from './template-elements';

/**
 * ============================================================================
 * EMAIL HTML GENERATOR WITH DARK MODE PREVENTION (PHASE 1)
 * ============================================================================
 * 
 * PROBLEM: Email clients like Apple Mail, Gmail, and Outlook automatically
 * convert emails to dark mode when users have dark mode enabled. This causes:
 * - Light backgrounds to become dark
 * - Dark text to become unreadable
 * - Brand colors to invert unexpectedly
 * - Buttons and CTAs to lose visibility
 * 
 * SOLUTION (PHASE 1): Force Light Mode
 * We implement a multi-layered approach to prevent email clients from
 * auto-darkening our newsletter templates:
 * 
 * 1. META TAGS:
 *    - <meta name="color-scheme" content="light only">
 *    - <meta name="supported-color-schemes" content="light">
 *    These tell email clients to only use light mode.
 * 
 * 2. CSS COLOR-SCHEME:
 *    - :root { color-scheme: light only; }
 *    - body { color-scheme: light only !important; }
 *    CSS-level enforcement for modern email clients.
 * 
 * 3. MEDIA QUERY OVERRIDE:
 *    - @media (prefers-color-scheme: dark) { ... }
 *    Forces light colors even when dark mode is detected.
 * 
 * 4. TABLE-BASED LAYOUT:
 *    - Uses email-safe <table> structure instead of divs
 *    - Ensures consistent rendering across all email clients
 *    - Inline styles for maximum compatibility
 * 
 * RESULT: Newsletters always display in light mode with consistent branding,
 * regardless of the recipient's email client dark mode settings.
 * 
 * FUTURE (PHASE 2): Add optional dark mode support with per-element color
 * variants for power users who want to respect user preferences.
 * ============================================================================
 */

/**
 * Generates complete email HTML with dark mode prevention (Phase 1)
 * This ensures newsletters always display in light mode regardless of user's email client settings
 */
export function generateEmailHTML(elements: TemplateElement[], templateName?: string): string {
  const elementsHTML = elements.map(element => renderElementToHTML(element)).join('\n');
  
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  
  <!-- DARK MODE PREVENTION - Force Light Mode (Phase 1) -->
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light">
  
  <title>${templateName || 'Newsletter'}</title>
  
  <style type="text/css">
    /* Dark Mode Prevention - Force light mode across all email clients */
    :root {
      color-scheme: light only;
      supported-color-schemes: light;
    }
    
    /* Prevent dark mode auto-conversion */
    body {
      color-scheme: light only !important;
    }
    
    /* Reset styles for email clients */
    body, table, td, a {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    
    /* Prevent Gmail from overriding colors */
    u + #body a {
      color: inherit;
      text-decoration: none;
      font-size: inherit;
      font-family: inherit;
      font-weight: inherit;
      line-height: inherit;
    }
    
    /* Force light mode in Apple Mail and other clients */
    @media (prefers-color-scheme: dark) {
      body, .email-container {
        background-color: #ffffff !important;
        color: #000000 !important;
      }
      
      * {
        color-scheme: light !important;
      }
    }
    
    /* Responsive styles */
    @media screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        margin: auto !important;
      }
      
      .mobile-padding {
        padding-left: 10px !important;
        padding-right: 10px !important;
      }
    }
  </style>
  
  <!--[if mso]>
  <style type="text/css">
    body, table, td, a {
      font-family: Arial, sans-serif !important;
    }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; color-scheme: light only;" id="body">
  <!-- Prevent Gmail from showing dark mode -->
  <span style="display: none; max-height: 0; overflow: hidden; opacity: 0; color: transparent; mso-hide: all;">
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </span>
  
  <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0; padding: 0; background-color: #f4f4f4;" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 40px 0;">
        
        <!-- Main Email Container -->
        <table role="presentation" class="email-container" style="width: 600px; max-width: 600px; background-color: #ffffff; border-collapse: collapse;" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: 0;">
              
              <!-- Template Content -->
              ${elementsHTML}
              <!-- End Template Content -->
              
            </td>
          </tr>
        </table>
        <!-- End Main Email Container -->
        
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Converts a template element to email-compatible HTML string
 */
function renderElementToHTML(element: TemplateElement): string {
  switch (element.type) {
    case 'heading':
      const headingSizes = { h1: '32px', h2: '28px', h3: '24px' };
      const headingWeights = { h1: '700', h2: '600', h3: '600' };
      return `
        <table role="presentation" style="width: 100%; border-collapse: collapse;" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: ${element.padding}px; text-align: ${element.align}; background-color: ${element.backgroundColor};">
              <${element.level} style="font-size: ${headingSizes[element.level]}; font-weight: ${headingWeights[element.level]}; color: ${element.color}; font-family: ${element.fontFamily}; font-style: ${element.fontStyle}; text-decoration: ${element.textDecoration}; line-height: 1.2; margin: 0;">
                ${escapeHtml(element.content || 'Your Heading Here')}
              </${element.level}>
            </td>
          </tr>
        </table>`;

    case 'subheading':
      return `
        <table role="presentation" style="width: 100%; border-collapse: collapse;" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: ${element.padding}px; text-align: ${element.align}; background-color: ${element.backgroundColor};">
              <p style="font-size: 18px; font-weight: 400; color: ${element.color}; font-family: ${element.fontFamily}; font-style: ${element.fontStyle}; text-decoration: ${element.textDecoration}; line-height: 1.5; margin: 0;">
                ${escapeHtml(element.content || 'Your subheading text')}
              </p>
            </td>
          </tr>
        </table>`;

    case 'text':
      return `
        <table role="presentation" style="width: 100%; border-collapse: collapse;" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: ${element.padding}px; font-size: ${element.fontSize}px; font-weight: ${element.fontWeight}; font-family: ${element.fontFamily}; font-style: ${element.fontStyle}; text-decoration: ${element.textDecoration}; color: ${element.color}; background-color: ${element.backgroundColor}; text-align: ${element.align}; line-height: 1.6;">
              ${escapeHtml(element.content || 'Enter your text here...')}
            </td>
          </tr>
        </table>`;

    case 'button':
      const buttonWidth = element.buttonWidth > 0 ? `width: ${element.buttonWidth}px;` : '';
      const buttonHeight = element.buttonHeight > 0 ? `height: ${element.buttonHeight}px; line-height: ${element.buttonHeight}px;` : '';
      const buttonPadding = (element.buttonWidth > 0 || element.buttonHeight > 0) ? '0' : '12px 32px';
      return `
        <table role="presentation" style="width: 100%; border-collapse: collapse;" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: ${element.padding}px; text-align: ${element.align};">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: ${element.backgroundColor}; border-radius: ${element.borderRadius}px;">
                    <a href="${element.url || '#'}" style="display: inline-block; padding: ${buttonPadding}; ${buttonWidth} ${buttonHeight} background-color: ${element.backgroundColor}; color: ${element.textColor}; text-decoration: none; border-radius: ${element.borderRadius}px; font-weight: bold; text-align: center;">
                      ${escapeHtml(element.text || 'Button Text')}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>`;

    case 'image':
      const imageContent = element.url ? `<img src="${element.url}" alt="${escapeHtml(element.alt)}" style="width: ${element.width}%; max-width: 100%; height: auto; display: inline-block; border-radius: ${element.borderRadius}px; background-color: ${element.backgroundColor};" />` : '<!-- No image -->';
      return `
        <table role="presentation" style="width: 100%; border-collapse: collapse;" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: ${element.padding}px; text-align: ${element.align};">
              ${element.link ? `<a href="${element.link}" target="_blank" rel="noopener noreferrer">${imageContent}</a>` : imageContent}
            </td>
          </tr>
        </table>`;

    case 'logo':
      const logoStyle = `width: ${element.width}px; height: ${element.circular ? `${element.width}px` : 'auto'}; display: inline-block; border-radius: ${element.circular ? '50%' : '0'}; ${element.circular ? 'object-fit: cover;' : ''}`;
      return `
        <table role="presentation" style="width: 100%; border-collapse: collapse;" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: ${element.padding}px; text-align: ${element.align};">
              ${element.url ? (element.link ? 
                `<a href="${element.link}"><img src="${element.url}" alt="${escapeHtml(element.alt)}" style="${logoStyle}" /></a>` :
                `<img src="${element.url}" alt="${escapeHtml(element.alt)}" style="${logoStyle}" />`
              ) : '<!-- No logo -->'}
            </td>
          </tr>
        </table>`;

    case 'divider':
      return `
        <table role="presentation" style="width: 100%; border-collapse: collapse;" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: ${element.padding}px;">
              <hr style="border: none; border-top: ${element.thickness}px solid ${element.color}; margin: 0;" />
            </td>
          </tr>
        </table>`;

    case 'spacer':
      return `
        <table role="presentation" style="width: 100%; border-collapse: collapse;" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="height: ${element.height}px; line-height: ${element.height}px; font-size: 0;">&nbsp;</td>
          </tr>
        </table>`;

    case 'quote':
      return `
        <table role="presentation" style="width: 100%; border-collapse: collapse;" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: ${element.padding}px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: ${element.backgroundColor}; border-left: 4px solid ${element.borderColor}; margin: 20px 0;" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 20px; text-align: ${element.align};">
                    <p style="font-size: 18px; font-style: italic; color: ${element.textColor}; margin: 0 0 10px 0; line-height: 1.6;">
                      "${escapeHtml(element.content)}"
                    </p>
                    <p style="font-size: 14px; color: ${element.textColor}; opacity: 0.8; margin: 0;">
                      ${escapeHtml(element.author)}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>`;

    case 'list':
      const listTag = element.bulletStyle === 'decimal' ? 'ol' : 'ul';
      const listItems = element.items.map(item => `<li style="margin-bottom: 8px; font-size: ${element.fontSize}px; line-height: 1.5; font-style: ${element.fontStyle}; text-decoration: ${element.textDecoration};">${escapeHtml(item)}</li>`).join('');
      return `
        <table role="presentation" style="width: 100%; border-collapse: collapse;" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: ${element.padding}px; background-color: ${element.backgroundColor}; text-align: ${element.align};">
              <${listTag} style="margin: 0; padding-left: 24px; color: ${element.color}; font-size: ${element.fontSize}px; font-family: ${element.fontFamily}; font-weight: ${element.fontWeight}; list-style-type: ${element.bulletStyle}; display: inline-block; text-align: left;">
                ${listItems}
              </${listTag}>
            </td>
          </tr>
        </table>`;

    case 'badge':
      return `
        <table role="presentation" style="width: 100%; border-collapse: collapse;" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: ${element.padding}px; text-align: ${element.align};">
              <span style="display: inline-block; padding: 6px 16px; background-color: ${element.backgroundColor}; color: ${element.textColor}; border-radius: ${element.borderRadius}px; font-size: 14px; font-weight: 600;">
                ${escapeHtml(element.text || 'Badge Text')}
              </span>
            </td>
          </tr>
        </table>`;

    case 'cta':
      return `
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: ${element.backgroundColor}; border-radius: 8px; margin: 20px 0;" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: ${element.padding}px; text-align: ${element.align};">
              <h3 style="font-size: 24px; font-weight: bold; color: ${element.textColor}; margin: 0 0 12px 0;">
                ${escapeHtml(element.title)}
              </h3>
              <p style="font-size: 16px; color: ${element.textColor}; margin: 0 0 20px 0; opacity: 0.9;">
                ${escapeHtml(element.description)}
              </p>
              <a href="${element.buttonUrl || '#'}" style="display: inline-block; padding: 14px 32px; background-color: ${element.buttonColor}; color: ${element.buttonTextColor}; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                ${escapeHtml(element.buttonText)}
              </a>
            </td>
          </tr>
        </table>`;

    case 'coupon':
      return `
        <table role="presentation" style="width: 100%; border-collapse: collapse;" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: ${element.padding}px; text-align: ${element.align};">
              <table role="presentation" style="display: inline-block; background-color: ${element.backgroundColor}; border: 2px dashed ${element.borderColor}; border-radius: ${element.borderRadius}px; max-width: 500px;" border="0" cellpadding="24" cellspacing="0">
                <tr>
                  <td style="text-align: center;">
                    <h3 style="font-size: 24px; font-weight: 700; color: ${element.textColor}; margin: 0 0 8px 0;">
                      ${escapeHtml(element.title)}
                    </h3>
                    <p style="font-size: 14px; color: ${element.textColor}; margin: 0 0 16px 0; opacity: 0.9;">
                      ${escapeHtml(element.description)}
                    </p>
                    <div style="background-color: ${element.codeBackgroundColor}; color: ${element.codeTextColor}; padding: 12px 24px; border-radius: 6px; display: inline-block; font-family: monospace; font-size: 20px; font-weight: 700; letter-spacing: 2px; border: 1px solid ${element.borderColor};">
                      ${escapeHtml(element.code)}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>`;

    case 'announcement':
      return `
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: ${element.backgroundColor};" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: ${element.padding}px; text-align: center;">
              <p style="font-size: ${element.fontSize}px; color: ${element.textColor}; margin: 0; font-weight: 600;">
                ${escapeHtml(element.text)}
              </p>
            </td>
          </tr>
        </table>`;

    case 'social':
      const socialIcons = element.platforms.filter(p => p.enabled).map(platform => {
        return `<a href="${platform.url || '#'}" style="display: inline-block; margin: 0 6px;"><img src="https://via.placeholder.com/${element.iconSize}/${element.iconSize}/4A90E2/ffffff?text=${platform.name[0].toUpperCase()}" alt="${platform.name}" style="width: ${element.iconSize}px; height: ${element.iconSize}px; border-radius: 50%;" /></a>`;
      }).join('');
      return `
        <table role="presentation" style="width: 100%; border-collapse: collapse;" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: ${element.padding}px; text-align: ${element.align};">
              ${socialIcons}
            </td>
          </tr>
        </table>`;

    case 'footer':
      const footerLinks = element.links.map(link => 
        `<a href="${link.url || '#'}" style="font-size: 12px; color: ${element.textColor}; text-decoration: none; margin: 0 8px;">${escapeHtml(link.text)}</a>`
      ).join('');
      return `
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: ${element.backgroundColor};" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: ${element.padding}px; color: ${element.textColor}; text-align: center;">
              <div style="font-size: 14px; font-weight: bold; margin-bottom: 8px;">
                ${escapeHtml(element.companyName || 'Company Name')}
              </div>
              <div style="font-size: 12px; margin-bottom: 12px; opacity: 0.8;">
                ${escapeHtml(element.address || 'Company Address')}
              </div>
              <div style="margin-bottom: 12px;">
                ${footerLinks}
              </div>
              ${element.showUnsubscribe ? `<div style="font-size: 11px; margin-top: 12px; opacity: 0.6;"><a href="#" style="color: ${element.textColor}; text-decoration: underline;">Unsubscribe</a></div>` : ''}
            </td>
          </tr>
        </table>`;

    case 'signature':
      return `
        <table role="presentation" style="width: 100%; border-collapse: collapse;" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: ${element.padding}px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right: 20px; vertical-align: top;">
                    ${element.imageUrl ? 
                      `<img src="${element.imageUrl}" alt="${escapeHtml(element.name)}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;" />` :
                      '<!-- No signature image -->'
                    }
                  </td>
                  <td style="vertical-align: top;">
                    <div style="font-size: 18px; font-weight: bold; color: #111827; margin-bottom: 4px;">
                      ${escapeHtml(element.name || 'Your Name')}
                    </div>
                    <div style="font-size: 14px; color: #6b7280; margin-bottom: 2px;">
                      ${escapeHtml(element.title || 'Your Title')}
                    </div>
                    <div style="font-size: 14px; color: #9ca3af;">
                      ${escapeHtml(element.company || 'Company Name')}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>`;

    case 'product':
      return `
        <table role="presentation" style="width: 100%; border-collapse: collapse;" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: ${element.padding}px; text-align: ${element.align};">
              <table role="presentation" style="max-width: 400px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; display: inline-block;" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    ${element.imageUrl ? 
                      `<img src="${element.imageUrl}" alt="${escapeHtml(element.name)}" style="width: 100%; height: 250px; object-fit: cover; display: block;" />` :
                      '<!-- No product image -->'
                    }
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="font-size: 20px; font-weight: bold; color: #111827; margin: 0 0 8px 0;">
                      ${escapeHtml(element.name)}
                    </h3>
                    <p style="font-size: 14px; color: #6b7280; margin: 0 0 12px 0; line-height: 1.5;">
                      ${escapeHtml(element.description)}
                    </p>
                    <p style="font-size: 24px; font-weight: bold; color: #4A90E2; margin: 0 0 16px 0;">
                      ${escapeHtml(element.price)}
                    </p>
                    <a href="${element.buttonUrl || '#'}" style="display: block; padding: 12px 24px; background-color: #4A90E2; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; text-align: center;">
                      ${escapeHtml(element.buttonText)}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>`;

    case 'video':
      return `
        <table role="presentation" style="width: 100%; border-collapse: collapse;" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: ${element.padding}px; text-align: ${element.align};">
              ${element.url ? 
                `<a href="${element.url}" style="display: block; max-width: ${element.width}%; margin: 0 auto;"><img src="https://via.placeholder.com/600x338/000000/ffffff?text=Play+Video" alt="Video" style="width: 100%; height: auto; border-radius: 8px;" /></a>` :
                '<!-- No video URL -->'
              }
            </td>
          </tr>
        </table>`;

    case 'navigation':
      const navLinks = element.links.map(link => 
        `<a href="${link.url || '#'}" style="color: ${element.textColor}; text-decoration: none; font-size: 15px; font-weight: 500; margin: 0 12px;">${escapeHtml(link.text)}</a>`
      ).join('');
      return `
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: ${element.backgroundColor};" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: ${element.padding}px; text-align: ${element.align};">
              ${navLinks}
            </td>
          </tr>
        </table>`;

    case 'twocolumn':
      return `
        <table role="presentation" style="width: 100%; border-collapse: collapse;" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: ${element.padding}px;">
              <table role="presentation" style="width: 100%;" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width: 50%; padding-right: ${element.columnGap / 2}px; vertical-align: top;">
                    ${element.leftContent.type === 'image' && element.leftContent.url ? 
                      `<img src="${element.leftContent.url}" alt="${escapeHtml(element.leftContent.alt || '')}" style="width: 100%; height: auto; border-radius: 4px;" />` :
                      `<p style="font-size: 16px; color: #333; line-height: 1.6; margin: 0;">${escapeHtml(element.leftContent.content || 'Left column content')}</p>`
                    }
                  </td>
                  <td style="width: 50%; padding-left: ${element.columnGap / 2}px; vertical-align: top;">
                    ${element.rightContent.type === 'image' && element.rightContent.url ? 
                      `<img src="${element.rightContent.url}" alt="${escapeHtml(element.rightContent.alt || '')}" style="width: 100%; height: auto; border-radius: 4px;" />` :
                      `<p style="font-size: 16px; color: #333; line-height: 1.6; margin: 0;">${escapeHtml(element.rightContent.content || 'Right column content')}</p>`
                    }
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>`;

    case 'columns':
      return `<!-- Multi-column layout - requires custom implementation -->`;

    default:
      return `<!-- Unknown element type: ${element.type} -->`;
  }
}

/**
 * Escapes HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}