"use client";

import { templates } from "@/config/templates";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export type ResumeTemplate = string;

interface ResumePreviewProps {
  content: string;
  template?: ResumeTemplate;
}

export default function ResumePreview({ content, template = 'modern' }: ResumePreviewProps) {
  // Styles based on selected template config
  const templateConfig = templates.find(t => t.id === template) || templates[0];
  const styles = templateConfig.styles;

  // Optimized Markdown Component
  const Markdown = ({ children, className = "" }: { children: string, className?: string }) => {
    return (
      <div className={className}>
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: ({ node, ...props }) => {
              const hasExplicitColor = styles.h1.includes('text-white') || styles.h1.includes('text-gray-') || styles.h1.includes('text-black');
              const colorStyle = hasExplicitColor ? {} : { color: styles.color.heading };
              return <h1 className={styles.h1} style={colorStyle} {...props} />;
            },
            h2: ({ node, ...props }) => (
              <h2 className={styles.h2} style={{ color: styles.color.heading, borderColor: styles.color.border }} {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className={styles.h3} style={{ color: styles.color.heading }} {...props} />
            ),
            hr: ({ node, ...props }) => (
              <hr className={styles.hr} style={{ borderColor: styles.color.border }} {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="mb-4 leading-relaxed whitespace-pre-wrap" style={{ color: styles.color.text }} {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc mb-6 ml-4" style={{ color: styles.color.text }} {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal mb-6 ml-4" style={{ color: styles.color.text }} {...props} />
            ),
            li: ({ node, ...props }) => {
              // Check if content is bold (likely a sub-header/title bullet)
              const hasBold = Array.isArray(props.children) && 
                props.children.some((child: any) => child?.type === 'strong' || (typeof child === 'string' && child.includes('**')));
              const liClass = hasBold ? "ml-4 mb-3 pl-2 leading-relaxed list-none font-semibold" : "ml-4 mb-2 pl-2 list-[circle]";
              return <li className={liClass} style={{ color: styles.color.text }} {...props} />;
            },
            strong: ({ node, ...props }) => (
              <strong style={{ color: styles.color.heading }} {...props} />
            ),
            em: ({ node, ...props }) => (
              <em style={{ color: styles.color.muted }} {...props} />
            ),
            a: ({ node, ...props }) => (
              <a target="_blank" rel="noopener noreferrer" className="hover:underline font-medium relative z-10" style={{ color: 'inherit' }} {...props} />
            ),
          }}
        >
          {children}
        </ReactMarkdown>
      </div>
    );
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

    // Clean up duplicated header lines
    const headerLines = headerText.split('\n');
    const uniqueHeaderLines = headerLines.filter((line, index, self) => {
      const cleanLine = line.replace(/^#+\s*/, '').trim().toLowerCase();
      if (!cleanLine) return true;
      const firstIndex = self.findIndex(l => l.replace(/^#+\s*/, '').trim().toLowerCase() === cleanLine);
      return index === firstIndex;
    });
    headerText = uniqueHeaderLines.join('\n');

    // Parse the rest into sections split by '## ' 
    const sections: { id: string; title: string; content: string }[] = [];
    if (restText) {
      const sectionSplits = restText.split(/^(?=##\s+)/m).filter(Boolean);
      
      sectionSplits.forEach(section => {
        const cleanSection = section.replace(/^##\s+/, '');
        const firstNewLineIdx = cleanSection.indexOf('\n');
        if (firstNewLineIdx === -1) {
          sections.push({
            id: cleanSection.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            title: cleanSection.trim(),
            content: ""
          });
        } else {
          const title = cleanSection.substring(0, firstNewLineIdx).trim();
          const content = cleanSection.substring(firstNewLineIdx).trim();
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

  // Helper for layouts
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
    return (
      <div key={section.id} className="mb-2">
        <Markdown>{`## ${section.title}\n${section.content}`}</Markdown>
      </div>
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
              <Markdown>{parsedResume.header}</Markdown>
              {parsedResume.sections.map(renderSection)}
            </div>
          )}

          {templateConfig.layout === "executive" && (
            <div className="flex flex-col mx-auto max-w-[95%]">
              <div className="text-center mb-8 pb-4 border-b-2" style={{ borderColor: styles.color.border }}>
                 <Markdown className="[&_h1]:text-center [&_p]:text-center">{parsedResume.header}</Markdown>
              </div>
              {parsedResume.sections.map(renderSection)}
            </div>
          )}

          {templateConfig.layout === "split-header" && (
            <div className="flex flex-col">
              <div className="bg-gray-100 p-8 rounded-lg mb-8 border-l-8" style={{ borderColor: styles.color.heading }}>
                 <Markdown>{parsedResume.header}</Markdown>
              </div>
              {parsedResume.sections.map(renderSection)}
            </div>
          )}

          {templateConfig.layout === "sidebar-left" && (
            <div className="flex flex-col sm:flex-row gap-0 rounded-lg overflow-hidden border" style={{ borderColor: styles.color.border }}>
              <div className="w-full sm:w-[32%] shrink-0 bg-gray-50/50 p-6 sm:p-8 border-b sm:border-b-0 sm:border-r" style={{ borderColor: styles.color.border, minHeight: '100%' }}>
                <div className="mb-8 hidden sm:block">
                   <Markdown>{parsedResume.header}</Markdown>
                </div>
                {leftColSections.map(renderSection)}
              </div>
              <div className="w-full sm:w-[68%] p-6 sm:p-8 bg-white" style={{ minHeight: '100%' }}>
                <div className="mb-8 sm:hidden">
                   <Markdown>{parsedResume.header}</Markdown>
                </div>
                {mainColSectionsLeft.map(renderSection)}
              </div>
            </div>
          )}

          {templateConfig.layout === "sidebar-right" && (
            <div className="flex flex-col sm:flex-row gap-8 mt-6">
              <div className="w-full sm:w-[68%]">
                <div className="mb-8 border-b pb-6" style={{ borderColor: styles.color.border }}>
                   <Markdown>{parsedResume.header}</Markdown>
                </div>
                {mainColSectionsRight.map(renderSection)}
              </div>
              <div className="w-full sm:w-[32%] shrink-0">
                <div className="bg-gray-50 p-6 rounded-xl border h-full" style={{ borderColor: styles.color.border }}>
                  {rightColSections.map(renderSection)}
                </div>
              </div>
            </div>
          )}

          {templateConfig.layout === "two-column" && (
            <div className="flex flex-col">
              <div className="mb-8 border-b-2 pb-6" style={{ borderColor: styles.color.border }}>
                 <Markdown>{parsedResume.header}</Markdown>
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
