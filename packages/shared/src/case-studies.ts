import { CaseStudy } from "./types";

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "melodify",
    productName: "Melodify",
    productType: "Music Streaming App",
    story:
      "Melodify is a growing music streaming service competing with Spotify and Apple Music. They've got a solid catalog but are struggling to differentiate. Your team has been hired as the product design consultants to make key UX decisions that will shape the next major release.",
    persona: {
      name: "Alex Chen",
      age: 28,
      occupation: "Marketing Coordinator",
      bio: "Alex is a casual listener who primarily uses music during their daily commute and workout sessions. They don't want to spend time curating playlists — they just want music that fits the moment.",
      goals: [
        "Quickly find music that matches their activity",
        "Discover new songs without effort",
        "Simple, non-overwhelming interface",
      ],
    },
    decisions: [
      {
        id: "melodify-home-layout",
        order: 0,
        round: 0,
        type: "multiple_choice",
        scenarioText:
          "Alex opens the app for the first time after updating. What should the home screen prioritize?",
        context:
          "Data shows 60% of users play the same 20 songs repeatedly. 25% explore new music weekly. The current home screen is a grid of album art with no personalization.",
        choices: [
          {
            id: "activity-based",
            label: "Activity-Based Home",
            description:
              "Show contextual suggestions based on time of day and activity (commute, workout, focus). Minimal browsing required.",
          },
          {
            id: "social-feed",
            label: "Social Feed Home",
            description:
              "Show what friends are listening to, trending tracks, and collaborative playlists front-and-center.",
          },
          {
            id: "library-first",
            label: "Library-First Home",
            description:
              "Prioritize the user's own playlists, recently played, and saved albums. Familiar and fast.",
          },
          {
            id: "discovery-engine",
            label: "Discovery Engine Home",
            description:
              "AI-curated daily mixes, genre explorations, and \"new releases for you\" dominate the screen.",
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
          "Power users complain there aren't enough features accessible from the main nav. Casual users say the app feels cluttered. You need to find the right balance.",
        tradeoff: {
          leftLabel: "Minimal Nav",
          rightLabel: "Feature-Rich Nav",
          leftDescription:
            "3 tabs only: Home, Search, Library. Clean and simple. Advanced features buried in menus.",
          rightDescription:
            "6+ tabs: Home, Explore, Radio, Social, Library, Profile. Everything one tap away but busier.",
        },
      },
      {
        id: "melodify-social",
        order: 2,
        round: 1,
        type: "branching_path",
        scenarioText:
          "The CEO wants to add social features. What direction should Melodify take?",
        context:
          "Competitors are adding social features. Melodify has none currently. Users aged 18-24 request social features most. Users 25+ are split — some want it, many don't care.",
        branches: [
          {
            id: "passive-social",
            label: "Passive Social",
            description:
              "Show listening activity subtly — friends' recently played, shared taste scores. No messaging or posting.",
            followUp: {
              scenarioText:
                "Where should the passive social data appear in the app?",
              choices: [
                {
                  id: "home-widget",
                  label: "Home Screen Widget",
                  description: "A small \"Friends Listening\" card on the home screen.",
                },
                {
                  id: "dedicated-tab",
                  label: "Dedicated Activity Tab",
                  description: "A separate tab showing all friend activity in a feed.",
                },
                {
                  id: "inline-tracks",
                  label: "Inline on Tracks",
                  description: "Show friend avatars on tracks/playlists they've listened to.",
                },
              ],
            },
          },
          {
            id: "active-social",
            label: "Active Social",
            description:
              "Full social features — collaborative playlists, comments on songs, sharing stories, friend messaging.",
            followUp: {
              scenarioText:
                "How do you handle social feature adoption without overwhelming existing users?",
              choices: [
                {
                  id: "opt-in-gradual",
                  label: "Gradual Opt-In",
                  description: "Social features hidden by default. Prompt users to enable after 2 weeks.",
                },
                {
                  id: "onboarding-choice",
                  label: "Onboarding Choice",
                  description: "During onboarding, ask users to pick \"Social\" or \"Solo\" mode.",
                },
                {
                  id: "always-on",
                  label: "Always On",
                  description: "Social features enabled for everyone. Users can mute/hide if they want.",
                },
              ],
            },
          },
          {
            id: "no-social",
            label: "Skip Social Entirely",
            description:
              "Focus resources on music quality, better recommendations, and offline features instead.",
            followUp: {
              scenarioText:
                "If not social, what should Melodify invest in to differentiate?",
              choices: [
                {
                  id: "ai-dj",
                  label: "AI DJ Mode",
                  description: "An AI that creates seamless transitions between songs like a real DJ.",
                },
                {
                  id: "lossless-audio",
                  label: "Lossless Audio Focus",
                  description: "Market-leading audio quality with equipment-specific tuning.",
                },
                {
                  id: "mood-engine",
                  label: "Mood Engine",
                  description: "Detect mood from phone sensors and play matching music automatically.",
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
          "Design the new-user onboarding flow. Alex just downloaded Melodify. What happens first?",
        context:
          "Current onboarding asks users to pick 5 favorite artists from a grid of 50. Completion rate is only 40%. Users who skip onboarding have 3x higher churn in the first week.",
        choices: [
          {
            id: "quick-listen",
            label: "Quick Listen Test",
            description:
              "Play 10-second clips of varied songs. User taps thumbs up/down. Takes 60 seconds, feels fun.",
          },
          {
            id: "import-library",
            label: "Import & Go",
            description:
              "Connect Spotify/Apple Music to import existing taste. Instant personalization, zero effort.",
          },
          {
            id: "genre-mood-picker",
            label: "Genre + Mood Picker",
            description:
              "Pick 3 genres and 2 moods from a visual grid (8 options each). Simple but less precise.",
          },
          {
            id: "skip-and-learn",
            label: "Skip Everything",
            description:
              "No onboarding. Start with popular/trending and learn preferences from actual listening behavior over time.",
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
  },
  {
    id: "greenplate",
    productName: "GreenPlate",
    productType: "Meal Planning & Grocery App",
    story:
      "GreenPlate helps busy families plan weekly meals and auto-generates grocery lists. The app has strong reviews but low retention — users love it for the first month then drop off. Your team needs to make design decisions that improve long-term engagement.",
    persona: {
      name: "Sarah Mitchell",
      age: 35,
      occupation: "Working Parent (Teacher)",
      bio: "Sarah has two kids (ages 6 and 9), works full time, and handles most of the meal planning. She wants healthy meals that her picky kids will eat, and she needs shopping to be fast.",
      goals: [
        "Plan a week of meals in under 10 minutes",
        "Minimize food waste",
        "Get kids to eat healthier without complaints",
      ],
    },
    decisions: [
      {
        id: "greenplate-planning-ui",
        order: 0,
        round: 0,
        type: "multiple_choice",
        scenarioText:
          "Sarah opens the meal planner on Sunday evening. How should the weekly planning interface work?",
        context:
          "Users spend an average of 22 minutes planning a week of meals. 70% plan on Sunday. The biggest drop-off point is when users have to choose recipes — too many options cause decision fatigue.",
        choices: [
          {
            id: "ai-auto-plan",
            label: "Auto-Plan with AI",
            description:
              "AI generates a full week based on preferences, dietary needs, and past likes. User just approves or swaps individual meals.",
          },
          {
            id: "drag-calendar",
            label: "Drag-to-Calendar",
            description:
              "Visual calendar view. Browse recipes and drag them onto days. Full control, but slower.",
          },
          {
            id: "quick-picks",
            label: "Quick Pick Slots",
            description:
              "For each meal slot, show 3 curated options. Tap to select. Fast but less variety.",
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
          "35% of users cite picky family members as a top frustration. No current feature addresses this directly.",
        branches: [
          {
            id: "kid-profiles",
            label: "Kid Taste Profiles",
            description:
              "Create individual profiles for each family member. The app learns what each person likes/dislikes and filters recipes accordingly.",
            followUp: {
              scenarioText: "How should kid profiles collect taste data?",
              choices: [
                {
                  id: "thumbs-rating",
                  label: "Post-Meal Thumbs Up/Down",
                  description: "After each meal, quick thumbs up/down per family member.",
                },
                {
                  id: "ingredient-prefs",
                  label: "Ingredient Preference Setup",
                  description: "During setup, mark ingredients each kid likes, dislikes, or is allergic to.",
                },
                {
                  id: "fun-quiz",
                  label: "Fun Food Quiz for Kids",
                  description: "A gamified quiz kids fill out themselves with food pictures and emoji reactions.",
                },
              ],
            },
          },
          {
            id: "sneaky-healthy",
            label: "\"Sneaky Healthy\" Recipes",
            description:
              "Curate recipes that hide vegetables and healthy ingredients in kid-friendly dishes. No profiles needed.",
            followUp: {
              scenarioText: "How should sneaky healthy recipes be presented?",
              choices: [
                {
                  id: "labeled-badge",
                  label: "\"Kid Approved\" Badge",
                  description: "Mark recipes with a badge. Parents can filter for them.",
                },
                {
                  id: "integrated-default",
                  label: "Default in Suggestions",
                  description: "Auto-prioritize these recipes in suggestions without labeling them specially.",
                },
                {
                  id: "separate-section",
                  label: "Dedicated Kids Section",
                  description: "A separate \"Family Friendly\" section in the recipe browser.",
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
          "The auto-generated grocery list sometimes combines ingredients in confusing ways (\"2.5 lbs chicken\" across 3 recipes). Some users want exact per-recipe breakdowns. Others want the most efficient list possible.",
        tradeoff: {
          leftLabel: "Per-Recipe Lists",
          rightLabel: "Optimized Combined",
          leftDescription:
            "Show ingredients grouped by recipe. Clear what goes where. But the shopping list is longer and has duplicates.",
          rightDescription:
            "Combine all ingredients into one optimized list grouped by store aisle. Shorter but harder to trace back to recipes.",
        },
      },
      {
        id: "greenplate-retention",
        order: 3,
        round: 2,
        type: "multiple_choice",
        scenarioText:
          "It's week 5 and Sarah hasn't opened GreenPlate in 4 days. What should the app do to re-engage her?",
        context:
          "Retention drops 45% between week 4-6. Push notification open rate is 12%. Users say they \"forgot\" or \"got too busy.\"",
        choices: [
          {
            id: "smart-reminder",
            label: "Smart Sunday Reminder",
            description:
              "Send a notification Sunday morning: \"Plan this week's meals in 3 minutes — we pre-filled based on your favorites.\"",
          },
          {
            id: "leftover-helper",
            label: "Leftover Helper",
            description:
              "Mid-week notification: \"Got leftover chicken from Monday? Here are 3 quick meals to make with it.\"",
          },
          {
            id: "streak-gamification",
            label: "Planning Streak",
            description:
              "Gamify weekly planning with streaks, badges, and family stats (\"You've cooked 80% of planned meals!\").",
          },
          {
            id: "do-nothing",
            label: "Don't Push — Improve Core",
            description:
              "Skip re-engagement tricks. Instead, invest in making the core planning experience so fast it becomes habit naturally.",
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
  },
  {
    id: "parkwise",
    productName: "ParkWise",
    productType: "Smart Parking Finder App",
    story:
      "ParkWise helps drivers find available parking spots in real-time using sensor data and crowdsourcing. They have great data but the app experience is frustrating — users say it's slow, hard to use while driving, and the map is overwhelming. Your team needs to redesign the core experience.",
    persona: {
      name: "Jordan Rivera",
      age: 42,
      occupation: "Freelance Photographer",
      bio: "Jordan drives to different locations daily for shoots. They're often in unfamiliar neighborhoods with expensive equipment in the car. Finding safe, convenient parking quickly is critical.",
      goals: [
        "Find parking within 2 minutes of arriving",
        "Know the price before committing",
        "Feel confident the spot is safe for their equipment",
      ],
    },
    decisions: [
      {
        id: "parkwise-core-ui",
        order: 0,
        round: 0,
        type: "multiple_choice",
        scenarioText:
          "Jordan is driving to a photoshoot in an unfamiliar area. What should the primary parking search interface look like?",
        context:
          "Users interact with the app while driving (dangerous!) or as a passenger. Current interface is a full map with 200+ pins. Average time-to-park after opening app: 4 minutes. Competitor apps average 2.5 minutes.",
        choices: [
          {
            id: "voice-first",
            label: "Voice-First Interface",
            description:
              "\"Find parking near me\" — voice command returns top 3 options read aloud with one-tap navigation.",
          },
          {
            id: "smart-list",
            label: "Smart List View",
            description:
              "Sorted list of nearby spots with price, distance, and safety rating. No map by default — tap to see map.",
          },
          {
            id: "simplified-map",
            label: "Simplified Map",
            description:
              "Map with max 5 highlighted spots (best matches). Color-coded by availability. Large, tappable pins.",
          },
          {
            id: "auto-navigate",
            label: "Auto-Navigate Mode",
            description:
              "App automatically picks the best spot and starts navigation. User can reject and get the next option.",
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
          "Sensor data covers 30% of city spots with 95% accuracy. Crowdsourced data covers 80% but is only 60% accurate. Users hate arriving at a \"available\" spot that's taken. But limited coverage means the app is useless in many areas.",
        tradeoff: {
          leftLabel: "Accuracy First",
          rightLabel: "Coverage First",
          leftDescription:
            "Only show sensor-verified spots. Fewer options but almost never wrong. Risk: app feels empty in many areas.",
          rightDescription:
            "Show all data including crowdsourced. More options but some spots will be taken when you arrive. Risk: user frustration.",
        },
      },
      {
        id: "parkwise-safety",
        order: 2,
        round: 1,
        type: "branching_path",
        scenarioText:
          "Jordan asks: \"How do I know if a spot is safe?\" How should ParkWise address parking safety?",
        context:
          "In surveys, 40% of users say safety influences their parking choice. No current safety data in the app. Potential data sources: crime stats, user reviews, street lighting data, and car break-in reports.",
        branches: [
          {
            id: "safety-score",
            label: "Safety Score System",
            description:
              "Show a 1-5 safety score per spot based on crime data and user reports. Clear and actionable.",
            followUp: {
              scenarioText: "How should safety scores be displayed to avoid bias or alarm?",
              choices: [
                {
                  id: "color-shield",
                  label: "Color-Coded Shield Icon",
                  description: "Green/yellow/red shield icon on each spot. Simple but could stigmatize areas.",
                },
                {
                  id: "neutral-info",
                  label: "Neutral Info Panel",
                  description: "Tap a spot to see \"Area Info\" with lighting, foot traffic, and nearby businesses. No explicit score.",
                },
                {
                  id: "comparative",
                  label: "Comparative Label",
                  description: "\"Safer than 70% of nearby options\" — relative, not absolute scoring.",
                },
              ],
            },
          },
          {
            id: "community-reviews",
            label: "Community Reviews Only",
            description:
              "Let users leave safety reviews and tips. \"Well-lit, busy street\" or \"Avoid after 10pm\". Organic and nuanced.",
            followUp: {
              scenarioText: "How do you handle moderation of community safety reviews?",
              choices: [
                {
                  id: "ai-moderation",
                  label: "AI Auto-Moderation",
                  description: "Auto-filter biased or discriminatory reviews using AI. Fast but may miss nuance.",
                },
                {
                  id: "verified-only",
                  label: "Verified Parkers Only",
                  description: "Only users who actually parked there can leave reviews. Slower data but more trustworthy.",
                },
                {
                  id: "upvote-system",
                  label: "Community Upvotes",
                  description: "Anyone can review, but community upvotes surface the most helpful ones.",
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
          "ParkWise wants to add a reservation feature. How should pricing be presented?",
        context:
          "Some parking garages offer discounts for reservations. Street parking is free/metered. Users currently can't compare costs across types. 55% of users say price is their #1 factor.",
        choices: [
          {
            id: "total-cost",
            label: "Total Trip Cost",
            description:
              "Show estimated total cost (parking + gas to get there) for each option. Holistic but requires assumptions.",
          },
          {
            id: "comparison-table",
            label: "Side-by-Side Compare",
            description:
              "Table comparing top 3 options: price, walk distance, safety, availability. Detailed but complex.",
          },
          {
            id: "budget-filter",
            label: "Budget Mode",
            description:
              "Set a budget (e.g., under $10). Only show spots within budget, sorted by convenience. Simple filtering.",
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
  },
];
