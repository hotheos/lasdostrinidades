/* ============================================================
   LAS DOS TRINIDADES — Markdown Renderer
   ============================================================
   Loads .md files and renders them as styled HTML using the
   component classes from components.css. No external deps.
   ============================================================ */

const MarkdownRenderer = {
  render(md) {
    let html = md;

    // Remove trailing page nav lines (old markdown links)
    html = html.replace(/\n\*Página \d+ de \d+\*.*$/gm, '');

    // Extract page title (# heading)
    const titleMatch = html.match(/^#\s+(\d+\.\s+)?(.+)$/m);
    let pageNumber = '';
    let pageTitle = '';
    if (titleMatch) {
      pageNumber = titleMatch[1] ? titleMatch[1].trim().replace('.', '') : '';
      pageTitle = titleMatch[2].trim();
      html = html.replace(/^#\s+.+$/m, '');
    }

    // Extract epigraph (first blockquote before ---)
    // Format: Spanish text (italic), blank, original (italic), blank, source
    let epigraphHtml = '';
    const lines = html.split('\n');
    let epiStart = -1, epiEnd = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('> ') || lines[i] === '>') {
        if (epiStart === -1) epiStart = i;
        epiEnd = i;
      } else if (epiStart !== -1) {
        break; // End of first blockquote
      }
    }
    if (epiStart !== -1) {
      const epiLines = [];
      for (let i = epiStart; i <= epiEnd; i++) {
        epiLines.push(lines[i].replace(/^>\s?/, ''));
      }
      // Split into blocks by empty lines
      const blocks = [];
      let currentBlock = [];
      for (const line of epiLines) {
        if (line.trim() === '') {
          if (currentBlock.length > 0) {
            blocks.push(currentBlock.join(' '));
            currentBlock = [];
          }
        } else {
          currentBlock.push(line);
        }
      }
      if (currentBlock.length > 0) blocks.push(currentBlock.join(' '));

      if (blocks.length >= 2) {
        // Strip surrounding * from italic blocks
        const stripItalic = (s) => s.replace(/^\*\s*/, '').replace(/\s*\*$/, '');
        const processSource = (s) => s.replace(/\*([^*]+)\*/g, '<em>$1</em>');

        const textContent = stripItalic(blocks[0]);
        let originalContent = '';
        let sourceContent = '';

        if (blocks.length >= 3) {
          // 3 blocks: text, original, source
          originalContent = stripItalic(blocks[1]);
          sourceContent = processSource(blocks[2]);
        } else {
          // 2 blocks: text + source (no original)
          const second = blocks[1];
          if (second.startsWith('*') && second.endsWith('*')) {
            originalContent = stripItalic(second);
          } else {
            sourceContent = processSource(second);
          }
        }

        epigraphHtml = `<div class="epigraph">
          <div class="epigraph__text">${textContent}</div>
          ${originalContent ? `<div class="epigraph__original">${originalContent}</div>` : ''}
          ${sourceContent ? `<div class="epigraph__source">${sourceContent}</div>` : ''}
        </div>`;

        // Remove the blockquote lines from html
        const before = lines.slice(0, epiStart);
        const after = lines.slice(epiEnd + 1);
        html = before.concat(after).join('\n');
      }
    }

    // Process sections
    html = this.processBlocks(html);

    // Build page header
    const headerHtml = `<div class="page-header">
      ${pageNumber ? `<span class="page-header__number">Página ${pageNumber}</span>` : ''}
      <h1 class="page-header__title">${pageTitle}</h1>
    </div>`;

    return headerHtml + epigraphHtml + html;
  },

  processBlocks(md) {
    let html = md;

    // Horizontal rules → section separators
    html = html.replace(/\n---\n/g, '\n<hr class="section-separator">\n');

    // Code blocks (must come before tables/blockquotes to avoid interference)
    html = this.processCodeBlocks(html);

    // Tables
    html = this.processTables(html);

    // Blockquotes (multi-line)
    html = this.processBlockquotes(html);

    // Headers with IDs
    html = html.replace(/^####\s+(.+)$/gm, (_, t) => {
      const id = this.slugify(t);
      return `<h4 id="${id}">${this.processInline(t)}</h4>`;
    });
    html = html.replace(/^###\s+(.+)$/gm, (_, t) => {
      const id = this.slugify(t);
      return `<h3 id="${id}">${this.processInline(t)}</h3>`;
    });
    html = html.replace(/^##\s+(.+)$/gm, (_, t) => {
      const id = this.slugify(t);
      return `<h2 id="${id}">${this.processInline(t)}</h2>`;
    });

    // Unordered lists
    html = this.processLists(html);

    // Paragraphs (lines not already processed)
    html = this.processParagraphs(html);

    return html;
  },

  processCodeBlocks(html) {
    return html.replace(/```[\w]*\n([\s\S]*?)```/g, (match, content) => {
      // Detect Nicene fontal diagram
      if (content.includes('Padre') && content.includes('fuente') && content.includes('Hijo') && content.includes('genera')) {
        return `<div class="theology-diagram theology-diagram--nicene">
          <div class="theology-diagram__title">Esquema niceno (fontal-asimétrico)</div>
          <div class="diagram-nicene">
            <div class="diagram-nicene__source">
              <span class="diagram-nicene__label">Padre</span>
              <span class="diagram-nicene__sublabel">fuente única, <em>ho Theós</em></span>
            </div>
            <div class="diagram-nicene__arrows">
              <div class="diagram-nicene__branch">
                <span class="diagram-nicene__action">genera ↓</span>
              </div>
              <div class="diagram-nicene__branch">
                <span class="diagram-nicene__action">hace proceder ↓</span>
              </div>
            </div>
            <div class="diagram-nicene__derived">
              <div class="diagram-nicene__person">
                <span class="diagram-nicene__name">Hijo</span>
                <span class="diagram-nicene__desc">Consustancial con el Padre. Recibe la divinidad por generación eterna.</span>
              </div>
              <div class="diagram-nicene__person">
                <span class="diagram-nicene__name">Espíritu</span>
                <span class="diagram-nicene__desc">Consustancial con el Padre. Recibe la divinidad por procesión eterna.</span>
              </div>
            </div>
          </div>
        </div>`;
      }
      // Detect Augustinian essentialist diagram
      if (content.includes('Essentia') || content.includes('essentia') || (content.includes('Deus') && content.includes('rel.'))) {
        return `<div class="theology-diagram theology-diagram--augustinian">
          <div class="theology-diagram__title">Esquema agustiniano (esencialista-simétrico)</div>
          <div class="diagram-augustinian">
            <div class="diagram-augustinian__essence">
              <div class="diagram-augustinian__essence-label">
                <span class="diagram-augustinian__name">Essentia divina</span>
                <span class="diagram-augustinian__sublabel">(Deus)</span>
              </div>
              <div class="diagram-augustinian__persons">
                <div class="diagram-augustinian__person">
                  <span class="diagram-augustinian__pname">Padre</span>
                  <span class="diagram-augustinian__prel">(rel.)</span>
                </div>
                <div class="diagram-augustinian__person">
                  <span class="diagram-augustinian__pname">Hijo</span>
                  <span class="diagram-augustinian__prel">(rel.)</span>
                </div>
                <div class="diagram-augustinian__person">
                  <span class="diagram-augustinian__pname">Espíritu</span>
                  <span class="diagram-augustinian__prel">(rel.)</span>
                </div>
              </div>
            </div>
          </div>
        </div>`;
      }
      // Default: render as code block
      return `<pre class="code-block"><code>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
    });
  },

  processTables(html) {
    const tableRegex = /(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)+)/g;
    return html.replace(tableRegex, (match, headerRow, sepRow, bodyRows) => {
      const isWordTable = headerRow.includes('Lema') || headerRow.includes('Original');
      const tableClass = isWordTable ? 'word-table' : 'comparison-table';
      const wrapStart = isWordTable ? '<div class="word-table-wrapper">' : '';
      const wrapEnd = isWordTable ? '</div>' : '';

      const headers = this.parseTableRow(headerRow);
      const seps = this.parseTableRow(sepRow);
      const aligns = seps.map(s => {
        if (s.startsWith(':') && s.endsWith(':')) return 'center';
        if (s.endsWith(':')) return 'right';
        return 'left';
      });

      let thead = '<thead><tr>';
      headers.forEach((h, i) => {
        const cls = h.toLowerCase().includes('nicen') || h.toLowerCase().includes('fontal') ? ' class="col-nicene"' :
                    h.toLowerCase().includes('agustin') || h.toLowerCase().includes('esencial') ? ' class="col-augustine"' : '';
        thead += `<th${cls} style="text-align:${aligns[i] || 'left'}">${this.processInline(h)}</th>`;
      });
      thead += '</tr></thead>';

      const rows = bodyRows.trim().split('\n');
      let tbody = '<tbody>';
      rows.forEach(row => {
        const cells = this.parseTableRow(row);
        tbody += '<tr>';
        cells.forEach((c, i) => {
          tbody += `<td style="text-align:${aligns[i] || 'left'}">${this.processInline(c)}</td>`;
        });
        tbody += '</tr>';
      });
      tbody += '</tbody>';

      return `${wrapStart}<table class="${tableClass}">${thead}${tbody}</table>${wrapEnd}`;
    });
  },

  parseTableRow(row) {
    return row.split('|').map(c => c.trim()).filter((c, i, a) => i > 0 && i < a.length);
  },

  processBlockquotes(html) {
    const lines = html.split('\n');
    const result = [];
    let i = 0;

    while (i < lines.length) {
      if (lines[i].startsWith('> ') || lines[i] === '>') {
        const quoteLines = [];
        while (i < lines.length && (lines[i].startsWith('> ') || lines[i] === '>')) {
          quoteLines.push(lines[i].replace(/^>\s?/, ''));
          i++;
        }
        const content = quoteLines.join('\n');
        const type = this.detectQuoteType(content);
        const rendered = this.renderQuote(content, type);
        result.push(rendered);
      } else {
        result.push(lines[i]);
        i++;
      }
    }
    return result.join('\n');
  },

  detectQuoteType(content) {
    const lower = content.toLowerCase();
    if (lower.includes('corintios') || lower.includes('juan') || lower.includes('salmo') ||
        lower.includes('mateo') || lower.includes('marcos') || lower.includes('lucas') ||
        lower.includes('hebreos') || lower.includes('colosenses') || lower.includes('romanos') ||
        lower.includes('génesis') || lower.includes('éxodo') || lower.includes('isaías')) {
      return 'biblical';
    }
    if (lower.includes('ireneo') || lower.includes('justino') || lower.includes('atanasio') ||
        lower.includes('tertuliano') || lower.includes('hilario') || lower.includes('adversus')) {
      return 'nicene';
    }
    if (lower.includes('agustín') || lower.includes('de trinitate') || lower.includes('tomás') ||
        lower.includes('aquino') || lower.includes('quicumque')) {
      return 'augustinian';
    }
    if (lower.includes('nicea') || lower.includes('constantinopla') || lower.includes('símbolo') ||
        lower.includes('concilio') || lower.includes('381') || lower.includes('325')) {
      return 'conciliar';
    }
    return 'conciliar';
  },

  renderQuote(content, type) {
    // Try to detect source attribution (last line)
    const lines = content.split('\n').filter(l => l.trim());
    let sourceText = '';
    let bodyLines = [...lines];

    const lastLine = lines[lines.length - 1];
    if (lastLine && (lastLine.startsWith('──') || lastLine.startsWith('--') ||
        /^(Agustín|Ireneo|Justino|Atanasio|Tertuliano|Hilario|Tomás|Símbolo|Pablo|Gregorio|Basilio|Karl|Vladimir|Lossky|Rahner|Congar|Zizioulas|Barth|Catherine)/.test(lastLine.trim()) ||
        /^\*?(Primera|Segunda|Adversus|De Trinitate|Contra|Ad |Oratio)/.test(lastLine.trim()))) {
      sourceText = lastLine.replace(/^(──|--)\s*/, '');
      bodyLines = lines.slice(0, -1);
    }

    const bodyText = bodyLines.join('\n');
    const parts = bodyText.split('\n\n').map(p => p.trim()).filter(p => p);

    // .md files are now ordered: Spanish first, original (italic) second.
    // Just render in source order.
    let mainHtml = '';
    let originalHtml = '';

    if (parts.length >= 2) {
      const first = parts[0];
      const second = parts.slice(1).join('\n\n');
      mainHtml = `<div class="quote-source__text">${this.processInline(first)}</div>`;
      if (second.startsWith('*') && second.endsWith('*')) {
        originalHtml = `<div class="quote-source__original">${this.processInline(second)}</div>`;
      } else {
        mainHtml += `<div class="quote-source__text">${this.processInline(second)}</div>`;
      }
    } else {
      mainHtml = `<div class="quote-source__text">${this.processInline(bodyText)}</div>`;
    }

    const refHtml = sourceText ? `<div class="quote-source__ref"><span>${this.processInline(sourceText)}</span></div>` : '';

    return `<blockquote class="quote-source quote-source--${type}">
      ${mainHtml}${originalHtml}${refHtml}
    </blockquote>`;
  },

  processLists(html) {
    const lines = html.split('\n');
    const result = [];
    let i = 0;

    while (i < lines.length) {
      if (/^[-*]\s+/.test(lines[i])) {
        result.push('<ul>');
        while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
          const text = lines[i].replace(/^[-*]\s+/, '');
          result.push(`<li>${this.processInline(text)}</li>`);
          i++;
        }
        result.push('</ul>');
      } else {
        result.push(lines[i]);
        i++;
      }
    }
    return result.join('\n');
  },

  processParagraphs(html) {
    const lines = html.split('\n');
    const result = [];
    let buffer = [];

    const isBlock = (line) => {
      return line.startsWith('<') || line.startsWith('#') || line === '' ||
             line.startsWith('|') || line.startsWith('>');
    };

    for (const line of lines) {
      if (isBlock(line)) {
        if (buffer.length > 0) {
          result.push(`<p>${this.processInline(buffer.join(' '))}</p>`);
          buffer = [];
        }
        result.push(line);
      } else {
        buffer.push(line);
      }
    }
    if (buffer.length > 0) {
      result.push(`<p>${this.processInline(buffer.join(' '))}</p>`);
    }

    return result.join('\n');
  },

  processInline(text) {
    if (!text) return '';
    let t = text;
    // Bold (handle ** markers robustly)
    t = t.replace(/\*\*([^*]+(?:\*(?!\*)[^*]*)*)\*\*/g, '<strong>$1</strong>');
    // Italic (single * but not inside already-processed bold tags)
    t = t.replace(/\*([^*<>]+)\*/g, '<em class="latin">$1</em>');
    // Inline code
    t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Greek characters in parens: (ὁμοούσιος, homoousios) → tooltip
    t = t.replace(/\(([α-ωΑ-Ωἀ-ῷᾀ-ᾷ]+(?:\s+[α-ωΑ-Ωἀ-ῷᾀ-ᾷ]+)*),\s*([a-zA-Zēōāīū]+(?:\s+[a-zA-Zēōāīū]+)*)\)/g,
      '<span class="term" tabindex="0"><span class="term__tooltip"><span class="term__original">$1</span><span class="term__transliteration">$2</span></span>($1, $2)</span>');
    return t;
  },

  slugify(text) {
    return text.toLowerCase()
      .replace(/<[^>]+>/g, '')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/[^a-záéíóúñü0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 60);
  }
};

window.MarkdownRenderer = MarkdownRenderer;
