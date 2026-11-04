# ChatGPT Organization — Data Atlas

This is an organization plan, not an applied change to the ChatGPT sidebar. Repository files do not create sections or move conversations. The user's interface supports sections and folders; the user has chosen to organize them progressively as topics arise.

## Sections and suggested folders

| Section | Suggested folders |
|---|---|
| Tech Watch | Inbox; Data Engineering & Platforms; AI, LLM & Agents; Cloud & FinOps; Architecture & DevOps; Summaries |
| Job Seeking | Job Scan; Market Radar; Skills & Gap Analysis; Summaries |
| Learning Lab | Apache Spark; SQL & Data Modeling; Streaming & Distributed Systems; Summaries |
| Data Atlas | Architecture & Mapping; Site & Design; Development & Deployment; Roadmap & Decisions |
| DE Summary | Preserve the existing organization |

Existing application and job-search folders can remain in Job Seeking. Add new subcategories only when the volume of content justifies them.

## Conversation naming

| Section | Format | Example |
|---|---|---|
| Tech Watch | `TW · [Domain] · [Topic]` | `TW · AI Agents · Harness Engineering` |
| Job Seeking | `JS · [Type] · [Topic]` | `JS · Market Radar · O’Reilly Oct 2026` |
| Learning Lab | `LL · [Technology] · [Chapter or concept]` | `LL · Spark · Shuffle` |
| Data Atlas | `ATLAS · [Subsystem] · [Topic]` | `ATLAS · GitHub · Deployment` |

Conversations are the discussion workspace. Only reviewed knowledge notes are saved as content in Data Atlas.

## Classification rules

- Medium articles belong in Tech Watch, including articles about Spark or governance.
- O’Reilly Radar Trends and job-market analysis belong in Job Seeking / Market Radar.
- eBook study notes and exercises belong in Learning Lab.
- The original 28-domain DE Summary stays unchanged. Notes reference `DE.01` through `DE.28`.
- AI Engineering is a complementary Data Atlas reference plan using `AI.01` through `AI.07`.
- eBooks remain in their current physical folders; PDFs are not moved, renamed or published.
- One note may connect several DE and AI domains through `primaryTopic` and `relatedTopics`.

## From discussion to a note

Discuss and review a source, write a Markdown entry in `src/content/entries/`, add its topic references and translations, validate it, then publish the reviewed changes to GitHub. Use the compiled local export now; Cloudflare deployment remains deferred.

ChatGPT conversations and OneDrive PDFs are not automatically synchronized by this version.
