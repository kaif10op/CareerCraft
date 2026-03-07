"use client";

import { templates } from "@/config/templates";

export type ResumeTemplate = string;

interface ResumePreviewProps {
  content: string;
  template?: ResumeTemplate;
}

export default function ResumePreview({ content, template = 'modern' }: ResumePreviewProps) {
  // Styles based on selected template config
  const templateConfig = templates.find(t => t.id === template) || templates[0];
  const styles = templateConfig.styles;

  // Simple markdown-to-HTML converter for resume display
  const renderMarkdown = (md: string) => {
    if (!md) return "";
    
    // 1. Process block-level elements first (headers, rules)
    let html = md
      // Headers
      .replace(/^### (.*$)/gim, `<h3 class="${styles.h3}" style="color: ${styles.color.heading};">$1</h3>`)
      .replace(/^## (.*$)/gim, `<h2 class="${styles.h2}" style="color: ${styles.color.heading}; border-color: ${styles.color.border};">$1</h2>`)
      .replace(/^# (.*$)/gim, (match, p1) => {
        // Prevent inline coloring if the template specifies explicit text color classes (like in Functional theme)
        const hasExplicitColor = styles.h1.includes('text-white') || styles.h1.includes('text-gray-') || styles.h1.includes('text-black');
        const colorStyle = hasExplicitColor ? '' : `color: ${styles.color.heading};`;
        return `<h1 class="${styles.h1}" style="${colorStyle}">${p1}</h1>`;
      })
      // Horizontal rules
      .replace(/^---$/gim, `<hr class="${styles.hr}" style="border-color: ${styles.color.border};" />`);

    // 2. Process inline elements
    html = html
      // Bold + Italic
      .replace(/\*\*\*(.*?)\*\*\*/g, `<strong class="italic" style="color: ${styles.color.heading};">$1</strong>`)
      // Bold
      .replace(/\*\*(.*?)\*\*/g, `<strong style="color: ${styles.color.heading};">$1</strong>`)
      // Italic
      .replace(/\*(.*?)\*/g, `<em style="color: ${styles.color.muted};">$1</em>`)
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="hover:underline font-medium relative z-10" style="color: inherit;">$1</a>');

    // 3. Process Lists and Paragraphs
    // Split by double newline to get blocks
    const blocks = html.split(/\n\n+/);
    
    html = blocks.map(block => {
      // Check if this block is a list (starts with -, *, or •)
      if (/^[-*•]\s/m.test(block)) {
        // It's a list - process each item
        const items = block.trim().split(/\n/).filter(line => {
          const t = line.trim();
          return t.startsWith('- ') || t.startsWith('* ') || t.startsWith('• ');
        });
        const listItems = items.map(item => {
          // Remove all consecutive leading bullet characters and whitespace
          const content = item.replace(/^[\-\*\•\·\s]+/, '');
          return `<li class="ml-4 mb-2 pl-2" style="color: ${styles.color.text};">${content}</li>`;
        }).join('\n');
        return `<ul class="list-disc mb-6 ml-4" style="color: ${styles.color.text};">\n${listItems}\n</ul>`;
      } else if (block.trim().startsWith('<h') || block.trim().startsWith('<hr')) {
        // It's already a formatted heading or rule, leave it alone
        return block;
      } else {
        // It's a regular paragraph
        // Treat single newlines within a paragraph as spaces to prevent weird breaking
        const cleanedBlock = block.trim().replace(/\n/g, ' ');
        if (cleanedBlock) {
          return `<p class="mb-4 leading-relaxed" style="color: ${styles.color.text};">${cleanedBlock}</p>`;
        }
        return '';
      }
    }).join('\n');

    return html;
  };

  // NEW PARSING LOGIC: Split the markdown into structural chunks
  const parseMarkdownSections = (md: string) => {
    if (!md) return { header: "", sections: [] };

    // Find the first major heading (##) which usually denotes the first section like "Professional Summary"
    const firstSectionMatch = md.match(/^##\s+.+$/m);
    
    let headerText = md;
    let restText = "";

    if (firstSectionMatch && firstSectionMatch.index !== undefined) {
      headerText = md.substring(0, firstSectionMatch.index).trim();
      restText = md.substring(firstSectionMatch.index).trim();
    }

    // FIX: Sometimes the AI outputs `# John Doe` and then immediately another `# John Doe` or `John Doe`
    // Let's clean up the headerText to remove obvious completely duplicated lines
    const headerLines = headerText.split('\n');
    const uniqueHeaderLines = headerLines.filter((line, index, self) => {
      const cleanLine = line.replace(/^#+\s*/, '').trim().toLowerCase();
      if (!cleanLine) return true; // keep empty lines for spacing
      // Find the first occurrence of this text in the array
      const firstIndex = self.findIndex(l => l.replace(/^#+\s*/, '').trim().toLowerCase() === cleanLine);
      return index === firstIndex;
    });
    headerText = uniqueHeaderLines.join('\n');

    // Parse the rest into sections exactly split by '## ' 
    const sections: { id: string; title: string; content: string }[] = [];
    if (restText) {
      const sectionSplits = restText.split(/^##\s+/m).filter(Boolean);
      
      sectionSplits.forEach(section => {
        const firstNewLineIdx = section.indexOf('\n');
        if (firstNewLineIdx === -1) {
          sections.push({
            id: section.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            title: section.trim(),
            content: ""
          });
        } else {
          const title = section.substring(0, firstNewLineIdx).trim();
          const content = section.substring(firstNewLineIdx).trim();
          sections.push({
            id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            title,
            content
          });
        }
      });
    }

    return { header: headerText, sections };
  };

  const parsedResume = parseMarkdownSections(content);
  
  const handlePrint = () => {
    window.print();
  };

  // Helper to figure out which column a section should go to based on layout
  const getSidebarSections = (layout: string) => ["skills", "education", "certifications", "technologies", "core-competencies"];
  
  const leftColSections = parsedResume.sections.filter(s => 
    templateConfig.layout === "sidebar-left" && getSidebarSections(templateConfig.layout).some(key => s.id.includes(key))
  );
  
  const rightColSections = parsedResume.sections.filter(s => 
    templateConfig.layout === "sidebar-right" && getSidebarSections(templateConfig.layout).some(key => s.id.includes(key))
  );

  const mainColSectionsLeft = parsedResume.sections.filter(s => 
    templateConfig.layout === "sidebar-left" && !getSidebarSections(templateConfig.layout).some(key => s.id.includes(key))
  );

  const mainColSectionsRight = parsedResume.sections.filter(s => 
    templateConfig.layout === "sidebar-right" && !getSidebarSections(templateConfig.layout).some(key => s.id.includes(key))
  );

  // Render a specific section block
  const renderSection = (section: { id: string; title: string; content: string }) => {
    // We rebuild a mini-markdown snippet to reuse the existing renderer
    const mdSnippet = `## ${section.title}\n${section.content}`;
    return (
      <div key={section.id} className="mb-2" dangerouslySetInnerHTML={{ __html: renderMarkdown(mdSnippet) }} />
    );
  };

  return (
    <div>
      {/* Action bar (hidden in print) */}
      <div data-print-hide className="mb-6 flex gap-3">
        <button
          onClick={handlePrint}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-medium hover:from-violet-500 hover:to-cyan-500 transition-all shadow-lg shadow-violet-500/25 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Download as PDF
        </button>
      </div>

      {/* Resume content */}
      <div
        id="resume-content"
        className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-[800px] mx-auto transition-all"
      >
        <div
          className={`resume-preview max-w-none ${styles.body}`}
          style={{ color: styles.color.text }}
        >
          {/* Conditional Layout Rendering */}
          {templateConfig.layout === "linear" && (
            <div className="flex flex-col">
              <div dangerouslySetInnerHTML={{ __html: renderMarkdown(parsedResume.header) }} />
              {parsedResume.sections.map(renderSection)}
            </div>
          )}

          {templateConfig.layout === "executive" && (
            <div className="flex flex-col mx-auto max-w-[95%]">
              <div className="text-center mb-8 pb-4 border-b-2" style={{ borderColor: styles.color.border }}>
                 {/* Explicitly center the executive header text by overriding global prose */}
                 <div className="[&_h1]:text-center [&_p]:text-center" dangerouslySetInnerHTML={{ __html: renderMarkdown(parsedResume.header) }} />
              </div>
              {parsedResume.sections.map((section) => (
                <div key={section.id} className="mb-4">
                  {renderSection(section)}
                </div>
              ))}
            </div>
          )}

          {templateConfig.layout === "split-header" && (
            <div className="flex flex-col">
              <div className="bg-gray-100 p-8 rounded-lg mb-8 border-l-8" style={{ borderColor: styles.color.heading }}>
                 <div dangerouslySetInnerHTML={{ __html: renderMarkdown(parsedResume.header) }} />
              </div>
              {parsedResume.sections.map(renderSection)}
            </div>
          )}

          {templateConfig.layout === "sidebar-left" && (
            <div className="flex flex-col sm:flex-row gap-0 rounded-lg overflow-hidden border" style={{ borderColor: styles.color.border }}>
              <div className="w-full sm:w-[35%] shrink-0 bg-gray-50/50 p-6 sm:p-8 border-b sm:border-b-0 sm:border-r" style={{ borderColor: styles.color.border }}>
                <div className="mb-8 hidden sm:block">
                   <div dangerouslySetInnerHTML={{ __html: renderMarkdown(parsedResume.header) }} />
                </div>
                {leftColSections.map(renderSection)}
              </div>
              <div className="w-full sm:w-[65%] p-6 sm:p-8 bg-white">
                <div className="mb-8 sm:hidden">
                   <div dangerouslySetInnerHTML={{ __html: renderMarkdown(parsedResume.header) }} />
                </div>
                {mainColSectionsLeft.map(renderSection)}
              </div>
            </div>
          )}

          {templateConfig.layout === "sidebar-right" && (
            <div className="flex flex-col sm:flex-row gap-8 mt-6">
              <div className="w-full sm:w-[65%]">
                <div className="mb-8 border-b pb-6" style={{ borderColor: styles.color.border }}>
                   <div dangerouslySetInnerHTML={{ __html: renderMarkdown(parsedResume.header) }} />
                </div>
                {mainColSectionsRight.map(renderSection)}
              </div>
              <div className="w-full sm:w-[35%] shrink-0">
                <div className="bg-gray-50 p-6 rounded-xl border" style={{ borderColor: styles.color.border }}>
                  {rightColSections.map(renderSection)}
                </div>
              </div>
            </div>
          )}

          {templateConfig.layout === "two-column" && (
            <div className="flex flex-col">
              <div className="mb-8 border-b-2 pb-6" style={{ borderColor: styles.color.border }}>
                 <div dangerouslySetInnerHTML={{ __html: renderMarkdown(parsedResume.header) }} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {parsedResume.sections.map((section) => (
                  <div key={`card-${section.id}`} className="shadow-sm border p-6 rounded-xl bg-white flex flex-col" style={{ borderColor: styles.color.border }}>
                    {renderSection(section)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
