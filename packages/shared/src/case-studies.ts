import { CaseStudy } from "./types";

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "melodify",
    productName: "Melodify",
    productType: "Music Streaming App",
    shortDescription: "A music streaming app struggling to stand out from competitors.",
    story:
      "Melodify competes with Spotify and Apple Music but can't differentiate. Your team will make the UX decisions for its next release.",
    persona: {
      name: "Alex Chen",
      age: 28,
      occupation: "Marketing Coordinator",
      bio: "Casual listener who uses music during commutes and workouts. Wants music that fits the moment, not endless browsing.",
      goals: [
        "Find music matching their activity",
        "Discover new songs effortlessly",
        "Simple, clean interface",
      ],
    },
    decisions: [
      {
        id: "melodify-home-layout",
        order: 0,
        round: 0,
        type: "multiple_choice",
        scenarioText:
          "Alex opens the app after updating. What should the home screen prioritize?",
        context:
          "60% of users replay the same 20 songs. 25% explore weekly. Current home is a generic album grid with no personalization.",
        choices: [
          {
            id: "activity-based",
            label: "Activity-Based Home",
            description:
              "Contextual suggestions by time of day and activity. Minimal browsing needed.",
          },
          {
            id: "social-feed",
            label: "Social Feed Home",
            description:
              "Friends' listening, trending tracks, and collaborative playlists up front.",
          },
          {
            id: "library-first",
            label: "Library-First Home",
            description:
              "User's own playlists, recently played, and saved albums first.",
          },
          {
            id: "discovery-engine",
            label: "Discovery Engine Home",
            description:
              "AI-curated daily mixes and personalized new releases dominate the screen.",
          },
        ],
      },
      {
        id: "melodify-nav-complexity",
        order: 1,
        round: 0,
        type: "tradeoff_slider",
        scenarioText:
          "How should Melodify balance navigation simplicity vs. feature richness?",
        context:
          "Power users want more features in the nav. Casual users say it feels cluttered. Find the right balance.",
        tradeoff: {
          leftLabel: "Minimal Nav",
          rightLabel: "Feature-Rich Nav",
          leftDescription:
            "3 tabs: Home, Search, Library. Clean and simple. Advanced features in menus.",
          rightDescription:
            "6+ tabs: Home, Explore, Radio, Social, Library, Profile. Everything one tap away.",
        },
      },
      {
        id: "melodify-social",
        order: 2,
        round: 1,
        type: "branching_path",
        scenarioText:
          "The CEO wants social features. What direction should Melodify take?",
        context:
          "Competitors are adding social. Users 18-24 want it most. Users 25+ are split on whether they care.",
        branches: [
          {
            id: "passive-social",
            label: "Passive Social",
            description:
              "Show friends' listening activity and shared taste scores subtly. No messaging.",
            followUp: {
              scenarioText:
                "Where should passive social data appear?",
              choices: [
                {
                  id: "home-widget",
                  label: "Home Screen Widget",
                  description: "A small \"Friends Listening\" card on the home screen.",
                },
                {
                  id: "dedicated-tab",
                  label: "Dedicated Activity Tab",
                  description: "Separate tab showing all friend activity in a feed.",
                },
                {
                  id: "inline-tracks",
                  label: "Inline on Tracks",
                  description: "Friend avatars on tracks they've listened to.",
                },
              ],
            },
          },
          {
            id: "active-social",
            label: "Active Social",
            description:
              "Full social: collaborative playlists, song comments, sharing, and messaging.",
            followUp: {
              scenarioText:
                "How do you roll out social without overwhelming existing users?",
              choices: [
                {
                  id: "opt-in-gradual",
                  label: "Gradual Opt-In",
                  description: "Social hidden by default. Prompt to enable after 2 weeks.",
                },
                {
                  id: "onboarding-choice",
                  label: "Onboarding Choice",
                  description: "Ask users to pick \"Social\" or \"Solo\" mode during setup.",
                },
                {
                  id: "always-on",
                  label: "Always On",
                  description: "Social enabled for everyone. Users can mute if they want.",
                },
              ],
            },
          },
          {
            id: "no-social",
            label: "Skip Social Entirely",
            description:
              "Focus on music quality, better recommendations, and offline features instead.",
            followUp: {
              scenarioText:
                "What should Melodify invest in to differentiate instead?",
              choices: [
                {
                  id: "ai-dj",
                  label: "AI DJ Mode",
                  description: "AI creates seamless transitions between songs like a real DJ.",
                },
                {
                  id: "lossless-audio",
                  label: "Lossless Audio Focus",
                  description: "Market-leading audio quality with device-specific tuning.",
                },
                {
                  id: "mood-engine",
                  label: "Mood Engine",
                  description: "Detect mood from phone sensors, play matching music automatically.",
                },
              ],
            },
          },
        ],
      },
      {
        id: "melodify-onboarding",
        order: 3,
        round: 2,
        type: "multiple_choice",
        scenarioText:
          "Alex just downloaded Melodify. What should the onboarding flow look like?",
        context:
          "Current onboarding asks users to pick 5 artists from 50. Only 40% finish. Users who skip have 3x higher churn.",
        choices: [
          {
            id: "quick-listen",
            label: "Quick Listen Test",
            description:
              "Play 10-second clips, user taps thumbs up/down. 60 seconds, feels fun.",
          },
          {
            id: "import-library",
            label: "Import & Go",
            description:
              "Connect Spotify/Apple Music to import existing taste. Zero effort.",
          },
          {
            id: "genre-mood-picker",
            label: "Genre + Mood Picker",
            description:
              "Pick 3 genres and 2 moods from a visual grid. Simple but less precise.",
          },
          {
            id: "skip-and-learn",
            label: "Skip Everything",
            description:
              "No onboarding. Start trending, learn preferences from listening over time.",
          },
        ],
      },
    ],
    scoringCriteria: [
      "User-centric decision making",
      "Consistency across decisions",
      "Understanding tradeoffs",
      "Design reasoning quality",
    ],
    difficulty: "beginner",
    learningObjectives: [
      "Understand how home screen design affects user engagement and retention",
      "Learn to balance simplicity vs. feature richness in navigation",
      "Explore the tradeoffs of adding social features to a content app",
      "See how onboarding design impacts long-term user behavior",
    ],
    whatsBroken: [
      "Home screen is a generic grid — no personalization, hard to find music",
      "Navigation overwhelms casual users while hiding features from power users",
      "No social features — missing engagement for younger demographics",
    ],
    successHints: [
      "Think about Alex's use case — they want music that fits the moment, not endless browsing",
      "Consider the 60/25 split: most users replay favorites, but a quarter want discovery",
      "Social features should match the app's core value — listening — not become a separate social network",
      "Good onboarding is fast, fun, and gives the algorithm enough signal to personalize immediately",
    ],
    designTips: {
      "melodify-home-layout":
        "The best home screen reduces decision fatigue. What does Alex need at 7:30am vs. 6pm at the gym?",
      "melodify-nav-complexity":
        "Apps with 3-5 nav items score best on usability, but hiding features hurts discoverability.",
      "melodify-social":
        "Social in music works best when it enhances discovery, not distracts from listening.",
      "melodify-onboarding":
        "Best onboarding balances data collection with user patience. If it's a chore, users skip it.",
    },
    funFact:
      "Did you know? Spotify's Discover Weekly playlist, which uses AI to recommend music, has generated over 2.3 billion hours of listening. Personalization isn't just nice — it's the #1 driver of music app engagement!",
  },
  {
    id: "greenplate",
    productName: "GreenPlate",
    productType: "Meal Planning & Grocery App",
    shortDescription: "A meal planning app with great reviews but users stop using it after a month.",
    story:
      "GreenPlate helps families plan meals and generate grocery lists. Reviews are strong but retention drops after month one. Fix the design to keep users coming back.",
    persona: {
      name: "Sarah Mitchell",
      age: 35,
      occupation: "Working Parent (Teacher)",
      bio: "Has two kids (6 and 9), works full time. Wants healthy meals her picky kids will eat, and fast shopping trips.",
      goals: [
        "Plan a week of meals in under 10 min",
        "Minimize food waste",
        "Get kids eating healthier",
      ],
    },
    decisions: [
      {
        id: "greenplate-planning-ui",
        order: 0,
        round: 0,
        type: "multiple_choice",
        scenarioText:
          "Sarah opens the meal planner on Sunday evening. How should weekly planning work?",
        context:
          "Users spend 22 min planning weekly meals. Biggest drop-off: too many recipe options cause decision fatigue.",
        choices: [
          {
            id: "ai-auto-plan",
            label: "Auto-Plan with AI",
            description:
              "AI generates a full week based on preferences. User approves or swaps meals.",
          },
          {
            id: "drag-calendar",
            label: "Drag-to-Calendar",
            description:
              "Visual calendar view. Browse and drag recipes onto days. Full control, slower.",
          },
          {
            id: "quick-picks",
            label: "Quick Pick Slots",
            description:
              "Each meal slot shows 3 curated options. Tap to select. Fast, less variety.",
          },
        ],
      },
      {
        id: "greenplate-picky-eaters",
        order: 1,
        round: 0,
        type: "branching_path",
        scenarioText:
          "Sarah's kids reject half the meals she plans. How should GreenPlate handle picky eaters?",
        context:
          "35% of users cite picky family members as a top frustration. No feature addresses this today.",
        branches: [
          {
            id: "kid-profiles",
            label: "Kid Taste Profiles",
            description:
              "Individual profiles per family member. App learns likes/dislikes and filters recipes.",
            followUp: {
              scenarioText: "How should kid profiles collect taste data?",
              choices: [
                {
                  id: "thumbs-rating",
                  label: "Post-Meal Thumbs Up/Down",
                  description: "Quick thumbs up/down per family member after each meal.",
                },
                {
                  id: "ingredient-prefs",
                  label: "Ingredient Preference Setup",
                  description: "Mark ingredients each kid likes, dislikes, or is allergic to.",
                },
                {
                  id: "fun-quiz",
                  label: "Fun Food Quiz for Kids",
                  description: "Gamified quiz with food pictures and emoji reactions.",
                },
              ],
            },
          },
          {
            id: "sneaky-healthy",
            label: "\"Sneaky Healthy\" Recipes",
            description:
              "Recipes that hide veggies in kid-friendly dishes. No profiles needed.",
            followUp: {
              scenarioText: "How should sneaky healthy recipes be presented?",
              choices: [
                {
                  id: "labeled-badge",
                  label: "\"Kid Approved\" Badge",
                  description: "Badge on recipes. Parents can filter for them.",
                },
                {
                  id: "integrated-default",
                  label: "Default in Suggestions",
                  description: "Auto-prioritize in suggestions without special labeling.",
                },
                {
                  id: "separate-section",
                  label: "Dedicated Kids Section",
                  description: "Separate \"Family Friendly\" section in recipe browser.",
                },
              ],
            },
          },
        ],
      },
      {
        id: "greenplate-grocery",
        order: 2,
        round: 1,
        type: "tradeoff_slider",
        scenarioText:
          "Balance the grocery list between optimization and user control.",
        context:
          "Auto-generated lists combine ingredients confusingly. Some users want per-recipe breakdowns, others want maximum efficiency.",
        tradeoff: {
          leftLabel: "Per-Recipe Lists",
          rightLabel: "Optimized Combined",
          leftDescription:
            "Ingredients grouped by recipe. Clear what goes where. Longer list with duplicates.",
          rightDescription:
            "One optimized list grouped by aisle. Shorter but harder to trace to recipes.",
        },
      },
      {
        id: "greenplate-retention",
        order: 3,
        round: 2,
        type: "multiple_choice",
        scenarioText:
          "Week 5: Sarah hasn't opened GreenPlate in 4 days. How should the app re-engage her?",
        context:
          "Retention drops 45% between weeks 4-6. Push notification open rate is 12%. Users say they \"forgot\" or \"got busy.\"",
        choices: [
          {
            id: "smart-reminder",
            label: "Smart Sunday Reminder",
            description:
              "Sunday notification: \"Plan this week in 3 min — we pre-filled your favorites.\"",
          },
          {
            id: "leftover-helper",
            label: "Leftover Helper",
            description:
              "Mid-week: \"Got leftover chicken? Here are 3 quick meals for it.\"",
          },
          {
            id: "streak-gamification",
            label: "Planning Streak",
            description:
              "Gamify planning with streaks, badges, and family cooking stats.",
          },
          {
            id: "do-nothing",
            label: "Don't Push — Improve Core",
            description:
              "Skip re-engagement tricks. Make the core experience so fast it becomes habit.",
          },
        ],
      },
    ],
    scoringCriteria: [
      "User-centric decision making",
      "Consistency across decisions",
      "Understanding tradeoffs",
      "Design reasoning quality",
    ],
    difficulty: "intermediate",
    learningObjectives: [
      "Learn how to reduce decision fatigue in complex planning interfaces",
      "Understand how personalization features affect different user segments",
      "See how data presentation choices impact usability in grocery/shopping flows",
      "Explore retention strategies and their ethical tradeoffs",
    ],
    whatsBroken: [
      "Meal planning takes 22 min — way too long for busy parents",
      "No way to handle picky eaters — 35% of users frustrated",
      "Grocery list combines ingredients confusingly across recipes",
    ],
    successHints: [
      "Sarah's #1 goal is speed — any planning UI that takes more than 10 minutes will lose her",
      "Kids are unpredictable — the best picky eater solution collects data over time, not just upfront",
      "Think about Sarah in the grocery store aisle — which list format helps her shop fastest?",
      "The best retention strategy feels helpful, not pushy — Sarah already has enough notifications",
    ],
    designTips: {
      "greenplate-planning-ui":
        "Decision fatigue is real. The best meal planners limit options while preserving a sense of control.",
      "greenplate-picky-eaters":
        "Personalization that learns over time is more accurate than upfront prefs. But upfront gives faster results.",
      "greenplate-grocery":
        "No universal right answer for list format. Match the mental model of your user.",
      "greenplate-retention":
        "Re-engagement notifications have diminishing returns. Best retention comes from core value.",
    },
    funFact:
      "Did you know? The average family throws away $1,500 worth of food per year. Meal planning apps that reduce food waste by even 20% save families over $300 annually — that's a powerful value proposition!",
  },
  {
    id: "parkwise",
    productName: "ParkWise",
    productType: "Smart Parking Finder App",
    shortDescription: "A parking finder with great data but a frustrating, hard-to-use experience.",
    story:
      "ParkWise uses sensors and crowdsourcing to find parking in real-time. Great data, but the app is slow, hard to use while driving, and the map is overwhelming. Redesign it.",
    persona: {
      name: "Jordan Rivera",
      age: 42,
      occupation: "Freelance Photographer",
      bio: "Drives to different locations daily for shoots in unfamiliar areas. Needs safe, convenient parking fast — has expensive gear.",
      goals: [
        "Find parking within 2 minutes",
        "Know the price before committing",
        "Feel confident the spot is safe",
      ],
    },
    decisions: [
      {
        id: "parkwise-core-ui",
        order: 0,
        round: 0,
        type: "multiple_choice",
        scenarioText:
          "Jordan is driving to a shoot in an unfamiliar area. What should the parking search UI look like?",
        context:
          "Users interact while driving. Current UI shows 200+ map pins. Time-to-park: 4 min vs competitors' 2.5 min.",
        choices: [
          {
            id: "voice-first",
            label: "Voice-First Interface",
            description:
              "\"Find parking\" voice command returns top 3 options read aloud. One-tap nav.",
          },
          {
            id: "smart-list",
            label: "Smart List View",
            description:
              "Sorted list with price, distance, and safety. No map by default.",
          },
          {
            id: "simplified-map",
            label: "Simplified Map",
            description:
              "Map with max 5 highlighted best-match spots. Large, tappable pins.",
          },
          {
            id: "auto-navigate",
            label: "Auto-Navigate Mode",
            description:
              "App picks the best spot and starts navigation. Reject to get the next one.",
          },
        ],
      },
      {
        id: "parkwise-trust",
        order: 1,
        round: 1,
        type: "tradeoff_slider",
        scenarioText:
          "How should ParkWise balance real-time accuracy vs. broader coverage?",
        context:
          "Sensors cover 30% of spots at 95% accuracy. Crowdsourced covers 80% at 60% accuracy. Users hate arriving at taken spots.",
        tradeoff: {
          leftLabel: "Accuracy First",
          rightLabel: "Coverage First",
          leftDescription:
            "Only sensor-verified spots. Fewer options, almost never wrong. May feel empty in some areas.",
          rightDescription:
            "All data including crowdsourced. More options, but some spots may be taken on arrival.",
        },
      },
      {
        id: "parkwise-safety",
        order: 2,
        round: 1,
        type: "branching_path",
        scenarioText:
          "Jordan asks: \"How do I know if a spot is safe?\" How should ParkWise show safety info?",
        context:
          "40% of users say safety influences their choice. No safety data in app currently. Sources: crime stats, reviews, lighting data.",
        branches: [
          {
            id: "safety-score",
            label: "Safety Score System",
            description:
              "1-5 safety score per spot from crime data and user reports. Clear and actionable.",
            followUp: {
              scenarioText: "How should safety scores be displayed to avoid bias?",
              choices: [
                {
                  id: "color-shield",
                  label: "Color-Coded Shield Icon",
                  description: "Green/yellow/red shield on each spot. Simple but may stigmatize.",
                },
                {
                  id: "neutral-info",
                  label: "Neutral Info Panel",
                  description: "Tap to see lighting, foot traffic, nearby businesses. No score.",
                },
                {
                  id: "comparative",
                  label: "Comparative Label",
                  description: "\"Safer than 70% of nearby options\" — relative scoring.",
                },
              ],
            },
          },
          {
            id: "community-reviews",
            label: "Community Reviews Only",
            description:
              "User-written safety tips like \"Well-lit, busy street.\" Organic and nuanced.",
            followUp: {
              scenarioText: "How do you moderate community safety reviews?",
              choices: [
                {
                  id: "ai-moderation",
                  label: "AI Auto-Moderation",
                  description: "Auto-filter biased reviews with AI. Fast but may miss nuance.",
                },
                {
                  id: "verified-only",
                  label: "Verified Parkers Only",
                  description: "Only people who parked there can review. Slower but trustworthy.",
                },
                {
                  id: "upvote-system",
                  label: "Community Upvotes",
                  description: "Anyone reviews, community upvotes surface the best ones.",
                },
              ],
            },
          },
        ],
      },
      {
        id: "parkwise-pricing",
        order: 3,
        round: 2,
        type: "multiple_choice",
        scenarioText:
          "ParkWise wants to add reservations. How should pricing be shown?",
        context:
          "Some garages offer reservation discounts. Street parking is metered. 55% say price is their #1 factor. No cost comparison exists.",
        choices: [
          {
            id: "total-cost",
            label: "Total Trip Cost",
            description:
              "Estimated total (parking + gas to get there). Holistic but requires assumptions.",
          },
          {
            id: "comparison-table",
            label: "Side-by-Side Compare",
            description:
              "Top 3 options compared: price, walk distance, safety. Detailed but complex.",
          },
          {
            id: "budget-filter",
            label: "Budget Mode",
            description:
              "Set a budget, only see spots within it. Sorted by convenience.",
          },
        ],
      },
    ],
    scoringCriteria: [
      "User-centric decision making",
      "Consistency across decisions",
      "Understanding tradeoffs",
      "Design reasoning quality",
    ],
    difficulty: "advanced",
    learningObjectives: [
      "Learn how to design for distracted or constrained users (driving context)",
      "Understand the tradeoff between data accuracy and coverage in real-time apps",
      "Explore the ethical implications of safety scoring in location-based services",
      "See how pricing presentation affects user decision-making and trust",
    ],
    whatsBroken: [
      "Map shows 200+ pins — impossible to parse while driving",
      "No accuracy indicators — users arrive at spots already taken",
      "No safety info — can't tell if a spot is safe for equipment",
    ],
    successHints: [
      "Jordan is often driving — the interface must be usable with minimal attention and few taps",
      "Consider that showing fewer, more reliable options may be better than showing everything",
      "Safety features have ethical implications — scores can reinforce bias against certain neighborhoods",
      "Price transparency builds trust — but too much information can slow down decision-making",
    ],
    designTips: {
      "parkwise-core-ui":
        "Driving context changes everything. Users can't scroll or read fine text. Minimize cognitive load.",
      "parkwise-trust":
        "Users prefer fewer accurate results over many unreliable ones. But empty results destroy trust too.",
      "parkwise-safety":
        "Safety scoring is ethically complex. Crime-based scores can encode systemic biases.",
      "parkwise-pricing":
        "Price is #1 for 55% of users, but too many variables make comparison harder.",
    },
    funFact:
      "Did you know? The average driver in a major city spends 17 hours per year searching for parking — that's more than 2 full work days! And cruising for parking accounts for 30% of urban traffic congestion.",
  },
];
