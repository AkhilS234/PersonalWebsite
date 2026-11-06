export const portfolio = {
  name: 'Akhil Vishnubhotla',
  headline: "Hi, I’m Akhil.",
  subheadline: 'Software engineer building thoughtful tools at the intersection of technology and real-world problems.',
  supporting: 'From complex workflows to meaningful insights, I like making the complicated feel simple.',
  // TODO: Add confirmed email, public profiles, and résumé URL. Unset links are hidden.
  links: { email: 'akhil.vishnubhotla1@gmail.com', github: '', linkedin: '', resume: '' },
  // TODO: Confirm all draft biography, education, experience and project descriptions before public sharing.
  about: ["I’m an applied AI engineer studying Computer Science and Mathematics at Rutgers University. I build AI systems that connect models to real workflows, with a focus on the engineering that makes them reliable: evaluation, backend infrastructure, and human oversight.", "At MetaFloor.ai, I build multi-agent systems for supply-chain decisions. Previously, at Biomet.life, I worked on extracting information from sustainability reports and using it to improve emissions forecasts. My projects range from CUDA attention kernels to vision-language models and financial sentiment backtesting. I like working across the stack, from how a model runs to how people use it."],
  education: 'Rutgers University — Computer Science & Mathematics',
  skills: ['Software engineering', 'Applied AI / ML', 'Full-stack systems', 'Product-minded development'],
  experience: [
    {
        "company": "MetaFloor.ai",
        "role": "Applied AI Engineer Intern",
        "period": "June 2026 – Present",
        "bullets": [
            "Designed a two-layer LangGraph platform for 36 manufacturing and supply-chain decisions: one orchestrator splits requests into up to five parallel use-case jobs, with human review of both the split and each proposed plan.",
            "Built reliability around Postgres job leases, per-thread advisory locks, first-decision-wins approvals, versioned checkpoints and deterministic ERP write verification; the October 2026 write-up reports 900 passing tests.",
            "Designed reproducible synthetic evaluations, code-computed answer keys and scripted human reviewers. The audited held-out gate passed 10/45 runs (22.2%); verification caught 3/3 incorrect human actions. The platform remains simulation-validated, with customer-specific evaluation required before rollout."
        ]
    },
    {
        "company": "Biomet.life",
        "role": "Machine Learning Engineer Intern",
        "period": "June 2025 – August 2025",
        "bullets": [
            "Built a multi-stage LangChain pipeline using prompt-engineered GPT-4o calls to extract structured data from sustainability reports for 15 automakers, with schema validation and automatic retries for malformed LLM outputs",
            "Added LLM-derived sentiment features to an emissions forecasting model, raising out-of-sample R² from 0.40 to 0.76; ablation studies confirmed disclosure language added signal beyond financial and production data"
        ]
    }
],
  projects: [
{
    "title": "Human-in-the-Loop Agent Platform for Manufacturing",
    "period": "MetaFloor.ai · June 2026 – Present",
    "category": "Featured engineering case study",
    "bullets": [
        "Turns plain-language requests into human-approved, verified ERP changes across a catalog of 36 manufacturing and supply-chain decisions.",
        "Separates model judgment from deterministic validation, conflict detection, execution and read-back verification. Two human checkpoints protect routing and execution.",
        "900 passing tests reported; 10/45 held-out runs passed every hard gate after a grader audit. Synthetic validation is documented alongside the remaining deployment gaps."
    ],
    "tags": [
        "Python",
        "LangGraph",
        "FastAPI",
        "Postgres",
        "ERPNext",
        "pytest / Playwright"
    ],
    "url": "",
    "caseStudy": {
    "intro": "A manufacturing planner might ask: “The CNC line is overloaded and a supplier is late. What should we change?” Answering that means looking across schedules, inventory and orders, and getting the changes right. I built this platform to help a planner work through those decisions, review the proposed plan and check that the approved changes actually reached the ERP.",
    "sections": [
        {
            "title": "From a request to a reviewed plan",
            "paragraphs": [
                "A request like that rarely maps to one decision. Balancing the CNC line and responding to a late part may need different information, and their plans may affect each other. The first job is to work out what the person is asking for, before spending time solving the wrong problem.",
                "I use an orchestrator to break the request into up to five tasks and identify which ones depend on others. A person reviews that split first. They can edit it, ask for a revision or reject it. Only after approval do the individual use-case agents start working.",
                "Each agent gathers the relevant ERP data, develops options and brings a plan back for review. Before those plans reach the reviewer, code checks whether they clash—for example, whether two plans are trying to use the same stock or work-center capacity. The person can approve or revise each part separately, so one problem does not have to hold up everything else.",
                "Once approved, the parts run in dependency order. Code carries out the supported ERP writes and reads the records back to check the result. For actions that still need a person, the run pauses and waits for them. That distinction matters: proposing a useful plan and proving that it happened are two different jobs."
            ]
        },
        {
            "title": "Keeping the moving parts manageable",
            "paragraphs": [
                "I initially considered adding a layer of domain specialists between the orchestrator and the use-case agents. But those specialists mostly repeated the routing work. With 36 decisions in the catalog, one orchestrator could see the whole catalog in a single prompt. Two layers were enough.",
                "I also wanted a simple request and a compound request to follow the same path. A request with one task is just a smaller version of a request with several. That keeps routing, approval and evaluation consistent instead of giving me two systems to maintain.",
                "Underneath that flow, the API accepts the request and saves it to Postgres. Separate workers pick up the jobs and run the agents. A model call or a wait for human approval therefore does not need to keep an API request open. Postgres holds the queue, paused graph state, approvals and audit history, keeping the coordination close to the records it protects.",
                "The same approach shaped smaller choices. Compliance search only needed roughly 120 cited regulation chunks, so I used TF-IDF retrieval rather than adding a vector database. And when execution fails halfway through, the system stops for human recovery. Automatically undoing an ERP change could be worse if someone has already acted on it."
            ]
        },
        {
            "title": "What happens when a run has to wait?",
            "paragraphs": [
                "A demo can run from start to finish in one sitting. A real approval might sit for days. By the time someone returns to it, a worker may have restarted, the ERP data may have changed, or I may have deployed new code. I needed a paused run to survive those interruptions without quietly changing what it meant.",
                "Each use-case agent follows a LangGraph workflow: detect the use case, assemble the data, develop options, ask for approval, then act. The model works inside the options step. At a human gate, LangGraph saves a checkpoint to Postgres; a worker can later resume it with the person’s decision.",
                "Saving the graph is only part of the problem. Two workers must not pick up the same job, and two approvals must not race into contradictory actions. Workers claim jobs using SKIP LOCKED and renew a heartbeat lease while they work. A separate lock protects each graph thread, while approval decisions follow a first-decision-wins rule. Changing a decision is an explicit, audited action allowed only before execution.",
                "I also check what may have changed outside the run. Approvals can expire, shared resources are checked against other requests, and writes carry idempotency keys to prevent duplication on resume. Checkpoints record the code version and hashes of the prompts, rules and tools. If those no longer match, the run refuses to continue under different assumptions.",
                "These safeguards came from concrete failures. LangGraph silently dropped state fields I had not declared, including a verification result and a flag meant to limit retries. A pooled database connection could also retain an advisory lock after an exception. I added tests for undeclared state writes and a connection-reset hook that releases leftover locks."
            ]
        },
        {
            "title": "An approval is not proof of completion",
            "paragraphs": [
                "There is another pause that is easy to overlook: the wait for a person to do the work. Only four of the 36 catalog use cases have an executor that can carry out the approved ERP change automatically. For the others, clicking “approved” is still a long way from “finished.”",
                "I made the expected change explicit. Each plan has a proposed_writes contract identifying the record, field, old value and intended new value. Code reads the starting value from the ERP and checks it again before review, so the model cannot invent what was there or act on a stale premise.",
                "After the action, the verifier reads the ERP and compares the result with that contract. A person’s completion report is useful audit information, but it does not decide whether the write succeeded. If the outcome cannot be checked, it stays human_reported_unverified.",
                "Testing that distinction caught three partial, missing or incorrect human actions. It also exposed a shipment-screening path that released lines with unknown export classifications without compliance sign-off. Those were the kinds of failures I wanted the surrounding system to catch, even when the agent or reviewer sounded confident."
            ]
        },
        {
            "title": "How I tested whether the plans were any good",
            "paragraphs": [
                "Once the workflow could carry a request through approval and execution, I needed to know whether its decisions deserved approval in the first place. A fluent explanation was not enough. I wanted scenarios where I could work out the answer independently and compare the agent’s choice against it.",
                "I built seeded synthetic generators for 35 runnable use cases. Each generator covers obvious decisions, close calls, edge cases, tempting traps and messy inputs. Some answers are computed independently; others are known because of how the scenario is constructed. A separate checker recomputes them from the raw data, and the agent never sees the answer key.",
                "The grader checks the decision, constraints, required warnings and traps. Certain failures override everything else: taking an unsafe action, falling for a trap or stating a number that cannot be traced to the inputs or a successful tool result. An LLM judge can comment on writing quality, but it does not decide whether a run passes.",
                "I tested the human interactions too. Scripted reviewers use the real approval path to approve, reject, revise, return late or report partially completed work. That lets me check whether the system handles the interaction correctly as well as whether its original plan was good.",
                "Across the five priority use cases, I built 109 development scenarios and ran two real-model evaluations, plus scripted human-review scenarios and a compound request through the app.",
                "**The bar is strict on purpose.** A run fails if it takes a trap, executes an unsafe action, misses a required warning, or states any number that can’t be traced to the inputs or a tool output. That applies even when the decision itself was right."
            ]
        },
        {
            "title": "First evaluation: right decisions, invented numbers",
            "paragraphs": [
                "The first real-model run passed 10 of 45 runs on every gate (22%). The model usually chose sensible actions, but it failed on numerical grounding: in 20 of the 35 failures, the main cause was the model stating a number it had calculated instead of one a tool gave it.",
                "Two audits came before any fix.",
                "**I audited the grader.** The first grader had passed only 2 of 45 runs. I traced all 305 fabrication flags back to the saved runs, and 248 were false positives: digits inside record IDs, display rounding, and arithmetic correctly derived from tool outputs. I fixed those cases without loosening the gates and kept the 57 genuine fabrications as regression tests. Rescoring produced the 10/45.",
                "**I audited the test set.** An ID-blind comparison, which ignores names, IDs and dates and compares the actual numbers and structure, showed that 44 of the 45 first-evaluation runs used problems that duplicated development scenarios under new labels. The first evaluation wasn’t truly held out. I fixed the generators so every seed produces a genuinely different problem, and confirmed that the old seeds still reproduce the old sets byte for byte.",
                {
                    "heading": "What I fixed"
                },
                "I diagnosed every failure before changing code:",
                {
                    "items": [
                        "**Tools return derived values.** Shortfalls, coverage, cost deltas and data age now come from tools, so the model chooses and explains but never computes.",
                        "**A runtime provenance check runs before the human gate, in production as well as in evals.** An untraceable number sends the plan back to the model once. If it’s still untraceable, the approver sees a warning.",
                        "**Code guards.** One refuses to clear a shipment that matches the sanctions list. Another refuses a stock transfer larger than the actual shortfall, and the model has to resize it.",
                        "**Bug fixes.** A logging bug that recorded correct decisions as wrong, a missing tool field, a mislabeled audit record, and the agent not being told today’s date."
                    ]
                },
                "Before paying for the full run, I ran a small dev check. For $0.71, it caught a missing database migration, a guard the model was ignoring, and an audit-trail mislabel, all of which would have quietly corrupted the larger run.",
                {
                    "heading": "Clean evaluation: 60% on fresh scenarios"
                },
                "The second evaluation used 45 fresh scenarios, 9 per use case, with no overlap with development or first-evaluation data under the ID-blind check. It was weighted toward the hardest cases: three traps and three close calls per use case. The grader stayed frozen, and its file hashes were verified before and after every phase.",
                "**27 of 45 runs passed every gate (60%; 95% CI 45.5–73.0%), up from 22%.** The agents chose the correct action in 35 of 45 (78%). Failures from fabricated numbers dropped from 20 to 0.",
                {
                    "table": true
                },
                "The safety layers did real work. The transfer guard blocked 14 oversized moves, the sanctions guard stopped a clear on a sanctions hit, and the model caught the other five sanctions hits on its own.",
                {
                    "heading": "What’s still failing, and what I learned"
                },
                {
                    "items": [
                        "**Most remaining failures are wrong decisions (8) and missed required warnings.** Lateral stock transfer kept omitting the residual-risk flag even when it sized the move correctly.",
                        "**The runtime provenance check is too noisy.** Of the 10 distinct numbers it flagged, 9 were false positives: fragments of IDs and dates, and range dashes read as minus signs. Only one was a real inaccuracy. It never blocks, so it costs only an extra revision, but tighter number parsing is next.",
                        "**Three runs were marked failures by grader false positives,** the year inside a date and a fragment of a warehouse ID. I kept them as failures rather than change a frozen grader after seeing results."
                    ]
                }
            ]
        },
        {
            "title": "Making the evaluation fit the budget",
            "paragraphs": [
                "Running everything repeatedly against a real model would have cost roughly $470 by my estimate. I had a $17 budget. I had to choose which runs would teach me the most, rather than treating more runs as automatically better evidence.",
                "I reserved paid runs for the five priority use cases and used independent checks plus stubbed-model smoke tests for the other 30, covering 621 scenario archetypes. Prompt caching reduced the cost of repeated context; a same-scenario comparison measured about 26% savings.",
                "The measured evaluation cost $9.46 across 55 runs. Agent runs cost roughly $0.12–$0.20 each, with a 49.3% cache hit rate. Median latency was 61 seconds and p95 was 103 seconds. These are measurements from that run, rather than estimates of what every future run will cost.",
                "To keep the budget enforceable, the harness records tokens for each call and checks them against run totals. It refuses to start a run that would exceed the cap and saves results as it goes, so an interrupted evaluation can resume without paying for completed work again."
            ]
        },
        {
            "title": "Bugs and lessons",
            "paragraphs": [
                "A pooled connection could retain an advisory lock after an exception. A pg_advisory_unlock_all() pool reset hook fixed it, with a control test demonstrating the blocked and unblocked cases. LangGraph also silently dropped undeclared state keys, losing verification results and a one-retry flag; a schema test now rejects undeclared node writes.",
                "One pause treated rejection as approval. A regression test now proves rejection ends every use case without an act step or write. Unit tests alone missed the dropped verification state and compliance release; persona tests through the production path exposed them.",
                "A real customer snapshot contained quality-management data and fully covered none of the 36 supply-chain workflows. The ERP path used seeded data. I reframed the system as simulation-validated and made customer-specific evaluation the onboarding gate."
            ]
        },
        {
            "title": "Current scope and next steps",
            "paragraphs": [
                "Five of 35 runnable use cases are gated in; the other 30 remain disabled with 31 build/data issues and 74 tool-error scenarios reported. Read-back verification covers five use cases, while conflict-resource declarations cover executors and a few others. The synthetic demo uses separate IDs, so it does not yet demonstrate cross-use-case collisions.",
                "Next priorities are tool-returned derived numbers, resolving lateral-transfer answer definitions, improving cycle-count judgment, growing held-out coverage, adding verifiers and resource declarations, and evaluating orchestrator split accuracy. A quality-management workflow could use roughly 15,700 real inspection outcomes.",
                "Customer field mapping and manufacturing/stock ERP data are still required. Secrets, TLS, backups, alerting and the deployment pipeline were outside this project’s scope."
            ]
        },
        {
            "title": "My role and tools",
            "paragraphs": [
                "I owned the architecture, human checkpoints, verification contract, concurrency guards, evaluation methodology and cost plan. Claude Code and Codex implemented most of the code under my test-first rules and review; I checked evidence and challenged completion claims.",
                "Stack: Python, LangGraph, FastAPI, Postgres (psycopg), Anthropic API with prompt caching, ERPNext, Docker via OrbStack, pytest and Playwright."
            ]
        }
    ],
    "results": [
        [
            "Bottleneck load balancing",
            "1/9",
            "6/9",
            "78%",
            "$0.20"
        ],
        [
            "Late-part resequencing",
            "3/9",
            "5/9",
            "89%",
            "$0.15"
        ],
        [
            "Lateral stock transfer",
            "2/9",
            "4/9",
            "89%",
            "$0.18"
        ],
        [
            "Cycle-count triage",
            "1/9",
            "6/9",
            "67%",
            "$0.11"
        ],
        [
            "Shipment screening",
            "3/9",
            "6/9",
            "67%",
            "$0.21"
        ],
        [
            "Total",
            "10/45 (22%)",
            "27/45 (60%)",
            "35/45 (78%)",
            "$7.59 total"
        ]
    ]
}
},
    {
        "title": "Fused Multi-Head Attention CUDA Kernel",
        "period": "May 2026 – July 2026",
        "category": "Personal project",
        "bullets": [
            "Implemented FlashAttention's forward pass on an NVIDIA L4 at FP16 and sequence length 2048 as a hand-tuned WMMA tensor-core kernel and a compiler-driven CUDA Tile C++ kernel; the tile kernel ran in 7.59ms, within 2.5x of PyTorch SDPA",
            "Cut the WMMA kernel's runtime by 62%, from 25.2ms to 9.45ms, by eliminating shared-memory bank conflicts, tuning occupancy, and fixing SM tail effects with grid-stride scheduling, verified with Nsight Compute"
        ],
        "tags": [
            "CUDA",
            "WMMA",
            "Nsight Compute"
        ],
        "url": ""
    },
    {
        "title": "MedCLIP-TB: Contrastive Learning VLM for Identifying Tuberculosis in Chest Radiography",
        "period": "February 2026 – April 2026",
        "category": "Personal project",
        "bullets": [
            "Built a CLIP-style vision-language model pairing a ResNet-18 image encoder with a DistilBERT text encoder, trained contrastively on chest X-rays and radiology reports for zero-shot TB classification without class labels",
            "Reached 94% accuracy (F1 0.94) on 800 radiographs and 79% Recall@10 on image-to-report retrieval"
        ],
        "tags": [
            "PyTorch",
            "Contrastive learning",
            "Vision-language models"
        ],
        "url": ""
    },
    {
        "title": "Financial News Sentiment Trading Backtester",
        "period": "November 2025 – January 2026",
        "category": "Personal project",
        "bullets": [
            "Built a full-stack trading system with a FastAPI backend, a Next.js frontend, and background workers that use a SQLite job queue and APScheduler to run FinBERT sentiment analysis on 500 S&P 500 tickers daily",
            "Reached a 1.48 Sharpe ratio and 14.7% annualized return with a vectorized NumPy backtester that reconstructs the point-in-time S&P 500 universe to avoid survivorship bias, then tested the signals against live Alpaca paper trading"
        ],
        "tags": [
            "FinBERT",
            "FastAPI / Next.js",
            "NumPy"
        ],
        "url": ""
    }
]
};
