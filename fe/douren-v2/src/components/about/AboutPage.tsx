import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeftIcon, CheckIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import { OWNERS, type OwnerProfile } from "@/components/about/owners";

const COPIED_RESET_MS = 1500;
const SERIF = { fontFamily: "'Noto Serif TC', serif" };

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const sectionLabelClassName =
  "text-[10px] font-mono uppercase tracking-[0.18em] text-archive-text/60";

const linkClassName =
  "inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono border border-archive-border text-archive-text/70 hover:border-archive-accent hover:text-archive-accent transition-colors duration-300 cursor-pointer";

const DiscordCopyButton: React.FC<{ discordName: string }> = ({
  discordName,
}) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(discordName);
    } catch {
      return;
    }
    setCopied(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(
      () => setCopied(false),
      COPIED_RESET_MS,
    );
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={linkClassName}
      aria-label={`複製 Discord 名稱 ${discordName}`}
    >
      {copied ? <CheckIcon size={13} /> : <FaDiscord size={13} />}
      {copied ? "已複製 Discord 名稱" : discordName}
    </button>
  );
};

export const OwnerCard: React.FC<{ owner: OwnerProfile; index: number }> = ({
  owner,
  index,
}) => {
  const description = owner.description?.trim();

  return (
    <motion.article
      variants={fadeUp}
      custom={0.2 + index * 0.08}
      initial="hidden"
      animate="show"
      className="group relative flex flex-col gap-6 border border-archive-border p-6 md:p-8 transition-colors duration-500 hover:border-archive-accent/60"
    >
      <div className="flex items-start justify-between gap-4">
        <div
          aria-hidden="true"
          className="flex h-16 w-16 shrink-0 items-center justify-center bg-archive-border/30 text-2xl text-archive-text/80 transition-colors duration-500 group-hover:bg-archive-accent/10 group-hover:text-archive-accent"
          style={SERIF}
        >
          {owner.name.slice(0, 1)}
        </div>
        <span className="text-[11px] font-mono text-archive-text/25 tracking-[0.15em] uppercase select-none">
          No.{String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <h2
          className="text-2xl md:text-3xl font-medium text-archive-text leading-tight tracking-tight"
          style={SERIF}
        >
          {owner.name}
        </h2>
        <p className="text-xs font-mono text-archive-accent tracking-wide">
          {owner.title}
        </p>
      </div>
      {description ? (
        <p className="text-sm text-archive-text/75 leading-[1.9]" style={SERIF}>
          {description}
        </p>
      ) : null}
      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-archive-border pt-5">
        {owner.twitterLink ? (
          <a
            href={owner.twitterLink}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
          >
            <FaTwitter size={13} />
            {owner.twitterName || "Twitter"}
          </a>
        ) : null}
        {owner.githubLink ? (
          <a
            href={owner.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
          >
            <FaGithub size={13} />
            {owner.githubName || "GitHub"}
          </a>
        ) : null}
        {owner.discordName ? (
          <DiscordCopyButton discordName={owner.discordName} />
        ) : null}
      </div>
    </motion.article>
  );
};

export const AboutPage: React.FC = () => (
  <div className="py-6">
    <motion.div
      variants={fadeUp}
      custom={0}
      initial="hidden"
      animate="show"
      className="flex items-center justify-between mb-10 md:mb-16"
    >
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-mono text-archive-text/45 hover:text-archive-text transition-colors duration-300 group"
      >
        <ArrowLeftIcon
          size={13}
          className="transition-transform duration-300 group-hover:-translate-x-0.5"
        />
        返回首頁
      </Link>
      <span className="text-[11px] font-mono text-archive-text/25 tracking-[0.15em] uppercase select-none">
        About
      </span>
    </motion.div>

    <motion.section
      variants={fadeUp}
      custom={0.05}
      initial="hidden"
      animate="show"
      className="mb-14 md:mb-20 max-w-3xl"
    >
      <h1
        className="text-4xl md:text-5xl lg:text-6xl font-medium text-archive-text leading-[1.1] tracking-tight mb-8"
        style={SERIF}
      >
        關於我們
      </h1>
      <p
        className="text-base md:text-lg text-archive-text/80 leading-[1.9] border-l-2 border-archive-accent/40 pl-6"
        style={SERIF}
      >
        同人檔案館整理動漫展會與同人活動的創作者名錄，讓你在出發前就能瀏覽、搜尋並收藏喜愛的創作者。
      </p>
    </motion.section>

    <motion.div
      variants={fadeUp}
      custom={0.12}
      initial="hidden"
      animate="show"
      className="border-t border-archive-border mb-10 md:mb-12"
    />

    <section>
      <motion.div
        variants={fadeUp}
        custom={0.15}
        initial="hidden"
        animate="show"
        className="flex items-baseline justify-between mb-6"
      >
        <span className={sectionLabelClassName}>團隊成員</span>
        <span className="text-[11px] font-mono text-archive-text/50">
          {OWNERS.length} 位成員
        </span>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {OWNERS.map((owner, index) => (
          <OwnerCard key={owner.name} owner={owner} index={index} />
        ))}
      </div>
    </section>

    <motion.p
      variants={fadeUp}
      custom={0.4}
      initial="hidden"
      animate="show"
      className="mt-12 md:mt-16 text-sm font-mono text-archive-text/50 leading-relaxed"
    >
      資料有誤或想提供創作者資訊？歡迎透過 Twitter 或 Discord 與我們聯繫。
    </motion.p>
  </div>
);
