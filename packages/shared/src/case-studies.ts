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
    id: "youtube",
    productName: "YouTube",
    productType: "Video Platform",
    shortDescription:
      "Redesign YouTube so it's awesome and safe for kids who create and watch videos.",
    story:
      "YouTube has billions of videos, but it can be hard for kids to find good stuff without getting sucked into watching for hours. And if you make your own videos, it's almost impossible to get anyone to watch them. Your team gets to redesign YouTube so it's more fun, safer, and better for young creators!",
    persona: {
      name: "Jordan Rivera",
      age: 11,
      occupation: "5th Grader & LEGO YouTuber",
      bio: "Jordan watches YouTube every day after school and has a small channel where they post LEGO build videos. They have 12 subscribers (mostly family). Jordan wants to grow their channel but also struggles with spending too much time watching videos.",
      goals: [
        "Find cool videos without wasting hours scrolling",
        "Get more people to watch their LEGO videos",
        "Stay safe from mean comments and weird content",
      ],
    },
    decisions: [
      // ── EMPATHIZE ──────────────────────────────
      {
        id: "youtube-home-feed",
        order: 0,
        round: 0,
        type: "branching_path",
        scenarioText:
          "Jordan opens YouTube after school. What should they see on the home page?",
        context:
          "Right now, the home page shows a long wall of recommended videos picked by a computer. The computer mostly suggests videos that keep you watching the longest — not necessarily the best ones. Kids often end up watching for way longer than they planned.",
        branches: [
          {
            id: "topic-based",
            label: "Pick a Topic First",
            description:
              "Instead of a wall of random videos, Jordan picks a topic first — like LEGO, science experiments, or funny animals — and then sees videos about that topic.",
            followUp: {
              scenarioText:
                "What if Jordan doesn't know what they want to watch?",
              choices: [
                {
                  id: "surprise-me",
                  label: "\"Surprise Me!\" Button",
                  description: "A fun button that picks a random topic and shows cool videos Jordan hasn't seen before.",
                },
                {
                  id: "top-three",
                  label: "Show Top 3 Topics",
                  description: "Show the 3 topics Jordan watches most, so they can jump right in.",
                },
                {
                  id: "explore-wheel",
                  label: "Spin a Topic Wheel",
                  description: "A colorful wheel with different topics. Spin it and see what you land on!",
                },
              ],
            },
          },
          {
            id: "friends-trending",
            label: "What Friends Are Watching",
            description:
              "Show videos that Jordan's friends and classmates have liked or shared recently, so they can watch the same stuff and talk about it at school.",
            followUp: {
              scenarioText:
                "What if Jordan's friends are watching stuff that isn't great for kids?",
              choices: [
                {
                  id: "age-filter",
                  label: "Age Filter",
                  description: "Only show friend videos that are rated safe for kids under 13.",
                },
                {
                  id: "teacher-approved",
                  label: "Teacher/Parent Approved",
                  description: "A trusted adult can mark which friend recommendations are okay to show.",
                },
                {
                  id: "mix-sources",
                  label: "Mix Friends + Safe Picks",
                  description: "Show some friend picks and some YouTube-approved kid-friendly videos together.",
                },
              ],
            },
          },
          {
            id: "mood-picker",
            label: "How Are You Feeling?",
            description:
              "Jordan picks a mood — like \"I want to laugh,\" \"I want to learn something,\" or \"I'm bored\" — and YouTube picks videos that match.",
            followUp: {
              scenarioText:
                "How many mood options should there be?",
              choices: [
                {
                  id: "four-moods",
                  label: "4 Big Moods",
                  description: "Happy, Curious, Bored, Chill — keep it simple with big colorful buttons.",
                },
                {
                  id: "emoji-picker",
                  label: "Emoji Mood Board",
                  description: "A grid of emojis that Jordan taps to show how they feel. Fun and expressive!",
                },
                {
                  id: "mood-learns",
                  label: "It Learns Your Moods",
                  description: "Over time, YouTube figures out that Jordan is usually curious after school and chill on weekends.",
                },
              ],
            },
          },
        ],
      },
      // ── DEFINE ──────────────────────────────
      {
        id: "youtube-screen-time",
        order: 1,
        round: 1,
        type: "branching_path",
        scenarioText:
          "Jordan keeps watching YouTube for 3 hours without realizing it. How should YouTube help kids manage their watch time?",
        context:
          "Studies show that most kids spend way more time on YouTube than they planned. The app is designed to keep playing the next video automatically, which makes it hard to stop. Parents get frustrated, and kids feel bad afterward.",
        branches: [
          {
            id: "gentle-reminders",
            label: "Friendly Reminders",
            description:
              "After a while, a friendly message pops up saying something like \"You've been watching for an hour! Maybe take a break?\" Jordan can snooze it or stop.",
            followUp: {
              scenarioText:
                "How often should the reminders pop up?",
              choices: [
                {
                  id: "every-30",
                  label: "Every 30 Minutes",
                  description: "Frequent enough to keep Jordan aware, but might get annoying.",
                },
                {
                  id: "every-60",
                  label: "Every Hour",
                  description: "Less annoying, but Jordan might already be deep into a binge by then.",
                },
                {
                  id: "smart-timing",
                  label: "Between Videos Only",
                  description: "Only show reminders when a video ends, never in the middle of one.",
                },
              ],
            },
          },
          {
            id: "watch-budget",
            label: "Daily Watch Budget",
            description:
              "Jordan (or their parents) sets a daily limit like 1 hour. A fun progress bar shows how much time is left, like a battery draining.",
            followUp: {
              scenarioText:
                "What happens when Jordan uses up all their watch time?",
              choices: [
                {
                  id: "hard-stop",
                  label: "Videos Stop Playing",
                  description: "YouTube stops playing videos and suggests doing something else, like going outside.",
                },
                {
                  id: "earn-more",
                  label: "Earn Bonus Time",
                  description: "Jordan can earn extra minutes by doing something creative, like uploading a video or leaving a nice comment.",
                },
                {
                  id: "wind-down",
                  label: "Wind-Down Mode",
                  description: "The screen slowly goes gray and the next video doesn't auto-play. Jordan can still watch but it's less tempting.",
                },
              ],
            },
          },
          {
            id: "no-autoplay",
            label: "Stop Auto-Playing Videos",
            description:
              "Turn off the feature that automatically plays the next video. Jordan has to choose each video on purpose, so they don't accidentally watch for hours.",
            followUp: {
              scenarioText:
                "If videos don't auto-play, what should happen when a video ends?",
              choices: [
                {
                  id: "pick-next",
                  label: "Show 3 Choices",
                  description: "Show 3 video thumbnails and let Jordan pick which one to watch next.",
                },
                {
                  id: "done-screen",
                  label: "\"All Done!\" Screen",
                  description: "Show a fun screen that says \"Nice watching!\" with a button to keep going or leave.",
                },
                {
                  id: "challenge-prompt",
                  label: "Creative Challenge",
                  description: "After each video, suggest a fun activity: \"Can you build what you just watched?\"",
                },
              ],
            },
          },
        ],
      },
      // ── IDEATE ──────────────────────────────
      {
        id: "youtube-creator-tools",
        order: 2,
        round: 2,
        type: "branching_path",
        scenarioText:
          "Jordan has made 8 LEGO videos but only gets 5-10 views each. How should YouTube help small creators like Jordan get noticed?",
        context:
          "Almost all views on YouTube go to big channels with millions of subscribers. Small creators like Jordan feel invisible. If nobody watches their videos, they'll stop creating — and that means fewer cool videos for everyone.",
        branches: [
          {
            id: "creator-spotlight",
            label: "New Creator Spotlight",
            description:
              "A special section on the home page that features videos from small channels. It changes every day so lots of creators get a turn.",
            followUp: {
              scenarioText:
                "How should YouTube pick which small creators to spotlight?",
              choices: [
                {
                  id: "random-fair",
                  label: "Everyone Gets a Turn",
                  description: "Pick randomly so every small creator gets a fair chance to be seen.",
                },
                {
                  id: "quality-check",
                  label: "Only Good Videos",
                  description: "The video has to be decent quality first — good lighting, clear audio, interesting content.",
                },
                {
                  id: "viewer-nominated",
                  label: "Viewers Nominate",
                  description: "Viewers can tap a \"This deserves more views!\" button to recommend small creators.",
                },
              ],
            },
          },
          {
            id: "creator-coach",
            label: "Creator Coach",
            description:
              "A friendly AI helper inside YouTube that gives Jordan tips like \"Your thumbnail is too dark\" or \"Try adding music to your intro\" to help make better videos.",
            followUp: {
              scenarioText:
                "When should the coach give tips?",
              choices: [
                {
                  id: "after-upload",
                  label: "Right After Uploading",
                  description: "Check the video right away and suggest improvements before it goes live.",
                },
                {
                  id: "weekly-report",
                  label: "Weekly Report Card",
                  description: "Once a week, send Jordan a fun report showing what's working and what to try next.",
                },
                {
                  id: "ask-anytime",
                  label: "Ask Anytime",
                  description: "Jordan can ask the coach questions whenever they want, like a helpful teacher.",
                },
              ],
            },
          },
          {
            id: "collab-connector",
            label: "Collab Connector",
            description:
              "Match Jordan with other kid creators who make similar content, so they can collaborate on videos and share each other's audiences.",
            followUp: {
              scenarioText:
                "How should YouTube make sure collabs are safe for kids?",
              choices: [
                {
                  id: "parent-approved",
                  label: "Parents Approve First",
                  description: "Both kids' parents have to say yes before they can collaborate together.",
                },
                {
                  id: "in-app-only",
                  label: "Keep It Inside YouTube",
                  description: "Kids can only collaborate through YouTube's own tools — no sharing personal info.",
                },
                {
                  id: "mentor-supervised",
                  label: "Adult Mentor Helps",
                  description: "A YouTube mentor (like a teacher) helps guide the collab and makes sure everything's okay.",
                },
              ],
            },
          },
        ],
      },
      // ── PROTOTYPE ──────────────────────────────
      {
        id: "youtube-comments-safety",
        order: 3,
        round: 3,
        type: "branching_path",
        scenarioText:
          "Jordan got a mean comment on their latest LEGO video and it really hurt their feelings. How should YouTube make comments safer for kids?",
        context:
          "Comments can be awesome — people say nice things and give ideas. But mean comments, spam, and creepy messages are a big problem, especially for young creators. Some kids stop making videos entirely because of bad comments.",
        branches: [
          {
            id: "approve-first",
            label: "Approve Before Posting",
            description:
              "Jordan (or a parent) gets to read every comment before it shows up on the video. Mean comments never get posted.",
            followUp: {
              scenarioText:
                "What if Jordan gets tons of comments and can't review them all?",
              choices: [
                {
                  id: "ai-pre-filter",
                  label: "Computer Filters First",
                  description: "A smart computer removes obviously mean comments, and Jordan only reviews the ones that seem okay.",
                },
                {
                  id: "trusted-reviewers",
                  label: "Trusted Friends Help",
                  description: "Jordan picks a few trusted friends or family members who can help approve comments.",
                },
                {
                  id: "auto-approve-nice",
                  label: "Auto-Approve Nice Ones",
                  description: "Comments with positive words get posted automatically. Only questionable ones need review.",
                },
              ],
            },
          },
          {
            id: "smart-filter",
            label: "Smart Comment Filter",
            description:
              "A smart computer reads every comment and automatically hides mean, scary, or inappropriate ones. Only nice and helpful comments show up.",
            followUp: {
              scenarioText:
                "What if the filter accidentally hides a nice comment?",
              choices: [
                {
                  id: "hidden-folder",
                  label: "\"Maybe\" Folder",
                  description: "Comments the computer isn't sure about go into a special folder Jordan can check.",
                },
                {
                  id: "appeal-button",
                  label: "\"This Was Nice!\" Button",
                  description: "The person who wrote the comment can tap a button to ask Jordan to review it.",
                },
                {
                  id: "strict-is-fine",
                  label: "Better Safe Than Sorry",
                  description: "It's okay to hide a few nice comments if it means zero mean ones get through.",
                },
              ],
            },
          },
          {
            id: "reactions-only",
            label: "Reactions Only (No Text Comments)",
            description:
              "Replace text comments with emoji reactions and stickers. People can show they liked a video with a thumbs up, heart, or laughing face — no words allowed.",
            followUp: {
              scenarioText:
                "Viewers can't give specific feedback with just emojis. How do you fix that?",
              choices: [
                {
                  id: "quick-phrases",
                  label: "Pre-Written Phrases",
                  description: "Viewers pick from nice phrases like \"Great video!\" \"So creative!\" \"Made me smile!\"",
                },
                {
                  id: "video-responses",
                  label: "Video Replies",
                  description: "Instead of typing, viewers record a short video response. Harder to be mean on camera!",
                },
                {
                  id: "emoji-plus-topic",
                  label: "Emoji + What You Liked",
                  description: "Pick an emoji AND tap what you liked: \"The building,\" \"The music,\" \"The ending.\"",
                },
              ],
            },
          },
        ],
      },
      // ── TEST ──────────────────────────────
      {
        id: "youtube-testing",
        order: 4,
        round: 4,
        type: "branching_path",
        scenarioText:
          "Before launching these changes to all of YouTube, how should the team test them?",
        context:
          "YouTube has over 2 billion users. If a new feature doesn't work well or makes things less safe for kids, it could be a huge problem. Testing with a small group first helps catch issues before they affect everyone.",
        branches: [
          {
            id: "kid-testers",
            label: "Kid Testing Squad",
            description:
              "Invite kids (with parent permission) to try the new features and share what they think. Like a secret club for testing!",
            followUp: {
              scenarioText: "How should the kid testers share their feedback?",
              choices: [
                {
                  id: "fun-survey",
                  label: "Fun Survey with Emojis",
                  description: "A quick survey where kids rate features with emojis — super easy and fun to fill out.",
                },
                {
                  id: "video-diary",
                  label: "Video Diary",
                  description: "Kids record themselves using the new features and talking about what they like and don't like.",
                },
                {
                  id: "play-session",
                  label: "Watch Them Use It",
                  description: "YouTube team members watch kids use the features (with parents there) and take notes.",
                },
              ],
            },
          },
          {
            id: "slow-rollout",
            label: "Roll It Out Slowly",
            description:
              "Give the new features to 1% of users first, then 10%, then 50%, then everyone. Stop and fix things if anything goes wrong.",
            followUp: {
              scenarioText: "What should make the team stop and fix things?",
              choices: [
                {
                  id: "safety-reports",
                  label: "Safety Reports Go Up",
                  description: "Stop if more kids or parents report safety problems than before.",
                },
                {
                  id: "watch-time-spikes",
                  label: "Kids Watch WAY More",
                  description: "Stop if kids start watching way more than before — the new design might be too addictive.",
                },
                {
                  id: "creator-drops",
                  label: "Creators Stop Posting",
                  description: "Stop if small creators start posting fewer videos than before.",
                },
              ],
            },
          },
          {
            id: "school-testing",
            label: "Test at Schools",
            description:
              "Partner with schools and let students try the new YouTube in class. Teachers and students give feedback together.",
            followUp: {
              scenarioText: "What should the team pay the most attention to during school testing?",
              choices: [
                {
                  id: "safety-first",
                  label: "Is It Safe?",
                  description: "Watch if any inappropriate content slips through the new filters.",
                },
                {
                  id: "engagement-quality",
                  label: "Are Kids Finding Good Stuff?",
                  description: "Watch if students find educational and fun videos more easily than before.",
                },
                {
                  id: "creator-experience",
                  label: "Do Kids Want to Create?",
                  description: "See if the new tools make students excited to make their own videos.",
                },
              ],
            },
          },
        ],
      },
    ],
    scoringCriteria: [
      "Thinking about what young viewers and creators need",
      "Making choices that work well together",
      "Balancing fun with safety",
      "Explaining your thinking clearly",
    ],
    difficulty: "beginner",
    learningObjectives: [
      "Understand how the home page affects what videos kids watch",
      "Learn to define screen time problems and design real solutions",
      "Brainstorm creative ways to help small creators get discovered",
      "Design safety features that protect kids without ruining the fun",
      "Learn why testing with real users catches problems you'd never expect",
    ],
    whatsBroken: [
      "Home page recommends videos that keep you watching the longest, not the best ones",
      "Small creators like Jordan are invisible — almost nobody finds their videos",
      "Comments can be mean and unsafe, especially for young creators",
    ],
    successHints: [
      "Jordan is both a viewer and a creator — your choices should help with both",
      "Screen time features should feel helpful, not punishing. Nobody likes being told to stop having fun!",
      "If small creators can't get noticed, they'll stop making videos — that's bad for everyone",
      "Safety features should protect kids without making YouTube boring or annoying",
      "Testing with real kids catches problems adults would never think of",
    ],
    designTips: {
      "youtube-home-feed":
        "The home page decides what kids watch. Think about how to help Jordan find great videos without getting stuck in an endless scroll.",
      "youtube-screen-time":
        "The best screen time tools feel like a helpful friend, not a strict parent. How can you make stopping feel okay?",
      "youtube-creator-tools":
        "If nobody watches small creators' videos, they'll stop making them. That means less cool content for everyone!",
      "youtube-comments-safety":
        "Comments should make creators feel good and get useful feedback. One mean comment can ruin a kid's whole day.",
      "youtube-testing":
        "Testing with real kids catches problems adults would never think of. Kids use apps in surprising ways!",
    },
    funFact:
      "Did you know? Over 500 hours of video are uploaded to YouTube every single minute! That means if you tried to watch everything uploaded in just one day, it would take you over 80 years of non-stop watching!",
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
