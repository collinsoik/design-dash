import { CaseStudy } from "./types";

export const DESIGN_PHASES = [
  { name: "Empathize", description: "Understand the user and their problems", color: "rose" },
  { name: "Define", description: "Define the specific problem to solve", color: "amber" },
  { name: "Ideate", description: "Brainstorm creative solutions", color: "emerald" },
  { name: "Prototype", description: "Design your solution", color: "blue" },
  { name: "Test", description: "Plan how to test your design", color: "violet" },
] as const;

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "spotify",
    productName: "Spotify",
    productType: "Music Streaming App",
    shortDescription:
      "Redesign Spotify so people love using it even more.",
    story:
      "Spotify is a music app with millions of users, but some people are getting bored and switching to other apps like TikTok to find new songs. Your team gets to decide how to redesign the app so people have more fun using it!",
    persona: {
      name: "Alex Chen",
      age: 22,
      occupation: "College Student",
      bio: "Alex listens to music while walking to class and working out. They want to find the right song fast without scrolling forever.",
      goals: [
        "Find music that matches what they're doing",
        "Discover cool new songs easily",
        "Keep the app simple and not confusing",
      ],
    },
    decisions: [
      // ── EMPATHIZE ──────────────────────────────
      {
        id: "spotify-home-layout",
        order: 0,
        round: 0,
        type: "branching_path",
        scenarioText:
          "Alex opens Spotify. What should they see first on the home screen?",
        context:
          "Most people listen to the same songs over and over. Only about 1 out of 4 people look for new music each week. The home screen right now is kind of boring and the same for everyone.",
        branches: [
          {
            id: "activity-based",
            label: "What Are You Doing?",
            description:
              "Show music based on what Alex is doing right now — walking, studying, exercising, or relaxing.",
            followUp: {
              scenarioText:
                "How should Spotify figure out what Alex is doing?",
              choices: [
                {
                  id: "time-based",
                  label: "Check the Time",
                  description:
                    "Use the time of day — morning means commute music, evening means chill music.",
                },
                {
                  id: "motion-sensors",
                  label: "Use the Phone's Sensors",
                  description:
                    "The phone can tell if Alex is walking, in a car, or sitting still.",
                },
                {
                  id: "manual-modes",
                  label: "Let Alex Pick",
                  description:
                    "Show buttons like \"Studying\", \"Workout\", \"Hanging Out\" that Alex can tap.",
                },
              ],
            },
          },
          {
            id: "social-feed",
            label: "What Friends Are Listening To",
            description:
              "Show what Alex's friends are playing right now, plus popular songs everyone likes.",
            followUp: {
              scenarioText:
                "Should Alex's friends be able to see what Alex is listening to?",
              choices: [
                {
                  id: "opt-in",
                  label: "Only If Alex Says OK",
                  description:
                    "Alex has to turn on sharing first. Nothing is shared until they choose to.",
                },
                {
                  id: "public-default",
                  label: "Shared Automatically",
                  description:
                    "Friends can see what Alex listens to unless Alex turns it off.",
                },
                {
                  id: "anonymous-trends",
                  label: "Keep It Secret",
                  description:
                    "Show what songs are popular with friends, but don't say who listened to what.",
                },
              ],
            },
          },
          {
            id: "discovery-engine",
            label: "Songs Picked Just For You",
            description:
              "The app uses a smart computer to pick songs it thinks Alex will love based on what they've listened to before.",
            followUp: {
              scenarioText:
                "How many new songs should the app suggest vs. songs Alex already knows?",
              choices: [
                {
                  id: "gentle-mix",
                  label: "Mostly Favorites",
                  description:
                    "80% songs Alex already likes, 20% new songs to try.",
                },
                {
                  id: "bold-discovery",
                  label: "Half and Half",
                  description:
                    "50% familiar songs, 50% brand new ones. More surprises!",
                },
                {
                  id: "user-control",
                  label: "Alex Decides",
                  description:
                    "A slider lets Alex choose how many new songs vs. favorites they want.",
                },
              ],
            },
          },
        ],
      },
      // ── DEFINE ──────────────────────────────
      {
        id: "spotify-nav-complexity",
        order: 1,
        round: 1,
        type: "branching_path",
        scenarioText:
          "How should the buttons at the bottom of the app be set up?",
        context:
          "Right now the app has 3 buttons at the bottom: Home, Search, and Library. Some people want more buttons so they can find things faster. Other people think more buttons make it confusing.",
        branches: [
          {
            id: "minimal-nav",
            label: "Keep It Simple (3 Buttons)",
            description:
              "Just Home, Search, and Library. Clean and easy. Other features are hidden in menus.",
            followUp: {
              scenarioText:
                "Where should the hidden features go, like Radio and Podcasts?",
              choices: [
                {
                  id: "search-subtabs",
                  label: "Inside Search",
                  description:
                    "When you tap Search, you can also find Radio and Podcasts there.",
                },
                {
                  id: "home-cards",
                  label: "On the Home Screen",
                  description:
                    "Show them as cards on the home page that you can scroll to.",
                },
                {
                  id: "long-press",
                  label: "Hold Down a Button",
                  description:
                    "Press and hold the Search button to see a menu with all the extra features.",
                },
              ],
            },
          },
          {
            id: "balanced-nav",
            label: "More Buttons (5 Buttons)",
            description:
              "Home, Search, Radio, Library, and Profile. Everything is one tap away.",
            followUp: {
              scenarioText: "5 buttons takes up a lot of space on the screen. How do you keep it looking clean?",
              choices: [
                {
                  id: "icon-only",
                  label: "Pictures Only",
                  description:
                    "Just show the little pictures (icons), no words underneath. Saves space.",
                },
                {
                  id: "active-label",
                  label: "Only Label the One You're On",
                  description:
                    "The button you tapped shows its name. The others just show pictures.",
                },
                {
                  id: "scrollable",
                  label: "Scroll Sideways",
                  description:
                    "You can swipe the bottom bar left and right to see more buttons.",
                },
              ],
            },
          },
          {
            id: "adaptive-nav",
            label: "Smart Buttons (Changes for You)",
            description:
              "The buttons change based on what Alex uses most. If Alex never uses Radio, it disappears and something else takes its place.",
            followUp: {
              scenarioText:
                "What if the buttons keep changing and Alex gets confused?",
              choices: [
                {
                  id: "pin-favorites",
                  label: "Pin Your Favorites",
                  description:
                    "Alex picks their top 3 buttons. Only the 4th one changes based on what they do.",
                },
                {
                  id: "animation-hint",
                  label: "Show the Change",
                  description:
                    "When a button changes, it slides over with an animation so Alex notices.",
                },
                {
                  id: "learn-slowly",
                  label: "Change Slowly",
                  description:
                    "Only change after 2 weeks of Alex using the app the same way. Very stable.",
                },
              ],
            },
          },
        ],
      },
      // ── IDEATE ──────────────────────────────
      {
        id: "spotify-social",
        order: 2,
        round: 2,
        type: "branching_path",
        scenarioText:
          "Spotify wants to add ways for friends to share music together. What should they do?",
        context:
          "A lot of young people find new music on TikTok instead of Spotify. Spotify Wrapped (the year-end music summary) goes viral every year, so people clearly like sharing music. But adding social features to a music app is tricky.",
        branches: [
          {
            id: "passive-social",
            label: "Quiet Sharing",
            description:
              "Just show what friends are listening to. No messages or comments — keep it simple.",
            followUp: {
              scenarioText: "Where should you see what friends are listening to?",
              choices: [
                {
                  id: "home-widget",
                  label: "Small Box on Home Screen",
                  description:
                    "A little card on the home page that says \"Friends are listening to...\"",
                },
                {
                  id: "dedicated-tab",
                  label: "Its Own Page",
                  description:
                    "A separate page just for seeing all your friends' music activity.",
                },
                {
                  id: "inline-tracks",
                  label: "Friend Faces on Songs",
                  description:
                    "When you see a song, tiny friend profile pictures show up if they listened to it.",
                },
              ],
            },
          },
          {
            id: "active-social",
            label: "Full Social Features",
            description:
              "Let friends make playlists together, comment on songs, share music, and even listen together at the same time.",
            followUp: {
              scenarioText:
                "Some people might not want all these social features. How do you handle that?",
              choices: [
                {
                  id: "opt-in-gradual",
                  label: "Start with It Hidden",
                  description:
                    "Social features are off at first. After 2 weeks, ask if Alex wants to turn them on.",
                },
                {
                  id: "onboarding-choice",
                  label: "Ask at the Start",
                  description:
                    "When Alex first opens the app, ask: \"Do you want Social mode or Solo mode?\"",
                },
                {
                  id: "always-on",
                  label: "Turn It On for Everyone",
                  description:
                    "Everyone gets social features. If you don't like it, you can turn it off yourself.",
                },
              ],
            },
          },
          {
            id: "no-social",
            label: "Skip Social Stuff",
            description:
              "Don't add social features. Instead, make the music sound better and the recommendations smarter.",
            followUp: {
              scenarioText:
                "If no social features, what should Spotify spend time building instead?",
              choices: [
                {
                  id: "ai-dj",
                  label: "AI DJ",
                  description:
                    "A smart DJ that blends songs together smoothly, like a real DJ at a party.",
                },
                {
                  id: "lossless-audio",
                  label: "Amazing Sound Quality",
                  description:
                    "Make the music sound way better than any other app. Super clear and crisp.",
                },
                {
                  id: "mood-engine",
                  label: "Mood Music",
                  description:
                    "The app figures out your mood and plays music that matches how you're feeling.",
                },
              ],
            },
          },
        ],
      },
      // ── PROTOTYPE ──────────────────────────────
      {
        id: "spotify-onboarding",
        order: 3,
        round: 3,
        type: "branching_path",
        scenarioText:
          "Alex just downloaded Spotify for the first time. What should happen when they open it?",
        context:
          "Right now, new users are asked to pick 5 artists from a huge list of 50. Only 4 out of 10 people finish doing it. People who skip this step are 3 times more likely to delete the app later because the song suggestions aren't good.",
        branches: [
          {
            id: "quick-listen",
            label: "Quick Music Quiz",
            description:
              "Play short clips of songs and Alex taps thumbs up or thumbs down. Takes about 60 seconds and feels like a game!",
            followUp: {
              scenarioText: "How many song clips should Alex hear before getting recommendations?",
              choices: [
                {
                  id: "five-clips",
                  label: "5 Songs (30 seconds)",
                  description: "Quick and easy. Good enough to get started.",
                },
                {
                  id: "ten-clips",
                  label: "10 Songs (1 minute)",
                  description: "A little longer but the recommendations will be much better.",
                },
                {
                  id: "adaptive-count",
                  label: "Keep Going Until It's Good",
                  description: "The app keeps playing clips until it's confident it knows what Alex likes.",
                },
              ],
            },
          },
          {
            id: "welcome-back",
            label: "Tell Us About You",
            description:
              "Ask Alex a few quick questions: \"What kind of music do you like? What changed recently?\"",
            followUp: {
              scenarioText: "What if Alex already has playlists from another music app?",
              choices: [
                {
                  id: "restore-all",
                  label: "Bring Everything Over",
                  description: "Copy all their old playlists and favorites from the other app.",
                },
                {
                  id: "selective-restore",
                  label: "Let Alex Pick What to Keep",
                  description: "Show the old playlists and let Alex choose which ones to bring over.",
                },
                {
                  id: "fresh-start-option",
                  label: "Fresh Start",
                  description: "Give Alex the choice: start fresh or bring over old stuff.",
                },
              ],
            },
          },
          {
            id: "skip-and-learn",
            label: "Skip — Just Start Playing",
            description:
              "No questions at all. Start playing popular songs and learn what Alex likes over time.",
            followUp: {
              scenarioText: "Without asking any questions, the first songs might not be great. How do you fix that?",
              choices: [
                {
                  id: "trending-local",
                  label: "Play What's Popular Nearby",
                  description: "Play songs that are popular in Alex's city — feels more personal.",
                },
                {
                  id: "genre-quick-pick",
                  label: "Tap a Few Genres",
                  description: "Show 6 big bubbles like \"Pop\", \"Hip-Hop\", \"Rock\" — just tap a couple.",
                },
                {
                  id: "trust-the-algo",
                  label: "Just Play Hits",
                  description: "Play the most popular songs everywhere. The app will figure Alex out within a day.",
                },
              ],
            },
          },
        ],
      },
      // ── TEST ──────────────────────────────
      {
        id: "spotify-testing",
        order: 4,
        round: 4,
        type: "branching_path",
        scenarioText:
          "Before launching the redesign to everyone, how should Spotify test it?",
        context:
          "A bad update could make millions of people upset. Spotify needs to make sure the new design actually works better before giving it to everyone. Testing helps catch problems early.",
        branches: [
          {
            id: "ab-test",
            label: "Show It to Half the Users",
            description:
              "Give the new design to half the users and keep the old design for the other half. Compare which group likes theirs more.",
            followUp: {
              scenarioText: "How long should the test run before deciding?",
              choices: [
                {
                  id: "one-week",
                  label: "1 Week",
                  description: "Quick results. But some people need more time to get used to changes.",
                },
                {
                  id: "one-month",
                  label: "1 Month",
                  description: "More accurate. Gives people time to really try the new design.",
                },
                {
                  id: "until-clear",
                  label: "Until the Data Is Clear",
                  description: "Keep running until there's a clear winner. Could be short or long.",
                },
              ],
            },
          },
          {
            id: "beta-testers",
            label: "Ask Volunteers to Try It",
            description:
              "Let people sign up to try the new design early and give feedback. Only people who want to test it will see it.",
            followUp: {
              scenarioText: "How should testers give feedback?",
              choices: [
                {
                  id: "in-app-survey",
                  label: "Quick Survey Inside the App",
                  description: "Pop up a short survey after they've used it for a few days.",
                },
                {
                  id: "feedback-button",
                  label: "\"Tell Us What You Think\" Button",
                  description: "A button always visible so testers can share thoughts anytime.",
                },
                {
                  id: "watch-behavior",
                  label: "Just Watch What They Do",
                  description: "Don't ask anything. Track what they tap, how long they stay, what they skip.",
                },
              ],
            },
          },
          {
            id: "gradual-rollout",
            label: "Roll It Out Slowly",
            description:
              "Give the new design to 1% of users first, then 10%, then 50%, then everyone. Stop if something goes wrong.",
            followUp: {
              scenarioText: "What should make Spotify stop the rollout?",
              choices: [
                {
                  id: "complaints-spike",
                  label: "Too Many Complaints",
                  description: "Stop if the number of people contacting support goes up a lot.",
                },
                {
                  id: "usage-drops",
                  label: "People Use It Less",
                  description: "Stop if people are opening the app less than before.",
                },
                {
                  id: "auto-monitor",
                  label: "Computer Watches Everything",
                  description: "A smart computer watches all the numbers and stops automatically if anything looks bad.",
                },
              ],
            },
          },
        ],
      },
    ],
    scoringCriteria: [
      "Thinking about what the user needs",
      "Making choices that work well together",
      "Understanding the tradeoffs",
      "Explaining your thinking clearly",
    ],
    difficulty: "beginner",
    learningObjectives: [
      "Understand how the home screen affects what people do in the app",
      "Learn to balance keeping things simple vs. having lots of features",
      "Think about whether adding friend features makes a music app better or worse",
      "See how the first experience shapes whether someone keeps using an app",
      "Learn why testing a design before launching it is important",
    ],
    whatsBroken: [
      "Home screen is the same for everyone — no personalization",
      "The buttons at the bottom hide popular features",
      "No way to share music with friends inside the app",
    ],
    successHints: [
      "Think about Alex — they want the right song fast, not endless scrolling",
      "Most people replay the same songs, but some want to discover new ones. How do you help both?",
      "Friend features should make the music better, not turn it into a social media app",
      "If the first experience is boring or hard, people will just delete the app",
      "Testing helps you fix problems before millions of people see them",
    ],
    designTips: {
      "spotify-home-layout":
        "The best home screen shows you what you need without making you think. What does Alex need in the morning vs. at the gym?",
      "spotify-nav-complexity":
        "Apps with 3-5 buttons work best. Too few hides stuff. Too many is confusing.",
      "spotify-social":
        "Social features in a music app should help you discover songs, not distract from listening.",
      "spotify-onboarding":
        "The best first experience is fast, fun, and teaches the app what you like right away.",
      "spotify-testing":
        "Testing with real people catches problems you'd never think of on your own.",
    },
    funFact:
      "Did you know? Spotify's Discover Weekly playlist has been listened to for over 2.3 billion hours. That's like listening to music non-stop for over 260,000 years!",
  },
  {
    id: "roblox",
    productName: "Roblox",
    productType: "Gaming Platform",
    shortDescription:
      "Redesign how players find games and play with friends on Roblox.",
    story:
      "Roblox has millions of games, but it's really hard to find the good ones. Most players only play the same popular games over and over. And if you make a game, almost nobody will ever find it. Your team gets to redesign Roblox so players find awesome games and creators get noticed!",
    persona: {
      name: "Maya Torres",
      age: 11,
      occupation: "5th Grader & Game Creator",
      bio: "Maya plays Roblox every day after school. She's built 3 games in Roblox Studio but nobody plays them. She wants to find cool new games and get people to play the ones she made.",
      goals: [
        "Find fun new games quickly",
        "Play with friends without it being complicated",
        "Get people to discover and play her games",
      ],
    },
    decisions: [
      // ── EMPATHIZE ──────────────────────────────
      {
        id: "roblox-home-page",
        order: 0,
        round: 0,
        type: "branching_path",
        scenarioText:
          "Maya opens Roblox after school. What should she see first?",
        context:
          "Right now, the home page shows a wall of game pictures sorted by how many people are playing. The same 50 popular games are always on top. New games almost never show up.",
        branches: [
          {
            id: "trending",
            label: "What's Hot Right Now",
            description:
              "Show the most popular games right now with how many people are playing each one.",
            followUp: {
              scenarioText:
                "How should Roblox decide which games are \"hot\"?",
              choices: [
                {
                  id: "player-count",
                  label: "Most Players = Most Popular",
                  description: "The games with the most people playing right now go to the top.",
                },
                {
                  id: "growth-rate",
                  label: "Growing the Fastest",
                  description: "Games that are getting more players quickly, even if they're small.",
                },
                {
                  id: "editors-picks",
                  label: "Roblox Staff Picks",
                  description: "People who work at Roblox pick the best games to feature each week.",
                },
              ],
            },
          },
          {
            id: "for-you",
            label: "Picked Just for Maya",
            description:
              "The app uses a smart computer to suggest games Maya would probably like, based on what she's played before.",
            followUp: {
              scenarioText:
                "What should the computer focus on when picking games for Maya?",
              choices: [
                {
                  id: "similar-played",
                  label: "Games Like Ones She Plays",
                  description: "If Maya likes obbies, show her more obbies and similar games.",
                },
                {
                  id: "friends-enjoy",
                  label: "Games Her Friends Like",
                  description: "Show games that Maya's friends have played and enjoyed.",
                },
                {
                  id: "new-experiences",
                  label: "Try Something New",
                  description: "Show games from types Maya hasn't tried yet — maybe she'll discover a new favorite!",
                },
              ],
            },
          },
          {
            id: "friends-activity",
            label: "What Friends Are Playing",
            description:
              "Show Maya which of her friends are online right now and what games they're in, with a button to join them.",
            followUp: {
              scenarioText:
                "What if none of Maya's friends are online?",
              choices: [
                {
                  id: "recent-activity",
                  label: "Show What They Played Recently",
                  description: "Show what friends played in the last day, so Maya can try those games.",
                },
                {
                  id: "suggest-friends",
                  label: "Suggest New Friends",
                  description: "Help Maya connect with other players who like the same games she does.",
                },
                {
                  id: "fallback-trending",
                  label: "Switch to Popular Games",
                  description: "When no friends are online, show the most popular games instead.",
                },
              ],
            },
          },
        ],
      },
      // ── DEFINE ──────────────────────────────
      {
        id: "roblox-search",
        order: 1,
        round: 1,
        type: "branching_path",
        scenarioText:
          "Maya wants to find a new horror game to play with friends. How should searching for games work?",
        context:
          "Right now, you can only type words to search and it shows thousands of results. Most players never even use search — they just play whatever shows up on the home page.",
        branches: [
          {
            id: "smart-filters",
            label: "Filter Buttons",
            description:
              "Add buttons to filter by type (Horror, Tycoon, Obby), number of players, and whether friends are playing.",
            followUp: {
              scenarioText:
                "Which filter should be the biggest and most obvious?",
              choices: [
                {
                  id: "genre-tags",
                  label: "Game Type",
                  description: "Horror, Tycoon, Obby, Simulator, Roleplay, etc.",
                },
                {
                  id: "play-style",
                  label: "How You Want to Play",
                  description: "By yourself, with friends, competitive, or just for fun.",
                },
                {
                  id: "time-to-play",
                  label: "How Long It Takes",
                  description: "Quick (5 minutes), Medium (15 minutes), or Long (30+ minutes).",
                },
              ],
            },
          },
          {
            id: "visual-browse",
            label: "Swipe Through Previews",
            description:
              "Like TikTok — swipe through short video clips of games to see what they look like before you play.",
            followUp: {
              scenarioText:
                "What should the preview videos show?",
              choices: [
                {
                  id: "gameplay-footage",
                  label: "Real Gameplay",
                  description: "15-second clips recorded from actual people playing the game.",
                },
                {
                  id: "creator-trailers",
                  label: "Trailers Made by Creators",
                  description: "The person who made the game creates a cool trailer showing the best parts.",
                },
                {
                  id: "live-peek",
                  label: "Watch People Play Live",
                  description: "See what real players are doing in the game right now, like a live camera.",
                },
              ],
            },
          },
          {
            id: "ai-search",
            label: "Ask in Your Own Words",
            description:
              "Type something like \"Find me a scary game for 4 players with puzzles\" and a smart computer finds the best match.",
            followUp: {
              scenarioText:
                "What if Maya types something vague like \"something fun\"?",
              choices: [
                {
                  id: "ask-followups",
                  label: "Ask More Questions",
                  description: "The computer asks: \"What kind of fun? Scary fun? Silly fun? Adventure?\"",
                },
                {
                  id: "show-variety",
                  label: "Show a Mix of Everything",
                  description: "Show lots of different types of games and let Maya browse through them.",
                },
                {
                  id: "best-guess",
                  label: "Just Pick the Best One",
                  description: "The computer picks what it thinks is best. If Maya doesn't like it, it tries again.",
                },
              ],
            },
          },
        ],
      },
      // ── IDEATE ──────────────────────────────
      {
        id: "roblox-social",
        order: 2,
        round: 2,
        type: "branching_path",
        scenarioText:
          "Maya wants to play with her friends, but they're all in different games. How should playing together work?",
        context:
          "Right now you can add friends and join their game, but there's no way to pick a game together as a group. More than half of all play sessions are solo, even though most players would rather play with friends.",
        branches: [
          {
            id: "party-system",
            label: "Party Mode",
            description:
              "Make a party with your friends, look at games together, and jump into one as a group.",
            followUp: {
              scenarioText:
                "How should the group decide which game to play?",
              choices: [
                {
                  id: "leader-picks",
                  label: "The Leader Picks",
                  description: "One person picks the game and everyone follows. Quick but not everyone gets a say.",
                },
                {
                  id: "vote-system",
                  label: "Everyone Votes",
                  description: "Each person suggests a game and the group votes. Fair but takes longer.",
                },
                {
                  id: "spin-wheel",
                  label: "Spin a Wheel",
                  description: "Put all the suggestions on a wheel and spin it! Random and fun.",
                },
              ],
            },
          },
          {
            id: "activity-feed",
            label: "Friend Feed",
            description:
              "A page that shows what your friends are playing, what they achieved, and what new games they liked.",
            followUp: {
              scenarioText:
                "Should the feed update instantly or once a day?",
              choices: [
                {
                  id: "real-time",
                  label: "Update Instantly",
                  description: "See what friends do the moment it happens. Always up to date but can be a lot of info.",
                },
                {
                  id: "daily-digest",
                  label: "Once a Day Summary",
                  description: "Get a neat summary of what happened with friends once per day. Less overwhelming.",
                },
                {
                  id: "smart-timing",
                  label: "Show When You Log In",
                  description: "Save up all the updates and show them when Maya opens Roblox. Clean and timed well.",
                },
              ],
            },
          },
          {
            id: "coop-queue",
            label: "Auto-Match with Friends",
            description:
              "Get in line for a game together and the app puts your whole group in the same server automatically.",
            followUp: {
              scenarioText:
                "What if the game doesn't have room for Maya's whole friend group?",
              choices: [
                {
                  id: "auto-split",
                  label: "Split Into Smaller Groups",
                  description: "Put smaller groups on the same server so everyone can still play.",
                },
                {
                  id: "filter-only",
                  label: "Only Show Games That Fit",
                  description: "Only show games that have room for the whole group. No splitting.",
                },
                {
                  id: "notify-creator",
                  label: "Ask the Creator to Add More Spots",
                  description: "Send a message to the game creator saying \"Players want to play with bigger groups!\"",
                },
              ],
            },
          },
        ],
      },
      // ── PROTOTYPE ──────────────────────────────
      {
        id: "roblox-creator-discovery",
        order: 3,
        round: 3,
        type: "branching_path",
        scenarioText:
          "Maya made a really cool obby game, but nobody knows about it. How should Roblox help new game creators get noticed?",
        context:
          "Almost all new games get fewer than 100 plays in their first week. The home page keeps showing the same popular games over and over. New creators like Maya feel invisible.",
        branches: [
          {
            id: "creator-spotlight",
            label: "New Creator Spotlight",
            description:
              "A special section on the home page that shows games made by new creators. It changes every day.",
            followUp: {
              scenarioText:
                "How should Roblox pick which new games to feature?",
              choices: [
                {
                  id: "random-rotation",
                  label: "Everyone Gets a Turn",
                  description: "Pick randomly from new games so every creator gets a fair chance to be seen.",
                },
                {
                  id: "quality-threshold",
                  label: "Only Good-Quality Games",
                  description: "The game has to pass a basic check first (not broken, has a good thumbnail, etc.).",
                },
                {
                  id: "community-nominated",
                  label: "Players Nominate Games",
                  description: "Players can suggest cool games they found that deserve more attention.",
                },
              ],
            },
          },
          {
            id: "boost-system",
            label: "Starter Boost",
            description:
              "Every new game gets a boost that shows it to more people for a little while when it first comes out.",
            followUp: {
              scenarioText:
                "How long should the boost last?",
              choices: [
                {
                  id: "24-hours",
                  label: "1 Day",
                  description: "24 hours of extra attention. Creators need to make their game great before launching!",
                },
                {
                  id: "until-threshold",
                  label: "Until 1,000 Plays",
                  description: "The boost stays until the game gets 1,000 plays. Fair no matter when you launch.",
                },
                {
                  id: "performance-based",
                  label: "As Long as People Like It",
                  description: "The boost keeps going if players are enjoying the game. Good games get more time.",
                },
              ],
            },
          },
          {
            id: "creator-mentorship",
            label: "Creator Buddy Program",
            description:
              "Pair new creators like Maya with experienced ones who can give tips and feedback before the game launches.",
            followUp: {
              scenarioText:
                "What should the buddy help with?",
              choices: [
                {
                  id: "game-design",
                  label: "Making the Game Better",
                  description: "Help with how the game plays — is it fun? Too hard? Too easy?",
                },
                {
                  id: "marketing",
                  label: "Getting People to Notice",
                  description: "Help with the thumbnail, description, and how to share the game.",
                },
                {
                  id: "full-package",
                  label: "Everything",
                  description: "Help with both the game itself AND getting people to notice it.",
                },
              ],
            },
          },
        ],
      },
      // ── TEST ──────────────────────────────
      {
        id: "roblox-testing",
        order: 4,
        round: 4,
        type: "branching_path",
        scenarioText:
          "Before launching these changes to all of Roblox, how should the team test them?",
        context:
          "Roblox has millions of players. If a new design doesn't work well, it could ruin the experience for everyone. Testing with a small group first helps catch problems before they become big problems.",
        branches: [
          {
            id: "beta-group",
            label: "Test with Volunteers",
            description:
              "Let players sign up to try the new features early. They give feedback and help find problems.",
            followUp: {
              scenarioText: "How should the volunteers share their feedback?",
              choices: [
                {
                  id: "in-app-survey",
                  label: "Quick Survey in the App",
                  description: "A short survey pops up after they've tried the new features for a few days.",
                },
                {
                  id: "feedback-button",
                  label: "Feedback Button",
                  description: "A button that's always there so testers can share thoughts whenever they want.",
                },
                {
                  id: "watch-behavior",
                  label: "Just Watch What They Do",
                  description: "Don't ask anything. Watch how they use the new features and see if they're having fun.",
                },
              ],
            },
          },
          {
            id: "slow-rollout",
            label: "Roll It Out Slowly",
            description:
              "Give the new design to 1% of players first, then 10%, then 50%, then everyone. Stop and fix things if anything goes wrong.",
            followUp: {
              scenarioText: "What should make the team stop and fix things?",
              choices: [
                {
                  id: "complaints-spike",
                  label: "Lots of Complaints",
                  description: "Stop if way more players than normal start reporting problems.",
                },
                {
                  id: "usage-drops",
                  label: "People Play Less",
                  description: "Stop if people are spending less time on Roblox than before.",
                },
                {
                  id: "auto-monitor",
                  label: "Computer Watches Everything",
                  description: "A smart computer watches all the numbers and stops automatically if anything looks bad.",
                },
              ],
            },
          },
          {
            id: "school-playtest",
            label: "Test with a School",
            description:
              "Partner with a school and let students try the new Roblox in class. Watch how they use it and ask what they think.",
            followUp: {
              scenarioText: "What should the team pay the most attention to during the school test?",
              choices: [
                {
                  id: "watch-discovery",
                  label: "Can They Find Good Games?",
                  description: "Watch if students find games they enjoy faster than before.",
                },
                {
                  id: "watch-social",
                  label: "Do They Play Together?",
                  description: "Watch if students play with friends more easily than before.",
                },
                {
                  id: "ask-feelings",
                  label: "How Does It Feel?",
                  description: "Ask students if the new version feels more fun, easier, or more confusing.",
                },
              ],
            },
          },
        ],
      },
    ],
    scoringCriteria: [
      "Thinking about what players need",
      "Making choices that work well together",
      "Understanding the tradeoffs",
      "Explaining your thinking clearly",
    ],
    difficulty: "beginner",
    learningObjectives: [
      "Understand how the home page changes what games people find",
      "Learn to define a clear problem before jumping to solutions",
      "Practice brainstorming creative ideas for social features",
      "Design a real feature to help game creators get noticed",
      "Learn why testing a design before launching is important",
    ],
    whatsBroken: [
      "Home page only shows the same popular games — new games are invisible",
      "Search is confusing and shows too many results",
      "No way to pick a game together with friends as a group",
    ],
    successHints: [
      "Maya is both a player and a game creator — your choices should help her with both",
      "Almost all new games get ignored. How can your design change that?",
      "Playing with friends is the #1 reason people keep playing. Make it easy!",
      "If new creators can't get noticed, they'll stop making games — that's bad for everyone",
      "Testing helps you fix problems before millions of people see them",
    ],
    designTips: {
      "roblox-home-page":
        "The home page decides what games people play. Think about how to help people find new games, not just the same old popular ones.",
      "roblox-search":
        "Most players never use search because it's too hard. The best search feels easy and fun.",
      "roblox-social":
        "Playing with friends is the #1 reason people keep playing. Make it super easy.",
      "roblox-creator-discovery":
        "If new creators can't get anyone to play their games, they'll stop making games. That's bad for everyone!",
      "roblox-testing":
        "Testing with real people catches problems you'd never think of on your own.",
    },
    funFact:
      "Did you know? Roblox has over 40 million games created by players, but only about 5,000 have ever reached 1 million visits. That means 99.99% of games struggle to find players — how you design the home page literally decides which games succeed!",
  },
];
