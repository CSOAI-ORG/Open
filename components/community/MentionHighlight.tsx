import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';

interface MentionHighlightProps {
  content: string;
}

/**
 * Component that highlights @mentions in forum content
 * Converts @username to a styled badge
 * Uses DOMPurify to sanitize HTML and prevent XSS attacks
 */
export function MentionHighlight({ content }: MentionHighlightProps) {
  // Replace @mentions with styled spans
  const highlightMentions = (text: string) => {
    const mentionRegex = /@([a-zA-Z0-9_.-]+)/g;
    
    return text.replace(
      mentionRegex,
      '<span class="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium text-sm">@$1</span>'
    );
  };

  const processedContent = highlightMentions(content);

  // Configure DOMPurify to allow specific tags and attributes for mention styling
  const sanitizeConfig = {
    ALLOWED_TAGS: ['span', 'p', 'br', 'strong', 'em', 'a', 'code', 'pre', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['class', 'href', 'target', 'rel'],
  };

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <ReactMarkdown
        components={{
          // Allow HTML for mention highlighting with XSS protection
          p: ({ children }) => (
            <p 
              dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(String(children), sanitizeConfig) 
              }} 
            />
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
