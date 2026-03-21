import type { ReactNode } from "react";

type MarkdownPreviewProps = {
  source: string;
};

type MarkdownBlock =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "unordered-list"; items: string[] }
  | { type: "ordered-list"; items: string[] }
  | { type: "code"; language: string; content: string };

function renderInline(text: string) {
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]*\))/g).filter(Boolean);

  return tokens.map((token, index) => {
    if (/^\*\*[^*]+\*\*$/.test(token)) {
      return <strong key={`${token}-${index}`}>{token.slice(2, -2)}</strong>;
    }

    if (/^`[^`]+`$/.test(token)) {
      return <code key={`${token}-${index}`}>{token.slice(1, -1)}</code>;
    }

    const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]*)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      return (
        <a key={`${token}-${index}`} href={href} target="_blank" rel="noreferrer">
          {label}
        </a>
      );
    }

    return token;
  });
}

function parseMarkdown(source: string): MarkdownBlock[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const currentLine = lines[index];
    const trimmed = currentLine.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    const codeStart = trimmed.match(/^```(.*)$/);
    if (codeStart) {
      const language = codeStart[1].trim();
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }

      if (index < lines.length) {
        index += 1;
      }

      blocks.push({
        type: "code",
        language,
        content: codeLines.join("\n"),
      });
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2].trim(),
      });
      index += 1;
      continue;
    }

    if (/^[-*+]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*+]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*+]\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "unordered-list", items });
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "ordered-list", items });
      continue;
    }

    const paragraphLines: string[] = [];
    while (index < lines.length) {
      const paragraphLine = lines[index];
      const paragraphTrimmed = paragraphLine.trim();

      if (
        !paragraphTrimmed ||
        /^```/.test(paragraphTrimmed) ||
        /^(#{1,6})\s+/.test(paragraphTrimmed) ||
        /^[-*+]\s+/.test(paragraphTrimmed) ||
        /^\d+\.\s+/.test(paragraphTrimmed)
      ) {
        break;
      }

      paragraphLines.push(paragraphTrimmed);
      index += 1;
    }

    if (paragraphLines.length > 0) {
      blocks.push({
        type: "paragraph",
        text: paragraphLines.join(" "),
      });
      continue;
    }

    index += 1;
  }

  return blocks;
}

export function MarkdownPreview({ source }: MarkdownPreviewProps) {
  const blocks = parseMarkdown(source);

  return (
    <article className="note-prose">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          if (block.level === 1) {
            return <h1 key={index}>{renderInline(block.text)}</h1>;
          }
          if (block.level === 2) {
            return <h2 key={index}>{renderInline(block.text)}</h2>;
          }
          return <h3 key={index}>{renderInline(block.text)}</h3>;
        }

        if (block.type === "unordered-list") {
          return (
            <ul key={index}>
              {block.items.map((item) => (
                <li key={item}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }

        if (block.type === "ordered-list") {
          return (
            <ol key={index}>
              {block.items.map((item) => (
                <li key={item}>{renderInline(item)}</li>
              ))}
            </ol>
          );
        }

        if (block.type === "code") {
          return (
            <pre key={index}>
              <code>{block.content}</code>
            </pre>
          );
        }

        return <p key={index}>{renderInline(block.text)}</p>;
      })}
    </article>
  );
}