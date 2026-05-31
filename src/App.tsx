import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import {
  ArrowUpRight,
  BadgeCheck,
  BrainCircuit,
  ChartNoAxesCombined,
  Disc3,
  FolderKanban,
  Instagram,
  Link2,
  Mail,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';

import mxpLogo from './assets/mxpLogo.png';
import madkingLogo from './assets/madkingLogo.png';
import praxxLogo from './assets/praxxLogo.png';
import xtyloLogo from './assets/xtyloupdatedlogo.jpg';

function getInstagramHandle(url: string) {
  try {
    const normalized = url.startsWith('http') ? url : `https://${url}`;
    const parsed = new URL(normalized);
    const parts = parsed.pathname.split('/').filter(Boolean);
    const last = parts.length ? parts[parts.length - 1] : '';
    return last ? `@${last}` : 'Instagram';
  } catch {
    return 'Instagram';
  }
}

const coreExpertise = [
  'Competitive Strategy & Analysis',
  'Team Coordination & Macro Understanding',
  'Mental Wellbeing',
  'Rotation & Resource Management',
  'Performance Improvement Support',
  'Tactical & Match Breakdown',
];

const exposure = [
  {
    season: 'FFMIC Spring 2026',
    team: 'GGI',
    result: 'Top 9',
    note: 'Data & analysis support',
  },
  {
    season: 'FFMIC Spring 2026',
    team: '4Ends',
    result: 'Top 17',
    note: 'Direct competitive support',
  },
  {
    season: 'FFMIC Spring 2026',
    team: 'DW Live',
    result: 'Top 36',
    note: 'Data & analysis support',
  },
  {
    season: 'FFWS Nepal Spring 2026',
    team: 'PNL',
    result: 'Top 10',
    note: 'Direct competitive support',
  },
  {
    season: 'FFWS Nepal Spring 2026',
    team: 'DG',
    result: 'Top 11',
    note: 'Data & analysis support',
  },
];

const collaborators = ['Coach Ceara - Rush esports BR', 'Coach Ribas - Ex-Rush esports BR', 'Analyst Yash - StatLab'];

const mxpBio =
  'MXP is a professional esports support and strategy panel focused on building smarter, stronger, and more prepared competitive teams. Our vision is to bring a systematic and advanced approach to esports through tactical planning, fight analysis, utility systems, mental gameplay, and player development. We believe modern esports is not only about mechanics, but also about preparation quality, decision-making, coordination, and mental strength. Through MXP, our goal is to help teams unlock their full competitive potential and compete at the highest level with structure, clarity, and purpose.';

const madkingBio =
  'Strategic analyst specialized in trap setups, time trapping, and opponent reading. Passionate about creating pressure-based strategies that break enemy mental strength through unpredictable movements, controlled timings, and tactical gameplay.';

const xtyloBio =
  'Professional esports coach and strategist with experience across Free Fire Max, Clash Royale and Clash of Clans competitive esports. Specialized in tactical systems, fight analysis, utility usage, preparation structure, mental gameplay, and player mental wellbeing. Worked with multiple teams across different servers, contributing to regional achievements and advanced competitive approaches.';

const praxxBio =
  'Focused on gameplay data, performance insights, and team analysis. Specialized in zone prediction, early-game strategies, drop splits, end-game chaos management, and identifying team weaknesses. Uses data-driven decisions to improve coordination, fight quality, and overall competitive consistency.';

const sampleWork = [
  {
    title: 'Sample Work',
    description: 'Esports gameplay reviews, tactical preparation notes, tournament rotation support, and data-driven performance analysis.',
    label: 'Open Drive Folder',
    driveLink: 'https://drive.google.com/drive/folders/1fKKHNDet9H4XF1jqpB0hJH7rO7ooLn1r?usp=drive_link',
  },
];

const members = [
  {
    name: 'MadKing',
    role: 'Analyst',
    color: 'amber',
    email: 'analyst.madking@gmail.com',
    instagram: 'https://www.instagram.com/madking21_ff/',
    discord: 'madking21_ff',
    discordUrl: 'https://discord.com/invite/3GvEdJcyWM',
    bio: madkingBio,
    logo: madkingLogo,
  },
  {
    name: 'Xtylo',
    role: 'Coach',
    color: 'cyan',
    email: 'coachxtylo@gmail.com',
    instagram: 'https://www.instagram.com/coach_xtylo/',
    discord: 'coach_xtylo',
    discordUrl: 'https://discord.com/invite/Yzy29N8HGn',
    bio: xtyloBio,
    logo: xtyloLogo,
  },
  {
    name: 'Praxx',
    role: 'Analyst',
    color: 'green',
    email: 'analyst.praxx@gmail.com',
    instagram: 'https://www.instagram.com/praxx.analyst/',
    discord: 'praxx.aanayst',
    discordUrl: 'https://discord.com/invite/m3MtzWGTQE',
    bio: praxxBio,
    logo: praxxLogo,
  },
] as const;

function buildMailto(recipient: string, form: HTMLFormElement) {
  const data = new FormData(form);
  const name = String(data.get('name') ?? '').trim();
  const reply = String(data.get('reply') ?? '').trim();
  const subjectValue = String(data.get('subject') ?? '').trim();
  const message = String(data.get('message') ?? '').trim();

  const subject = encodeURIComponent(subjectValue || 'MXP portfolio inquiry');
  const body = encodeURIComponent(
    [
      name ? `Name: ${name}` : 'Name: ',
      reply ? `Reply email: ${reply}` : 'Reply email: ',
      '',
      message || 'Write your message here.',
    ].join('\n'),
  );

  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
}

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const progress = window.scrollY / totalHeight;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.section'));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!(entry.target instanceof HTMLElement)) continue;
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        }
      },
      { root: null, rootMargin: '-10% 0px -25% 0px', threshold: 0.15 },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const recipient = String(data.get('recipient') ?? members[0].email);
    buildMailto(recipient, form);
  };

  return (
    <div className="page-shell" id="top">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <div className="ambient ambient-c" />

      <div 
        className="scroll-background-emblem" 
        style={{
          opacity: Math.min(scrollProgress * 0.22, 0.12),
          transform: `translate(-50%, -50%) scale(${1.0 + scrollProgress * 0.2}) rotate(${scrollProgress * 20}deg)`,
        }}
      >
        <img src={mxpLogo} alt="" className="disrupted-logo-img" />
      </div>

      <header className="topbar">
        <a className="brand" href="#top" aria-label="MXP portfolio home">
          <span className="brand-mark">
            <img src={mxpLogo} alt="MXP Logo" className="brand-logo" />
          </span>
          <span className="brand-copy">
            <strong>Portfolio</strong>
            <span>Strategy | Performance | Esports Development</span>
          </span>
        </a>

        <nav className="topnav" aria-label="Section navigation">
          <a href="#about">About</a>
          <a href="#expertise">Explore expertise</a>
          <a href="#exposure">Exposure</a>
          <a href="#social">Members</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main className="content">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">
              <Sparkles size={16} />
              Built for competitive esports support
            </p>
            <h1>Smarter gameplay, stronger consistency, better competitive understanding.</h1>
            <p className="lede">
              {mxpBio}
            </p>

            <div className="hero-actions">
              <a className="button button--primary" href="#contact">
                <Mail size={16} />
                Contact the team
              </a>
              <a className="button button--secondary" href="#expertise">
                Explore expertise
                <ArrowUpRight size={16} />
              </a>
            </div>

            <div className="hero-stats" aria-label="MXP overview stats">
              <article className="stat-card">
                <span>3</span>
                <p>members in the unit</p>
              </article>
              <article className="stat-card">
                <span>6</span>
                <p>core expertise pillars</p>
              </article>
              <article className="stat-card">
                <span>5</span>
                <p>competitive exposure entries</p>
              </article>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-emblem">
              <div className="hero-emblem__ring" />
              <div className="hero-emblem__core">
                <img src={mxpLogo} alt="MXP" className="hero-emblem-img" />
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="about">
          <div className="section-head">
            <div>
              <p className="section-kicker">About MXP</p>
              <h2>Built on analysis, coordination, and performance support.</h2>
            </div>
            <p className="section-note">
              MXP works with teams to improve consistency, decision-making, rotations, resource management,
              and overall competitive performance.
            </p>
          </div>

          <div className="about-grid">
            <article className="quote-panel">
              <ShieldCheck size={18} />
              <p>{mxpBio}</p>
            </article>

            <article className="profile-panel">
              <div className="profile-panel__title">
                <ChartNoAxesCombined size={18} />
                <span>Team direction</span>
              </div>
              <p>
                The team is set up to support preparation quality, fight clarity, utility planning,
                coordination, and player mindset.
              </p>
              <div className="profile-tags">
                <span>Fight analysis</span>
                <span>Utility systems</span>
                <span>Mental gameplay</span>
                <span>Player development</span>
              </div>
            </article>
          </div>
        </section>

        <section className="section" id="expertise">
          <div className="section-head">
            <div>
              <p className="section-kicker">Core Expertise</p>
              <h2>What the team brings into a roster.</h2>
            </div>
            <p className="section-note">
              Each pillar is drawn directly from the team brief and presented as a clear capability.
            </p>
          </div>

          <div className="expertise-grid">
            {coreExpertise.map((item) => (
              <article className="mini-card" key={item}>
                <Target size={18} />
                <h3>{item}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="exposure">
          <div className="section-head">
            <div>
              <p className="section-kicker">Competitive Exposure</p>
              <h2>Recent placements and support roles.</h2>
            </div>
            <p className="section-note" />
          </div>

          <div className="exposure-grid">
            {exposure.map((entry) => (
              <article className="exposure-card" key={`${entry.season}-${entry.team}`}>
                <div className="exposure-card__top">
                  <span>{entry.season}</span>
                  <BadgeCheck size={18} />
                </div>
                <h3>{entry.team}</h3>
                <p className="exposure-result">{entry.result}</p>
                <p className="exposure-note">{entry.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="collaborators">
          <div className="section-head">
            <div>
              <p className="section-kicker">Professional Collaborations</p>
              <h2>Names connected to the MXP network.</h2>
            </div>
            <p className="section-note" />
          </div>

          <div className="collab-list">
            {collaborators.map((item) => (
              <article className="collab-item" key={item}>
                <Users size={18} />
                <span>{item}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="sample-work">
          <div className="section-head">
            <div>
              <p className="section-kicker">Sample Work</p>
              <h2>Esports analysis and tactical preparations.</h2>
            </div>
            <p className="section-note" />
          </div>

          <div className="sample-grid">
            {sampleWork.map((item) => (
              <article className="sample-card" key={item.title}>
                <div className="sample-card__top">
                  <FolderKanban size={18} />
                  <span>{item.title}</span>
                </div>
                <p>{item.description}</p>
                {item.driveLink ? (
                  <a className="sample-link" href={item.driveLink} target="_blank" rel="noreferrer">
                    <Link2 size={16} />
                    {item.label}
                  </a>
                ) : (
                  <span className="sample-link sample-link--empty">
                    <Link2 size={16} />
                    {item.label} - paste Drive URL here
                  </span>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="social">
          <div className="section-head">
            <div>
              <p className="section-kicker">Individual Space</p>
              <h2>One block for each teammate.</h2>
            </div>
            <p className="section-note" />
          </div>

          <div className="member-grid">
              {members.map((member) => (
                <article className={`member-card member-card--${member.color}`} key={member.name}>
                  <div className="member-card__header">
                    <div className="member-mark">
                      <img src={member.logo} alt={`${member.name} logo`} className="member-logo" />
                    </div>
                    <div>
                      <h3>{member.name}</h3>
                      <p>{member.role}</p>
                    </div>
                  </div>

                  <p className="member-bio">{member.bio}</p>

                <div className="member-social-buttons" aria-label={`${member.name} social links`}>
                  <a
                    className="social-pill social-pill--email"
                    href={`mailto:${member.email}`}
                    title={member.email}
                    aria-label={`Email ${member.name}`}
                  >
                    <Mail size={18} />
                    Email
                  </a>
                  <a
                    className="social-pill social-pill--instagram"
                    href={member.instagram}
                    target="_blank"
                    rel="noreferrer"
                    title={member.instagram}
                    aria-label={`Open ${member.name} Instagram`}
                  >
                    <Instagram size={18} />
                    Instagram
                  </a>
                  <a
                    className="social-pill social-pill--discord"
                    href={member.discordUrl}
                    target="_blank"
                    rel="noreferrer"
                    title={member.discordUrl}
                    aria-label={`Open ${member.name} Discord server`}
                  >
                    <MessageCircle size={18} />
                    Discord
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="section-head">
            <div>
              <p className="section-kicker">Contact</p>
              <h2>Open an email to the teammate you want to reach.</h2>
            </div>
            <p className="section-note" />
          </div>

          <div className="contact-layout">
            <article className="contact-panel">
              <div className="contact-panel__title">
                <MessageCircle size={18} />
                <span>Email system</span>
              </div>

              <form className="contact-form" onSubmit={handleSubmit}>
                <label className="field">
                  <span>Your name</span>
                  <input name="name" type="text" placeholder="Your name" />
                </label>

                <label className="field">
                  <span>Your email</span>
                  <input name="reply" type="email" placeholder="your@email.com" />
                </label>

                <label className="field">
                  <span>Recipient</span>
                  <select name="recipient" defaultValue={members[0].email}>
                    {members.map((member) => (
                      <option key={member.email} value={member.email}>
                        {member.name} - {member.role}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  <span>Subject</span>
                  <input name="subject" type="text" placeholder="Project, collaboration, or team inquiry" />
                </label>

                <label className="field field--full">
                  <span>Message</span>
                  <textarea
                    name="message"
                    rows={6}
                    placeholder="Write the message you want to send to the team."
                  />
                </label>

                <button className="button button--primary button--submit" type="submit">
                  <Send size={16} />
                  Open email client
                </button>
              </form>
            </article>

            <div className="contact-stack">
              {members.map((member) => (
                <article className={`contact-card contact-card--${member.color}`} key={member.email}>
                  <div className="contact-card__top">
                    <span>{member.name}</span>
                    <small>{member.role}</small>
                  </div>
                  <a href={`mailto:${member.email}`} title={member.email}>
                    Email {member.name}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
