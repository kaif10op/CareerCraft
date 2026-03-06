"use client";

interface ResumePreviewProps {
  content: string;
}

export default function ResumePreview({ content }: ResumePreviewProps) {
  // Simple markdown-to-HTML converter for resume display
  const renderMarkdown = (md: string) => {
    let html = md
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-800 mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-900 mt-6 mb-3 pb-2 border-b-2 border-violet-200">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mb-1">$1</h1>')
      // Bold and italic
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="italic">$1</strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Bullet points
      .replace(/^[-*] (.*$)/gim, '<li class="text-gray-700 ml-4 mb-1">$1</li>')
      // Horizontal rules
      .replace(/^---$/gim, '<hr class="my-4 border-gray-200" />')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-violet-600 hover:underline">$1</a>')
      // Line breaks (double newline = paragraph)
      .replace(/\n\n/g, '</p><p class="mb-2">')
      // Single line breaks
      .replace(/\n/g, "<br />");

    // Wrap list items in ul
    html = html.replace(
      /(<li.*?<\/li>(\s*<br \/>)?)+/g,
      '<ul class="list-disc mb-3">$&</ul>'
    );

    return `<p class="mb-2">${html}</p>`;
  };

  const handlePrint = () => {
    window.print();
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
        className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-[800px] mx-auto"
      >
        <div
          className="resume-preview prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
        />
      </div>
    </div>
  );
}
