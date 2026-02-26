import { CaseStudy } from "./types";

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "spotify",
    productName: "Spotify",
    productType: "Music Streaming App",
    shortDescription:
      "Redesign Spotify's mobile experience to reduce churn and boost engagement.",
    story:
      "Spotify's mobile app has 600 million users, but engagement is plateauing and younger users are drifting to TikTok for music discovery. Your team will make the key UX decisions for a major app redesign.",
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
        id: "spotify-home-layout",
        order: 0,
        round: 0,
        type: "branching_path",
        scenarioText:
          "Alex opens Spotify after updating. What should the redesigned home screen prioritize?",
        context:
          "60% of users replay the same 20 songs. 25% explore weekly. The current home is a mix of recently played and generic playlists.",
        branches: [
          {
            id: "activity-based",
            label: "Activity-Based Home",
            description:
              "Contextual suggestions by time of day and activity. Minimal browsing needed.",
            followUp: {
              scenarioText:
                "How should Spotify detect Alex's current activity?",
              choices: [
                {
                  id: "time-based",
                  label: "Time of Day",
                  description:
                    "Use time patterns — morning commute, afternoon focus, evening wind-down.",
                },
                {
                  id: "motion-sensors",
                  label: "Phone Sensors",
                  description:
                    "Detect walking, driving, or sitting still using phone motion sensors.",
                },
                {
                  id: "manual-modes",
                  label: "Manual Activity Modes",
                  description:
                    "Let Alex tap their current activity: Commute, Work, Gym, Chill.",
                },
              ],
            },
          },
          {
            id: "social-feed",
            label: "Social Feed Home",
            description:
              "Friends' listening, trending tracks, and collaborative playlists up front.",
            followUp: {
              scenarioText:
                "How should Spotify handle privacy in the social feed?",
              choices: [
                {
                  id: "opt-in",
                  label: "Opt-In Sharing",
                  description:
                    "Nothing shared by default. Users choose what friends can see.",
                },
                {
                  id: "public-default",
                  label: "Public by Default",
                  description:
                    "Listening activity visible to friends unless turned off.",
                },
                {
                  id: "anonymous-trends",
                  label: "Anonymous Trends",
                  description:
                    "Show what's trending among friends without revealing who listened to what.",
                },
              ],
            },
          },
          {
            id: "discovery-engine",
            label: "Discovery Engine Home",
            description:
              "AI-curated daily mixes and personalized new releases dominate the screen.",
            followUp: {
              scenarioText:
                "How aggressive should the AI be in pushing new music?",
              choices: [
                {
                  id: "gentle-mix",
                  label: "80/20 Familiar/New",
                  description:
                    "Mostly familiar favorites with 20% new discoveries mixed in.",
                },
                {
                  id: "bold-discovery",
                  label: "50/50 Split",
                  description:
                    "Half familiar, half new. Push users out of their comfort zone.",
                },
                {
                  id: "user-control",
                  label: "Discovery Dial",
                  description:
                    "Let Alex set their own familiar-vs-new ratio with a slider.",
                },
              ],
            },
          },
        ],
      },
      {
        id: "spotify-nav-complexity",
        order: 1,
        round: 0,
        type: "branching_path",
        scenarioText:
          "How should Spotify's navigation be redesigned?",
        context:
          "Power users want more features accessible. Casual users say the app feels cluttered. The current 3-tab layout hides popular features.",
        branches: [
          {
            id: "minimal-nav",
            label: "Minimal (3 Tabs)",
            description:
              "Home, Search, Library. Clean and simple. Everything else in menus.",
            followUp: {
              scenarioText:
                "Where should hidden features like Radio and Podcasts live?",
              choices: [
                {
                  id: "search-subtabs",
                  label: "Under Search",
                  description:
                    "Search tab expands into Browse, Radio, Podcasts sub-sections.",
                },
                {
                  id: "home-cards",
                  label: "Home Screen Cards",
                  description:
                    "Promoted as cards on the home screen based on usage.",
                },
                {
                  id: "long-press",
                  label: "Long-Press Menu",
                  description:
                    "Long-press the search icon for a quick-access menu of all features.",
                },
              ],
            },
          },
          {
            id: "balanced-nav",
            label: "Balanced (5 Tabs)",
            description:
              "Home, Search, Radio, Library, Profile. Everything one tap away.",
            followUp: {
              scenarioText: "5 tabs is a lot for small screens. How do you keep it clean?",
              choices: [
                {
                  id: "icon-only",
                  label: "Icons Only",
                  description:
                    "No text labels — just recognizable icons to save space.",
                },
                {
                  id: "active-label",
                  label: "Active Tab Label",
                  description:
                    "Only the selected tab shows its text label. Others are icons only.",
                },
                {
                  id: "scrollable",
                  label: "Scrollable Tab Bar",
                  description:
                    "Horizontally scrollable bar showing 4 tabs at a time.",
                },
              ],
            },
          },
          {
            id: "adaptive-nav",
            label: "Adaptive Navigation",
            description:
              "Nav changes based on usage patterns — shows Alex's most-used features.",
            followUp: {
              scenarioText:
                "What if the adaptive nav confuses Alex when tabs change?",
              choices: [
                {
                  id: "pin-favorites",
                  label: "Pin Favorites",
                  description:
                    "Alex pins their top 3 tabs. 4th slot rotates based on context.",
                },
                {
                  id: "animation-hint",
                  label: "Animated Transitions",
                  description:
                    "When tabs change, animate them so Alex sees what moved.",
                },
                {
                  id: "learn-slowly",
                  label: "Slow Learning",
                  description:
                    "Only change after 2 weeks of consistent behavior. Very stable.",
                },
              ],
            },
          },
        ],
      },
      {
        id: "spotify-social",
        order: 2,
        round: 1,
        type: "branching_path",
        scenarioText:
          "Spotify wants to add deeper social features to compete with TikTok. What direction?",
        context:
          "Users 18-24 discover music on TikTok more than Spotify. Spotify Wrapped goes viral annually — social clearly resonates, but daily social features haven't stuck.",
        branches: [
          {
            id: "passive-social",
            label: "Passive Social",
            description:
              "Show friends' listening activity and shared taste scores. No messaging.",
            followUp: {
              scenarioText: "Where should passive social data appear?",
              choices: [
                {
                  id: "home-widget",
                  label: "Home Screen Widget",
                  description:
                    'A small "Friends Listening" card on the home screen.',
                },
                {
                  id: "dedicated-tab",
                  label: "Dedicated Activity Tab",
                  description:
                    "Separate tab showing all friend activity in a feed.",
                },
                {
                  id: "inline-tracks",
                  label: "Inline on Tracks",
                  description:
                    "Friend avatars on tracks they've listened to.",
                },
              ],
            },
          },
          {
            id: "active-social",
            label: "Active Social",
            description:
              "Full social: collaborative playlists, song comments, sharing, and listening parties.",
            followUp: {
              scenarioText:
                "How do you roll out active social without overwhelming existing users?",
              choices: [
                {
                  id: "opt-in-gradual",
                  label: "Gradual Opt-In",
                  description:
                    "Social hidden by default. Prompt to enable after 2 weeks.",
                },
                {
                  id: "onboarding-choice",
                  label: "Onboarding Choice",
                  description:
                    'Ask users to pick "Social" or "Solo" mode during setup.',
                },
                {
                  id: "always-on",
                  label: "Always On",
                  description:
                    "Social enabled for everyone. Users can mute if they want.",
                },
              ],
            },
          },
          {
            id: "no-social",
            label: "Skip Social Entirely",
            description:
              "Focus on audio quality, better recommendations, and offline features instead.",
            followUp: {
              scenarioText:
                "What should Spotify invest in to differentiate instead?",
              choices: [
                {
                  id: "ai-dj",
                  label: "AI DJ Mode",
                  description:
                    "AI creates seamless transitions between songs like a real DJ.",
                },
                {
                  id: "lossless-audio",
                  label: "Lossless Audio Focus",
                  description:
                    "Market-leading audio quality with device-specific tuning.",
                },
                {
                  id: "mood-engine",
                  label: "Mood Engine",
                  description:
                    "Detect mood from phone sensors, play matching music automatically.",
                },
              ],
            },
          },
        ],
      },
      {
        id: "spotify-onboarding",
        order: 3,
        round: 2,
        type: "branching_path",
        scenarioText:
          "Alex just re-downloaded Spotify after a break. What should the re-onboarding flow look like?",
        context:
          "30% of churned users re-download within 6 months. Current re-onboarding treats them like new users. Re-downloaded users who see irrelevant recommendations churn again 2x faster.",
        branches: [
          {
            id: "quick-listen",
            label: "Quick Listen Test",
            description:
              "Play 10-second clips, user taps thumbs up/down. 60 seconds, feels fun.",
            followUp: {
              scenarioText: "How many clips should Alex hear before getting recommendations?",
              choices: [
                {
                  id: "five-clips",
                  label: "5 Clips (30 sec)",
                  description: "Quick and painless. Enough for a rough profile.",
                },
                {
                  id: "ten-clips",
                  label: "10 Clips (60 sec)",
                  description: "Better accuracy. Still fast enough to feel fun.",
                },
                {
                  id: "adaptive-count",
                  label: "Adaptive",
                  description: "Keep going until the AI is confident. Could be 5 or 20.",
                },
              ],
            },
          },
          {
            id: "welcome-back",
            label: "Welcome Back Flow",
            description:
              "Restore old library and ask what changed. \"Still into jazz? Discovered any new genres?\"",
            followUp: {
              scenarioText: "How should Spotify handle Alex's old playlists?",
              choices: [
                {
                  id: "restore-all",
                  label: "Restore Everything",
                  description: "Bring back all old playlists and follows immediately.",
                },
                {
                  id: "selective-restore",
                  label: "Pick What to Keep",
                  description: "Show old playlists and let Alex choose what to restore.",
                },
                {
                  id: "fresh-start-option",
                  label: "Fresh Start Option",
                  description: "Offer a clean slate alongside the option to restore.",
                },
              ],
            },
          },
          {
            id: "skip-and-learn",
            label: "Skip Everything",
            description:
              "No onboarding. Start trending, learn preferences from listening over time.",
            followUp: {
              scenarioText: "Without onboarding, the first session feels generic. How do you fix that?",
              choices: [
                {
                  id: "trending-local",
                  label: "Local Trending",
                  description: "Show what's popular in Alex's city for a personal touch.",
                },
                {
                  id: "genre-quick-pick",
                  label: "Genre Quick Pick",
                  description: "Show 6 genre bubbles — tap a few to seed recommendations.",
                },
                {
                  id: "trust-the-algo",
                  label: "Trust the Algorithm",
                  description: "Let global trending play. The AI will figure Alex out within a day.",
                },
              ],
            },
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
      "Home screen is generic — no personalization for different contexts",
      "Navigation hides popular features from casual users",
      "No meaningful social features — losing younger users to TikTok",
    ],
    successHints: [
      "Think about Alex's use case — they want music that fits the moment, not endless browsing",
      "Consider the 60/25 split: most users replay favorites, but a quarter want discovery",
      "Social features should match the app's core value — listening — not become a separate social network",
      "Good onboarding is fast, fun, and gives the algorithm enough signal to personalize immediately",
    ],
    designTips: {
      "spotify-home-layout":
        "The best home screen reduces decision fatigue. What does Alex need at 7:30am vs. 6pm at the gym?",
      "spotify-nav-complexity":
        "Apps with 3-5 nav items score best on usability, but hiding features hurts discoverability.",
      "spotify-social":
        "Social in music works best when it enhances discovery, not distracts from listening.",
      "spotify-onboarding":
        "Best onboarding balances data collection with user patience. If it's a chore, users skip it.",
    },
    funFact:
      "Did you know? Spotify's Discover Weekly playlist has generated over 2.3 billion hours of listening. Personalization isn't just nice — it's the #1 driver of music app engagement!",
  },
  {
    id: "roblox",
    productName: "Roblox",
    productType: "Gaming Platform",
    shortDescription:
      "Redesign how players discover games and connect with friends on Roblox.",
    story:
      "Roblox has millions of experiences but players struggle to find games they'll love. 95% of new creator games get fewer than 100 plays. Your team will redesign the discovery and social experience to help players find great games and help creators get noticed.",
    persona: {
      name: "Maya Torres",
      age: 14,
      occupation: "Middle School Student & Game Creator",
      bio: "Plays Roblox 2 hours daily after school. Has created 3 games in Roblox Studio but none get more than 10 plays. Wants to discover fun new games and get her own creations noticed.",
      goals: [
        "Find fun new games quickly",
        "Play with friends easily",
        "Get her own games discovered by players",
      ],
    },
    decisions: [
      // ── Round 0 ──────────────────────────────
      {
        id: "roblox-home-page",
        order: 0,
        round: 0,
        type: "branching_path",
        scenarioText:
          "Maya opens Roblox after school. What should the home page show first?",
        context:
          "The current home page shows a wall of game thumbnails sorted by player count. 70% of plays go to the top 50 games. New games get almost zero visibility.",
        branches: [
          {
            id: "trending",
            label: "Trending Games",
            description:
              "Show the most popular games right now with live player counts and activity indicators.",
            followUp: {
              scenarioText:
                "How should 'trending' be calculated?",
              choices: [
                {
                  id: "player-count",
                  label: "Pure Player Count",
                  description: "Most players online right now = most visible. Simple and transparent.",
                },
                {
                  id: "growth-rate",
                  label: "Growth Rate",
                  description: "Games growing fastest in the last hour, even if they're small.",
                },
                {
                  id: "editors-picks",
                  label: "Editor's Picks",
                  description: "Roblox staff curate a featured games list weekly.",
                },
              ],
            },
          },
          {
            id: "for-you",
            label: "For You Feed",
            description:
              "AI-personalized feed based on Maya's play history, favorite genres, and time spent.",
            followUp: {
              scenarioText:
                "What should the AI prioritize when recommending games to Maya?",
              choices: [
                {
                  id: "similar-played",
                  label: "Similar to Played",
                  description: "Recommend games like the ones Maya already plays and enjoys.",
                },
                {
                  id: "friends-enjoy",
                  label: "Friends Enjoy",
                  description: "Recommend games that Maya's friends have rated highly.",
                },
                {
                  id: "new-experiences",
                  label: "New Experiences",
                  description: "Push diversity — show genres and styles Maya hasn't tried yet.",
                },
              ],
            },
          },
          {
            id: "friends-activity",
            label: "Friends Activity",
            description:
              "Show what Maya's friends are playing right now with one-tap join buttons.",
            followUp: {
              scenarioText:
                "What if none of Maya's friends are online?",
              choices: [
                {
                  id: "recent-activity",
                  label: "Show Recent Activity",
                  description: "Display what friends played in the last 24 hours.",
                },
                {
                  id: "suggest-friends",
                  label: "Suggest New Friends",
                  description: "Connect Maya with players who enjoy similar games.",
                },
                {
                  id: "fallback-trending",
                  label: "Fall Back to Trending",
                  description: "Seamlessly switch to trending games when no friends are active.",
                },
              ],
            },
          },
        ],
      },
      {
        id: "roblox-search",
        order: 1,
        round: 0,
        type: "branching_path",
        scenarioText:
          "Maya wants to find a new horror game to play with friends. How should search work?",
        context:
          "Current search is text-only and returns thousands of results. 60% of players never use search — they only play games from the home page or friends' invites.",
        branches: [
          {
            id: "smart-filters",
            label: "Smart Filters",
            description:
              "Genre, player count, rating, friends playing, and game age filters with visual tags.",
            followUp: {
              scenarioText:
                "Which filter should be the most prominent?",
              choices: [
                {
                  id: "genre-tags",
                  label: "Genre Tags",
                  description: "Horror, Tycoon, Obby, Simulator, Roleplay, etc.",
                },
                {
                  id: "play-style",
                  label: "Play Style",
                  description: "Solo, Co-op, Competitive, Casual, Creative.",
                },
                {
                  id: "time-to-play",
                  label: "Time to Play",
                  description: "Quick (5 min), Medium (15 min), Long (30+ min).",
                },
              ],
            },
          },
          {
            id: "visual-browse",
            label: "Visual Browse",
            description:
              "TikTok-style swipeable game previews with auto-playing gameplay clips.",
            followUp: {
              scenarioText:
                "What should the preview clips show?",
              choices: [
                {
                  id: "gameplay-footage",
                  label: "Gameplay Footage",
                  description: "15-second auto-captured clips of real gameplay.",
                },
                {
                  id: "creator-trailers",
                  label: "Creator Trailers",
                  description: "Creator-made promotional videos showcasing the best moments.",
                },
                {
                  id: "live-peek",
                  label: "Live Peek",
                  description: "Real-time spectator view of current players in the game.",
                },
              ],
            },
          },
          {
            id: "ai-search",
            label: "AI Chat Search",
            description:
              "Natural language search: \"Find me a scary game for 4 players with puzzles.\"",
            followUp: {
              scenarioText:
                "How should the AI handle vague searches like \"something fun\"?",
              choices: [
                {
                  id: "ask-followups",
                  label: "Ask Follow-Ups",
                  description: "AI asks clarifying questions before showing results.",
                },
                {
                  id: "show-variety",
                  label: "Show Variety",
                  description: "Show diverse results across genres and let Maya browse.",
                },
                {
                  id: "best-guess",
                  label: "Best Guess",
                  description: "AI picks the single best match and offers alternatives if wrong.",
                },
              ],
            },
          },
        ],
      },
      // ── Round 1 ──────────────────────────────
      {
        id: "roblox-ratings",
        order: 2,
        round: 1,
        type: "branching_path",
        scenarioText:
          "Maya just played a game and wants to share her opinion. How should the rating system work?",
        context:
          "Currently there's only a thumbs up button. 90% of ratings are positive, making ratings useless for quality comparison. Creators want meaningful feedback to improve.",
        branches: [
          {
            id: "star-rating",
            label: "Star Rating (1-5)",
            description:
              "Classic 1-5 star system like app stores. Simple and universally understood.",
            followUp: {
              scenarioText:
                "When should Maya be prompted to rate a game?",
              choices: [
                {
                  id: "after-10-min",
                  label: "After 10 Minutes",
                  description: "Prompt after playing for 10+ minutes — ensures Maya actually tried it.",
                },
                {
                  id: "on-exit",
                  label: "On Exit",
                  description: "Ask when leaving the game. Captures immediate reaction.",
                },
                {
                  id: "never-prompt",
                  label: "Never Prompt",
                  description: "Only rate if Maya voluntarily goes to the rating page. Less data, no annoyance.",
                },
              ],
            },
          },
          {
            id: "category-ratings",
            label: "Category Ratings",
            description:
              "Rate multiple aspects: Fun, Creativity, Difficulty, Social, and Replay Value.",
            followUp: {
              scenarioText:
                "How many categories should players rate?",
              choices: [
                {
                  id: "three-quick",
                  label: "3 Quick Categories",
                  description: "Fun, Creativity, Polish — fast enough that most players will do it.",
                },
                {
                  id: "five-detailed",
                  label: "5 Detailed Categories",
                  description: "Fun, Creativity, Difficulty, Social, Replay Value — great data but slower.",
                },
                {
                  id: "one-plus-word",
                  label: "1 Score + 1 Word",
                  description: "Overall score plus one word describing the game (fun, scary, creative, etc.).",
                },
              ],
            },
          },
          {
            id: "emoji-reactions",
            label: "Emoji Reactions",
            description:
              "React with emojis instead of scores. Fun, Scary, Creative, Hard, Boring, Funny, etc.",
            followUp: {
              scenarioText:
                "Should emoji reactions be shown publicly on the game page?",
              choices: [
                {
                  id: "public-breakdown",
                  label: "Public Emoji Breakdown",
                  description: "Show percentages: 45% Fun, 30% Scary, 25% Creative. Players see what to expect.",
                },
                {
                  id: "creator-only",
                  label: "Creator Only",
                  description: "Only the game creator sees detailed reactions. Public just sees total count.",
                },
                {
                  id: "earned-badges",
                  label: "Earned Badges",
                  description: "Games earn badges like \"Most Fun\" or \"Super Scary\" based on reactions.",
                },
              ],
            },
          },
        ],
      },
      {
        id: "roblox-social",
        order: 3,
        round: 1,
        type: "branching_path",
        scenarioText:
          "Maya wants to play with friends but they're in different games. How should the social system work?",
        context:
          "Players can add friends and join their game, but there's no party system, no shared queue, and no way to browse games together. 55% of sessions are solo despite most players wanting to play with friends.",
        branches: [
          {
            id: "party-system",
            label: "Party System",
            description:
              "Create a party, browse and vote on games together, then join as a group.",
            followUp: {
              scenarioText:
                "How should the party decide which game to play?",
              choices: [
                {
                  id: "leader-picks",
                  label: "Leader Picks",
                  description: "Party leader chooses the game, everyone follows. Fast but not democratic.",
                },
                {
                  id: "vote-system",
                  label: "Vote System",
                  description: "Everyone suggests games, majority vote wins. Fair but slower.",
                },
                {
                  id: "spin-wheel",
                  label: "Spin the Wheel",
                  description: "Random pick from party members' suggestions. Fun and surprising.",
                },
              ],
            },
          },
          {
            id: "activity-feed",
            label: "Activity Feed",
            description:
              "Live feed showing what friends are playing, recent achievements, and new favorite games.",
            followUp: {
              scenarioText:
                "Should the feed update in real-time or as a digest?",
              choices: [
                {
                  id: "real-time",
                  label: "Real-Time",
                  description: "Live feed of friend activity as it happens. Always current but potentially noisy.",
                },
                {
                  id: "daily-digest",
                  label: "Daily Digest",
                  description: "Summary of friend activity once per day. Clean but not immediate.",
                },
                {
                  id: "smart-timing",
                  label: "Smart Timing",
                  description: "Show updates when Maya logs in, batch notifications during play sessions.",
                },
              ],
            },
          },
          {
            id: "coop-queue",
            label: "Co-op Queue",
            description:
              "Queue for games together and matchmake as a group automatically.",
            followUp: {
              scenarioText:
                "What if the game doesn't support Maya's group size?",
              choices: [
                {
                  id: "auto-split",
                  label: "Auto-Split",
                  description: "Split into smaller groups and put them on the same server.",
                },
                {
                  id: "filter-only",
                  label: "Filter by Size",
                  description: "Only show games that fit the group size. No splitting needed.",
                },
                {
                  id: "notify-creator",
                  label: "Notify Creator",
                  description: "Tell the game creator that players want larger group support.",
                },
              ],
            },
          },
        ],
      },
      // ── Round 2 ──────────────────────────────
      {
        id: "roblox-creator-discovery",
        order: 4,
        round: 2,
        type: "branching_path",
        scenarioText:
          "Maya published a new obby game but nobody is playing it. How should Roblox help new creators get discovered?",
        context:
          "95% of new games get fewer than 100 plays in their first week. The algorithm heavily favors already-popular games. New creators feel invisible.",
        branches: [
          {
            id: "creator-spotlight",
            label: "New Creator Spotlight",
            description:
              "Dedicated home page section featuring games from new and emerging creators.",
            followUp: {
              scenarioText:
                "How should spotlight games be selected?",
              choices: [
                {
                  id: "random-rotation",
                  label: "Random Rotation",
                  description: "Random selection from recent uploads — everyone gets a fair turn.",
                },
                {
                  id: "quality-threshold",
                  label: "Quality Threshold",
                  description: "Games must pass a basic quality check (no crashes, has a thumbnail, etc.).",
                },
                {
                  id: "community-nominated",
                  label: "Community Nominated",
                  description: "Players can nominate hidden gem games they've discovered.",
                },
              ],
            },
          },
          {
            id: "boost-system",
            label: "Visibility Boost",
            description:
              "Give every new game a temporary visibility boost in recommendations for its first week.",
            followUp: {
              scenarioText:
                "How long should the boost last?",
              choices: [
                {
                  id: "24-hours",
                  label: "24 Hours",
                  description: "One day of enhanced visibility. Creates urgency for creators to polish before launch.",
                },
                {
                  id: "until-threshold",
                  label: "Until 1,000 Plays",
                  description: "Boost until the game reaches a play threshold. Fair regardless of timing.",
                },
                {
                  id: "performance-based",
                  label: "Performance-Based",
                  description: "Boost continues if players are enjoying it (high playtime, ratings). Rewards quality.",
                },
              ],
            },
          },
          {
            id: "creator-mentorship",
            label: "Creator Mentorship",
            description:
              "Pair new creators with experienced ones for feedback and guidance before publishing.",
            followUp: {
              scenarioText:
                "What should mentors help with?",
              choices: [
                {
                  id: "game-design",
                  label: "Game Design",
                  description: "Gameplay, level design, fun factor, and difficulty balance.",
                },
                {
                  id: "marketing",
                  label: "Marketing",
                  description: "Thumbnails, descriptions, social media promotion, and first impressions.",
                },
                {
                  id: "full-package",
                  label: "Full Package",
                  description: "Both design and marketing support — comprehensive but requires more mentors.",
                },
              ],
            },
          },
        ],
      },
      {
        id: "roblox-chat-safety",
        order: 5,
        round: 2,
        type: "branching_path",
        scenarioText:
          "How should Roblox handle in-game chat to balance safety and usability?",
        context:
          "Younger players need protection from inappropriate content. But strict filters frustrate players — 40% say the chat filter is 'too aggressive' and blocks normal words. Some players bypass filters with creative spelling.",
        branches: [
          {
            id: "strict-filtering",
            label: "Strict Filtering",
            description:
              "Aggressively filter anything suspicious. Some normal messages get caught, but kids are safe.",
            followUp: {
              scenarioText:
                "How should Roblox handle false positives (normal words getting blocked)?",
              choices: [
                {
                  id: "appeal-button",
                  label: "Appeal Button",
                  description: "Players can tap to appeal blocked messages. Staff reviews within 24 hours.",
                },
                {
                  id: "rephrase-suggest",
                  label: "Rephrase Suggestion",
                  description: "AI suggests an alternative way to say the blocked message.",
                },
                {
                  id: "accept-tradeoff",
                  label: "Accept the Tradeoff",
                  description: "Safety is more important. Some false positives are the cost of protection.",
                },
              ],
            },
          },
          {
            id: "age-based",
            label: "Age-Based Filtering",
            description:
              "Different filter levels by age: strict for under 13, moderate for 13-17, light for 18+.",
            followUp: {
              scenarioText:
                "How should Roblox verify age for appropriate filtering?",
              choices: [
                {
                  id: "account-birthday",
                  label: "Account Birthday",
                  description: "Use the birthday entered at signup. Simple but easily faked.",
                },
                {
                  id: "parent-verification",
                  label: "Parent Verification",
                  description: "Require parent email/ID for under-18 accounts. More accurate but higher friction.",
                },
                {
                  id: "behavior-based",
                  label: "Behavior Detection",
                  description: "AI detects likely age from typing patterns and vocabulary. No verification needed.",
                },
              ],
            },
          },
          {
            id: "light-moderation",
            label: "Light Filter + Reporting",
            description:
              "Only block clearly harmful content. Rely on community reporting for edge cases.",
            followUp: {
              scenarioText:
                "How quickly should reported messages be reviewed?",
              choices: [
                {
                  id: "instant-ai",
                  label: "Instant AI Review",
                  description: "AI reviews reported messages immediately and takes action in seconds.",
                },
                {
                  id: "human-review",
                  label: "Human Review (1 hour)",
                  description: "Human moderators review within 1 hour. More accurate but slower.",
                },
                {
                  id: "community-jury",
                  label: "Community Jury",
                  description: "Random trusted players vote on reported messages. Crowdsourced moderation.",
                },
              ],
            },
          },
        ],
      },
      // ── Round 3 ──────────────────────────────
      {
        id: "roblox-avatar-shop",
        order: 6,
        round: 3,
        type: "branching_path",
        scenarioText:
          "Maya wants a new avatar look but has limited Robux. How should the avatar shop be designed?",
        context:
          "The avatar shop has millions of items. Players spend 15 minutes browsing on average. 35% leave without buying because they can't find what they want or feel overwhelmed.",
        branches: [
          {
            id: "try-before-buy",
            label: "Try Before Buy",
            description:
              "Preview any item on your avatar in a full 3D view before purchasing. See how it looks with your current outfit.",
            followUp: {
              scenarioText:
                "Should there be a time-limited free trial?",
              choices: [
                {
                  id: "no-trial",
                  label: "Preview Only",
                  description: "3D preview but no wearing. You buy to wear it. Clean and simple.",
                },
                {
                  id: "one-hour-trial",
                  label: "1-Hour Trial",
                  description: "Wear any item free for 1 hour, then it disappears unless purchased.",
                },
                {
                  id: "social-trial",
                  label: "Private Server Trial",
                  description: "Wear items free in private servers. Must purchase for public servers.",
                },
              ],
            },
          },
          {
            id: "outfit-bundles",
            label: "Outfit Bundles",
            description:
              "Curated complete looks at a bundle discount. Full outfits ready to wear.",
            followUp: {
              scenarioText:
                "Who should create the outfit bundles?",
              choices: [
                {
                  id: "roblox-stylists",
                  label: "Roblox Stylists",
                  description: "Official curated bundles by Roblox's design team. Quality guaranteed.",
                },
                {
                  id: "community-bundles",
                  label: "Community Creators",
                  description: "Players create and share outfit combinations. Community-driven variety.",
                },
                {
                  id: "ai-bundles",
                  label: "AI-Generated",
                  description: "AI creates personalized bundles based on Maya's style and purchase history.",
                },
              ],
            },
          },
          {
            id: "budget-mode",
            label: "Budget Mode",
            description:
              "Set a Robux budget and only see items within that price range, sorted by popularity.",
            followUp: {
              scenarioText:
                "Should Roblox suggest ways to earn or save Robux?",
              choices: [
                {
                  id: "wishlist-only",
                  label: "Wishlist Only",
                  description: "Save items to a wishlist for later. No financial suggestions.",
                },
                {
                  id: "savings-goal",
                  label: "Savings Goal",
                  description: "Set a savings goal with progress tracking toward a specific item.",
                },
                {
                  id: "earn-suggestions",
                  label: "Earn Suggestions",
                  description: "Show ways to earn Robux through creating games or participating in events.",
                },
              ],
            },
          },
        ],
      },
      {
        id: "roblox-pricing",
        order: 7,
        round: 3,
        type: "branching_path",
        scenarioText:
          "How should game pass and item prices be displayed to players?",
        context:
          "Some players don't understand the Robux-to-dollar conversion. Parents complain about unexpected spending. 25% of support tickets are about pricing confusion.",
        branches: [
          {
            id: "dual-currency",
            label: "Dual Currency Display",
            description:
              "Show both Robux and real-money equivalent on every price tag.",
            followUp: {
              scenarioText:
                "Where should dual pricing appear?",
              choices: [
                {
                  id: "everywhere",
                  label: "Everywhere",
                  description: "Every single price shows both Robux and dollars. Maximum transparency.",
                },
                {
                  id: "checkout-only",
                  label: "Checkout Only",
                  description: "Browse in Robux, see real money only at the final purchase screen.",
                },
                {
                  id: "settings-toggle",
                  label: "User Setting",
                  description: "Players choose their preferred currency display in settings.",
                },
              ],
            },
          },
          {
            id: "spending-tracker",
            label: "Spending Tracker",
            description:
              "Built-in dashboard showing daily, weekly, and monthly Robux spending with charts.",
            followUp: {
              scenarioText:
                "Should parents get automatic spending reports?",
              choices: [
                {
                  id: "weekly-email",
                  label: "Weekly Email",
                  description: "Parents receive automatic weekly spending summaries via email.",
                },
                {
                  id: "parent-dashboard",
                  label: "Parent Dashboard",
                  description: "Parents can check a real-time dashboard anytime through the parent app.",
                },
                {
                  id: "opt-in-only",
                  label: "Only If Set Up",
                  description: "Reports only sent if parent actively enables parental controls.",
                },
              ],
            },
          },
          {
            id: "price-categories",
            label: "Price Tiers",
            description:
              "Label items as Common, Uncommon, Rare, Epic, Legendary instead of just showing Robux numbers.",
            followUp: {
              scenarioText:
                "Should rarity affect availability?",
              choices: [
                {
                  id: "always-available",
                  label: "Always Available",
                  description: "Rarity is just a label. Everything's always purchasable.",
                },
                {
                  id: "limited-editions",
                  label: "Limited Editions",
                  description: "Rare and above items are truly limited — only available for a set time.",
                },
                {
                  id: "rotating-shop",
                  label: "Rotating Shop",
                  description: "Items rotate in and out of the shop weekly. Creates excitement but FOMO.",
                },
              ],
            },
          },
        ],
      },
      // ── Round 4 ──────────────────────────────
      {
        id: "roblox-creator-analytics",
        order: 8,
        round: 4,
        type: "branching_path",
        scenarioText:
          "Maya wants to understand why her game isn't getting players. What analytics should Roblox show creators?",
        context:
          "Current analytics show only daily visits and Robux revenue. Creators can't see where players drop off, what's confusing, or how they compare to similar games.",
        branches: [
          {
            id: "player-journey",
            label: "Player Journey Map",
            description:
              "See exactly where players go, where they get stuck, and where they leave the game.",
            followUp: {
              scenarioText:
                "How detailed should the player journey data be?",
              choices: [
                {
                  id: "heatmaps",
                  label: "Heatmaps",
                  description: "Visual maps showing where players spend time and where they quit.",
                },
                {
                  id: "funnel-view",
                  label: "Funnel View",
                  description: "Step-by-step drop-off: 100 joined → 80 played 1 min → 30 played 5 min.",
                },
                {
                  id: "session-recordings",
                  label: "Session Recordings",
                  description: "Watch anonymous replays of player sessions. See exactly what happened.",
                },
              ],
            },
          },
          {
            id: "comparison-tools",
            label: "Comparison Tools",
            description:
              "Compare your game's stats to similar games in your genre to see where you're underperforming.",
            followUp: {
              scenarioText:
                "Should comparison data include specific game names?",
              choices: [
                {
                  id: "anonymous-benchmarks",
                  label: "Anonymous Benchmarks",
                  description: "Compare to genre averages without naming specific games.",
                },
                {
                  id: "public-leaderboards",
                  label: "Public Leaderboards",
                  description: "Show rankings within each genre. Competitive but transparent.",
                },
                {
                  id: "opt-in-comparisons",
                  label: "Opt-In Comparisons",
                  description: "Creators choose to share their data for mutual comparison.",
                },
              ],
            },
          },
          {
            id: "ai-coach",
            label: "AI Game Coach",
            description:
              "AI analyzes Maya's game and gives specific suggestions to improve player retention.",
            followUp: {
              scenarioText:
                "What kind of suggestions should the AI coach give?",
              choices: [
                {
                  id: "design-tips",
                  label: "Design Tips",
                  description: "\"Players quit at level 3 — it might be too hard. Try adding a checkpoint.\"",
                },
                {
                  id: "marketing-tips",
                  label: "Marketing Tips",
                  description: "\"Your thumbnail doesn't show gameplay — try a screenshot instead.\"",
                },
                {
                  id: "both-prioritized",
                  label: "Both + Priorities",
                  description: "Design and marketing tips ranked by potential impact on player count.",
                },
              ],
            },
          },
        ],
      },
      {
        id: "roblox-content-moderation",
        order: 9,
        round: 4,
        type: "branching_path",
        scenarioText:
          "How strictly should Roblox moderate user-created game content?",
        context:
          "Moderation catches harmful content but also incorrectly removes creative games. 15% of moderation actions are appealed, and 30% of those appeals succeed. Creators lose trust.",
        branches: [
          {
            id: "pre-review",
            label: "Pre-Publish Review",
            description:
              "Every game is reviewed before it goes live. Nothing bad gets through, but publishing takes 24-48 hours.",
            followUp: {
              scenarioText:
                "How should creators track their review status?",
              choices: [
                {
                  id: "status-page",
                  label: "Status Dashboard",
                  description: "Real-time status page showing review progress and estimated completion.",
                },
                {
                  id: "priority-queue",
                  label: "Priority Queue",
                  description: "Creators with clean track records get faster reviews (hours vs. days).",
                },
                {
                  id: "auto-approve-updates",
                  label: "Auto-Approve Updates",
                  description: "First publish is reviewed. Updates to approved games go live instantly.",
                },
              ],
            },
          },
          {
            id: "ai-moderation",
            label: "AI + Human Hybrid",
            description:
              "AI scans games on publish. Flagged games go to human reviewers. Clean games go live instantly.",
            followUp: {
              scenarioText:
                "What should happen to a game while it's flagged for human review?",
              choices: [
                {
                  id: "stay-live",
                  label: "Stay Live",
                  description: "Game stays playable until human confirms the issue. Risk of temporary bad content.",
                },
                {
                  id: "limited-access",
                  label: "Limited Access",
                  description: "Game is hidden from search but playable via direct link during review.",
                },
                {
                  id: "take-down",
                  label: "Take Down",
                  description: "Game is removed until review is complete. Safe but frustrating for false positives.",
                },
              ],
            },
          },
          {
            id: "community-moderation",
            label: "Community-Driven",
            description:
              "Publish instantly. Rely on player reports and trusted community moderators to catch issues.",
            followUp: {
              scenarioText:
                "How should community moderators be selected?",
              choices: [
                {
                  id: "reputation-based",
                  label: "Reputation System",
                  description: "Players earn moderation privileges through account age, good behavior, and accuracy.",
                },
                {
                  id: "application-process",
                  label: "Application Process",
                  description: "Players apply to become moderators. Roblox reviews and trains approved applicants.",
                },
                {
                  id: "random-jury",
                  label: "Random Jury",
                  description: "Random trusted players are asked to vote on reported content. Distributed and fair.",
                },
              ],
            },
          },
        ],
      },
      // ── Round 5 ──────────────────────────────
      {
        id: "roblox-notifications",
        order: 10,
        round: 5,
        type: "branching_path",
        scenarioText:
          "How should Roblox notify Maya about games, friends, and updates?",
        context:
          "Players receive 20+ notifications daily. 65% have disabled notifications entirely. When notifications are off, engagement drops 40% — notifications matter, but they're broken.",
        branches: [
          {
            id: "smart-digest",
            label: "Smart Digest",
            description:
              "One daily notification summarizing everything important: friend invites, game updates, new games to try.",
            followUp: {
              scenarioText:
                "When should the daily digest be sent?",
              choices: [
                {
                  id: "after-school",
                  label: "After School (3:30 PM)",
                  description: "Send when Maya is most likely to play. Maximizes engagement.",
                },
                {
                  id: "friends-active",
                  label: "When Friends Are Online",
                  description: "Send when most of Maya's friends come online. Social motivation.",
                },
                {
                  id: "user-chooses",
                  label: "Maya Chooses",
                  description: "Let Maya pick her preferred notification time in settings.",
                },
              ],
            },
          },
          {
            id: "priority-only",
            label: "Priority Only",
            description:
              "Only notify for direct friend invites and updates to games Maya is actively following.",
            followUp: {
              scenarioText:
                "Should Roblox learn what Maya cares about over time?",
              choices: [
                {
                  id: "explicit-prefs",
                  label: "Explicit Preferences",
                  description: "Maya checks boxes for exactly what she wants notifications about.",
                },
                {
                  id: "smart-learning",
                  label: "Smart Learning",
                  description: "AI learns from what Maya clicks and adjusts notification types automatically.",
                },
                {
                  id: "both-approach",
                  label: "Preferences + AI",
                  description: "Start with Maya's preferences, then AI refines over time.",
                },
              ],
            },
          },
          {
            id: "in-app-only",
            label: "In-App Inbox Only",
            description:
              "No push notifications at all. Everything waits in an inbox that Maya checks when she opens Roblox.",
            followUp: {
              scenarioText:
                "How should the in-app inbox be organized?",
              choices: [
                {
                  id: "chronological",
                  label: "Chronological",
                  description: "Most recent first. Simple and predictable.",
                },
                {
                  id: "by-category",
                  label: "By Category",
                  description: "Tabs for Friends, Games, System. Easy to find what you care about.",
                },
                {
                  id: "priority-ranked",
                  label: "Priority Ranked",
                  description: "AI puts the most important messages at top. Smart but less predictable.",
                },
              ],
            },
          },
        ],
      },
      {
        id: "roblox-cross-platform",
        order: 11,
        round: 5,
        type: "branching_path",
        scenarioText:
          "Maya plays on phone at school and PC at home. How should the experience differ across platforms?",
        context:
          "60% of Roblox players are on mobile, 30% on PC, 10% on console. Many players switch devices daily. Mobile has smaller screens and touch controls. PC has mouse precision and keyboard shortcuts.",
        branches: [
          {
            id: "adaptive-ui",
            label: "Adaptive UI",
            description:
              "Same features everywhere but the interface adapts to screen size and input method.",
            followUp: {
              scenarioText:
                "How should game controls adapt between devices?",
              choices: [
                {
                  id: "auto-detect",
                  label: "Auto-Detect",
                  description: "Automatically switch between touch, keyboard, and controller layouts.",
                },
                {
                  id: "custom-presets",
                  label: "Custom Presets",
                  description: "Maya saves different control layouts for each device she uses.",
                },
                {
                  id: "game-specific",
                  label: "Game-Specific",
                  description: "Each game creator defines optimal controls per platform.",
                },
              ],
            },
          },
          {
            id: "platform-optimized",
            label: "Platform-Optimized",
            description:
              "Different experiences tuned for each device's strengths. PC gets extra features, mobile is simplified.",
            followUp: {
              scenarioText:
                "Should some features be platform-exclusive?",
              choices: [
                {
                  id: "no-exclusives",
                  label: "No Exclusives",
                  description: "Everything available everywhere, just different UI layouts.",
                },
                {
                  id: "creation-pc-only",
                  label: "Creation on PC Only",
                  description: "Game creation and editing only on PC. Playing available on all devices.",
                },
                {
                  id: "enhanced-features",
                  label: "Enhanced Features",
                  description: "PC gets advanced analytics and creation tools. Mobile gets social and discovery.",
                },
              ],
            },
          },
          {
            id: "cloud-sync",
            label: "Cloud Sync Priority",
            description:
              "Focus on seamless progress and settings sync so switching devices feels invisible.",
            followUp: {
              scenarioText:
                "What should sync between devices?",
              choices: [
                {
                  id: "sync-everything",
                  label: "Everything",
                  description: "All settings, inventory, controls, UI preferences, and progress.",
                },
                {
                  id: "progress-only",
                  label: "Progress Only",
                  description: "Game progress and inventory sync. Settings are separate per device.",
                },
                {
                  id: "smart-sync",
                  label: "Smart Sync",
                  description: "Sync important things automatically. Let Maya choose what else to sync.",
                },
              ],
            },
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
      "Understand how discovery design affects what content gets seen",
      "Learn to balance safety and usability in social platforms",
      "Explore the creator economy and how platform design impacts creators",
      "See how monetization UX affects player trust and spending behavior",
      "Understand cross-platform design challenges for different devices",
      "Learn how notification design affects user engagement and retention",
    ],
    whatsBroken: [
      "Home page only promotes popular games — new creators are invisible",
      "Search is text-only and returns thousands of unusable results",
      "No party system — 55% of sessions are solo despite wanting to play with friends",
      "Chat filter is overly aggressive and blocks normal conversation",
      "Avatar shop is overwhelming with millions of items and no guidance",
      "Notifications are spammy — 65% of players have turned them off entirely",
    ],
    successHints: [
      "Maya is both a player and a creator — solutions should serve both roles",
      "Think about the 95% of new games that get no visibility — how does discovery change for them?",
      "Safety is critical but so is usability — the best solution makes both better, not one at the expense of the other",
      "Maya has limited Robux — pricing clarity builds trust and reduces support tickets",
      "Cross-platform players switch devices daily — friction kills engagement",
      "Fewer, better notifications beat many low-quality ones every time",
    ],
    designTips: {
      "roblox-home-page":
        "The home page is the single biggest factor in what gets played. Design it to balance discovery of new content with quick access to favorites.",
      "roblox-search":
        "60% of players never use search. The best search feels like browsing — visual, fast, and forgiving of vague queries.",
      "roblox-ratings":
        "When 90% of ratings are positive, ratings become meaningless. The best rating system provides useful signal to both players and creators.",
      "roblox-social":
        "Playing with friends is the #1 driver of retention. Remove every possible barrier between wanting to play together and actually playing together.",
      "roblox-creator-discovery":
        "Creator ecosystem health depends on new creators believing they can succeed. If only the top 50 games get traffic, new creators stop creating.",
      "roblox-chat-safety":
        "Safety and usability aren't opposites. The best moderation systems are both safer AND less annoying than blunt keyword filters.",
      "roblox-avatar-shop":
        "Decision fatigue kills conversions. When there are millions of items, curation and personalization are more important than selection size.",
      "roblox-pricing":
        "Price transparency builds trust. Confusion about Robux-to-dollar conversion creates frustration and negative parent experiences.",
      "roblox-creator-analytics":
        "Data without actionable insights is just numbers. The best analytics tell creators exactly what to do next.",
      "roblox-content-moderation":
        "Every false positive moderation action costs a creator hours of work and trust. Balance thoroughness with accuracy.",
      "roblox-notifications":
        "65% of players disabled notifications — that's a design failure, not a user preference. Fix the notifications, don't blame the users.",
      "roblox-cross-platform":
        "The best cross-platform experience makes switching devices feel invisible. Any friction is a reason to stop playing.",
    },
    funFact:
      "Did you know? Roblox has over 40 million experiences created by users, but only about 5,000 have ever reached 1 million visits. That means 99.99% of games struggle to find an audience — discovery design literally determines which creators succeed!",
  },
];
