import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Play, RotateCcw, TerminalSquare } from "lucide-react";
import { demoBins, demoClips } from "./demoLibrary";

type CliMode = "search" | "clip" | "bin";

const quote = (value: string) => JSON.stringify(value);

const searchNeedle = (text: string) => {
  const subject = text.split(" — ")[0].split("\n")[0].trim();
  return subject.length > 54 ? `${subject.slice(0, 51)}…` : subject;
};

export function CliTerminal() {
  const [clipId, setClipId] = useState(demoClips[0].id);
  const [mode, setMode] = useState<CliMode>("search");
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const runTimer = useRef<number | undefined>(undefined);
  const copiedTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => {
    window.clearTimeout(runTimer.current);
    window.clearTimeout(copiedTimer.current);
  }, []);

  const clip = demoClips.find(candidate => candidate.id === clipId) ?? demoClips[0];
  const clipNumber = demoClips.findIndex(candidate => candidate.id === clip.id) + 1;
  const bin = demoBins.find(candidate => candidate.id === clip.bin) ?? demoBins[0];
  const binNumber = demoBins.findIndex(candidate => candidate.id === bin.id) + 1;
  const binCount = useMemo(() => demoClips.filter(candidate => candidate.bin === bin.id).length, [bin.id]);
  const needle = searchNeedle(clip.text);

  const commands: Record<CliMode, string> = {
    search: `pasted search ${quote(needle)} --json`,
    clip: `pasted clip get ${clipNumber} --json`,
    bin: `pasted bin clips ${binNumber} --json`,
  };

  const output = mode === "search" ? [
    `{`,
    `  "schemaVersion": 1,`,
    `  "totalCount": 1,`,
    `  "limit": 100, "offset": 0,`,
    `  "items": [{`,
    `    "id": ${clipNumber}, "clip_type": ${quote(clip.clipType.toLowerCase())},`,
    `    "content_type": ${quote(clip.contentType)},`,
    `    "source": ${quote(clip.app)},`,
    `    "text_content": ${quote(clip.text)}`,
    `  }]`,
    `}`,
  ] : mode === "clip" ? [
    `{`,
    `  "id": ${clipNumber},`,
    `  "clip_type": ${quote(clip.clipType.toLowerCase())},`,
    `  "content_type": ${quote(clip.contentType)},`,
    `  "source": ${quote(clip.app)},`,
    `  "text_content": ${quote(clip.text)},`,
    `  "is_pinned": ${clip.id === "insult-swordfighting" ? "true" : "false"},`,
    `  "is_protected": ${clip.id === "hamster-warning" ? "true" : "false"}`,
    `}`,
  ] : [
    `{`,
    `  "id": ${binNumber}, "name": ${quote(bin.name)},`,
    `  "kind": ${quote(bin.kind)}, "clipCount": ${binCount},`,
    `  "items": [${clipNumber}, …]`,
    `}`,
  ];

  const run = () => {
    window.clearTimeout(runTimer.current);
    setRunning(true);
    runTimer.current = window.setTimeout(() => setRunning(false), 520);
  };

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(commands[mode]);
      setCopied(true);
      window.clearTimeout(copiedTimer.current);
      copiedTimer.current = window.setTimeout(() => setCopied(false), 1300);
    } catch {
      setCopied(false);
    }
  };

  const nextExample = () => setClipId(demoClips[(clipNumber + 10) % demoClips.length].id);

  return (
    <div className="terminal live-terminal" aria-label="Interactive Pasted command line preview">
      <div className="terminal-bar">
        <span className="traffic red"/><span className="traffic yellow"/><span className="traffic green"/>
        <small><TerminalSquare/> pasted — zsh — 118×34</small>
        <span className="terminal-local"><i/> SAME LOCAL LIBRARY</span>
      </div>
      <div className="terminal-tabs" aria-label="CLI command examples">
        {(["search", "clip", "bin"] as const).map(value => <button type="button" className={mode === value ? "active" : ""} key={value} onClick={() => setMode(value)}>{value}</button>)}
        <button type="button" className="terminal-copy" onClick={copyCommand}>{copied ? <Check/> : <Copy/>}{copied ? "COPIED" : "COPY COMMAND"}</button>
      </div>
      <div className="terminal-session">
        <div className="terminal-command"><span className="prompt">❯</span><code>{commands[mode]}</code><button type="button" onClick={run} aria-label="Run mocked CLI command">{running ? <RotateCcw/> : <Play/>}</button></div>
        <pre className={running ? "is-running" : ""} key={`${mode}-${clip.id}-${running}`}>
          {running ? <span className="terminal-working">Reading local library…</span> : output.map((line, index) => <span key={`${line}-${index}`}><i>{String(index + 1).padStart(2, "0")}</i>{line}</span>)}
        </pre>
      </div>
      <div className="terminal-link">
        <span><b>{bin.icon} {bin.name}</b><small>Real commands. Fictional research program.</small></span>
        <button type="button" onClick={nextExample}>NEXT EXAMPLE →</button>
      </div>
    </div>
  );
}
