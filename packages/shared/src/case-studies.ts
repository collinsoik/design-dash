import { CaseStudy } from "./types";

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "melodify",
    productName: "Melodify",
    productType: "Music Streaming App",
    shortDescription: "A music streaming app that needs your help to stand out from the competition.",
    story:
      "Melodify competes with Spotify and Apple Music but can't figure out what makes it special. Your team will redesign it!",
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
          "Alex just opened the app. What should they see first on the home screen?",
        context:
          "Most users (60%) replay the same songs. About 25% like discovering new music. Right now, the home screen is just a boring grid of albums.",
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
        round: 1,
        type: "tradeoff_slider",
        scenarioText:
          "How many buttons should be in the menu bar at the bottom of the app?",
        context:
          "Some people want lots of buttons so everything is easy to find. Others say too many buttons is confusing. Where's the sweet spot?",
        tradeoff: {
          leftLabel: "Minimal Nav",
          rightLabel: "Feature-Rich Nav",
          leftDescription:
            "3 tabs: Home, Search, Library. Clean and simple. Advanced features in menus.",
          rightDescription:
            "6+ tabs: Home, Explore, Radio, Social, Library, Profile. Everything one tap away.",
          points: [
            "3 tabs only",
            "3 tabs + overflow menu",
            "4–5 tabs balanced",
            "5 tabs + extras",
            "6+ tabs, all visible",
          ],
        },
      },
      {
        id: "melodify-social",
        order: 2,
        round: 1,
        type: "branching_path",
        scenarioText:
          "The boss wants to add social features (like seeing what friends listen to). What should you do?",
        context:
          "Other music apps are adding social stuff. Younger users want it, but older users aren't sure they care.",
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
          "Alex just downloaded Melodify for the first time. How should the app figure out what music they like?",
        context:
          "Right now, new users have to pick 5 favorite artists from a huge list. Most people give up halfway through. Users who skip this step end up leaving the app.",
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
      "Did you think about what the user needs?",
      "Do your choices work well together?",
      "Did you consider the pros and cons?",
      "Can you explain why you made your choices?",
    ],
    difficulty: "beginner",
    learningObjectives: [
      "Learn how a home screen design changes whether people use an app",
      "Find the balance between keeping things simple and having cool features",
      "Think about whether adding social features helps or hurts the app",
      "See how the first experience with an app affects if people keep using it",
    ],
    whatsBroken: [
      "Home screen is just a boring grid — nothing is personalized, hard to find music",
      "The menu has too many buttons for some people and not enough for others",
      "No way to see what friends are listening to — younger users want this!",
    ],
    successHints: [
      "Alex wants music that fits the moment — not to spend ages browsing",
      "Most users replay their favorites, but about 1 in 4 want to discover new stuff",
      "Social features should help people find music, not turn the app into a social network",
      "Good first-time setup should be quick, fun, and teach the app what you like",
    ],
    designTips: {
      "melodify-home-layout":
        "Think about what Alex wants at different times — morning commute vs. workout at the gym. A good home screen shows the right thing at the right time!",
      "melodify-nav-complexity":
        "Most popular apps use 3-5 buttons in their menu bar. Too few and people can't find stuff. Too many and it feels messy.",
      "melodify-social":
        "Social features work best when they help you find new music, not distract you from listening.",
      "melodify-onboarding":
        "If signing up feels like homework, people will skip it! Make it quick and fun.",
    },
    funFact:
      "Did you know? Spotify's Discover Weekly playlist, which uses AI to recommend music, has generated over 2.3 billion hours of listening. Personalization isn't just nice — it's the #1 driver of music app engagement!",
  },
  {
    id: "greenplate",
    productName: "GreenPlate",
    productType: "Meal Planning & Grocery App",
    shortDescription: "A meal planning app that people love at first but stop using after a month.",
    story:
      "GreenPlate helps families plan meals and make grocery lists. People give it great reviews, but most stop using it after a few weeks. Your job: figure out why and fix it!",
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
          "Sarah sits down Sunday night to plan the week's meals. How should the app help her?",
        context:
          "Right now it takes 22 minutes to plan a week of meals — way too long! People get overwhelmed by too many recipe choices.",
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
        round: 1,
        type: "branching_path",
        scenarioText:
          "Sarah's kids won't eat half the meals she plans. How should the app deal with picky eaters?",
        context:
          "35% of users say picky family members are their biggest frustration. The app doesn't help with this at all right now.",
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
          "The grocery list mixes ingredients from different recipes together. How organized should it be?",
        context:
          "Some people want to see ingredients grouped by recipe so they know what's for what. Others just want the shortest possible shopping list.",
        tradeoff: {
          leftLabel: "Per-Recipe Lists",
          rightLabel: "Optimized Combined",
          leftDescription:
            "Ingredients grouped by recipe. Clear what goes where. Longer list with duplicates.",
          rightDescription:
            "One optimized list grouped by aisle. Shorter but harder to trace to recipes.",
          points: [
            "Grouped by recipe",
            "By recipe, deduped",
            "Hybrid grouping",
            "By aisle, recipe tags",
            "One optimized list",
          ],
        },
      },
      {
        id: "greenplate-retention",
        order: 3,
        round: 2,
        type: "multiple_choice",
        scenarioText:
          "It's been 5 weeks and Sarah hasn't opened the app in 4 days. How should GreenPlate get her back?",
        context:
          "Almost half of users stop using the app around this time. Only 12% open the reminder notifications. Most say they just forgot or got busy.",
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
      "Did you think about what the user needs?",
      "Do your choices work well together?",
      "Did you consider the pros and cons?",
      "Can you explain why you made your choices?",
    ],
    difficulty: "intermediate",
    learningObjectives: [
      "Learn how giving fewer choices can actually help people decide faster",
      "See how personalizing an app for different family members changes the experience",
      "Think about how organizing information differently helps people shop",
      "Explore different ways to keep people coming back to an app",
    ],
    whatsBroken: [
      "Planning meals takes 22 minutes — way too long for a busy parent!",
      "No help for picky eaters — 35% of families are frustrated by this",
      "The grocery list mixes everything together and is confusing to shop from",
    ],
    successHints: [
      "Sarah's biggest need is speed — if planning takes more than 10 minutes, she'll give up",
      "Kids change their minds a lot — the best solution learns what they like over time",
      "Picture Sarah in the store with two kids — which list format helps her shop fastest?",
      "The best way to get someone back is to be helpful, not annoying with notifications",
    ],
    designTips: {
      "greenplate-planning-ui":
        "Too many choices is stressful! The best planning tools give you a few good options instead of a thousand.",
      "greenplate-picky-eaters":
        "Learning what kids like over time is more accurate, but asking upfront gives faster results. Which matters more?",
      "greenplate-grocery":
        "Think about Sarah walking through the store — which list style helps her shop fastest?",
      "greenplate-retention":
        "Sending too many notifications annoys people. The best way to keep users is making the app actually useful!",
    },
    funFact:
      "Did you know? The average family throws away $1,500 worth of food per year. Meal planning apps that reduce food waste by even 20% save families over $300 annually — that's a powerful value proposition!",
  },
  {
    id: "parkwise",
    productName: "ParkWise",
    productType: "Smart Parking Finder App",
    shortDescription: "A parking finder app with great info but a confusing, frustrating design.",
    story:
      "ParkWise uses sensors and tips from other drivers to find parking spots in real-time. It has amazing data, but the app is confusing and really hard to use while driving. Time to fix it!",
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
          "Jordan is driving to an unfamiliar area for work. What should the parking search screen look like?",
        context:
          "Remember: the user is driving! They can't scroll through long lists or read small text. Right now the map shows 200+ pins and takes too long to use.",
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
          "Should ParkWise show only spots it's sure about, or include unverified ones too?",
        context:
          "Electronic sensors are 95% accurate but only cover 30% of spots. Tips from other drivers cover 80% of spots but are only 60% accurate. Users hate driving to a spot and finding it taken.",
        tradeoff: {
          leftLabel: "Accuracy First",
          rightLabel: "Coverage First",
          leftDescription:
            "Only sensor-verified spots. Fewer options, almost never wrong. May feel empty in some areas.",
          rightDescription:
            "All data including crowdsourced. More options, but some spots may be taken on arrival.",
          points: [
            "Sensor-verified only",
            "Sensors + vetted reports",
            "Balanced mix",
            "All sources, flagged",
            "All crowdsourced data",
          ],
        },
      },
      {
        id: "parkwise-safety",
        order: 2,
        round: 1,
        type: "branching_path",
        scenarioText:
          "Jordan asks: \"How do I know if this parking spot is in a safe area?\" How should ParkWise show safety info?",
        context:
          "40% of users say safety affects where they park. The app doesn't show any safety info right now. Possible data sources: crime stats, user reviews, and street lighting data.",
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
          "ParkWise wants to let you reserve spots ahead of time. How should it show prices?",
        context:
          "Some parking garages give discounts for reserving ahead. Street parking uses meters. 55% of users say price is the #1 thing they care about, but there's no way to compare costs right now.",
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
      "Did you think about what the user needs?",
      "Do your choices work well together?",
      "Did you consider the pros and cons?",
      "Can you explain why you made your choices?",
    ],
    difficulty: "advanced",
    learningObjectives: [
      "Learn how to design for someone who can't look at the screen much (they're driving!)",
      "Figure out whether it's better to show accurate info or more info",
      "Think about whether safety scores could be unfair to certain neighborhoods",
      "See how showing prices differently changes what people choose",
    ],
    whatsBroken: [
      "The map shows 200+ pins at once — impossible to read while driving!",
      "No way to know if a spot is actually still open — people drive there and it's taken",
      "No safety info — Jordan can't tell if a spot is safe to leave expensive camera gear",
    ],
    successHints: [
      "Jordan is driving — the app needs to work with barely looking at the screen",
      "Fewer options that are actually correct might be better than showing everything",
      "Safety scores can be unfair — they might make certain neighborhoods look bad when they're fine",
      "Showing prices clearly builds trust, but too much detail makes it harder to choose",
    ],
    designTips: {
      "parkwise-core-ui":
        "The user is driving! They can't read tiny text or scroll through lists. Make it simple enough to use with one hand.",
      "parkwise-trust":
        "Would you rather see 3 spots that are definitely open, or 20 spots where some might already be taken?",
      "parkwise-safety":
        "Be careful with safety scores — they can unfairly label entire neighborhoods. Think about how to be helpful without being biased.",
      "parkwise-pricing":
        "Price is the #1 thing people care about, but showing too much info at once makes it harder to decide.",
    },
    funFact:
      "Did you know? The average driver in a major city spends 17 hours per year searching for parking — that's more than 2 full work days! And cruising for parking accounts for 30% of urban traffic congestion.",
  },
];
