import { CaseStudy } from "./types";

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "byte-burger",
    businessName: "Byte Burger",
    businessType: "Restaurant",
    story:
      "Byte Burger has been flipping the BEST burgers in town for 10 years — people line up around the block just for their famous Pixel Patty! But here's the problem: their nephew tried to build them a website and... yikes. The navigation is a jumbled mess, there's no mouth-watering hero image to make you hungry, the menu is just a boring wall of text, and the footer links are totally broken. Your mission? Save Byte Burger's online reputation and make their site as tasty as their food!",
    brokenSections: [
      {
        id: "slot-header",
        label: "Header / Navigation",
        assignedTo: null,
        turnOrder: 0,
        placedComponent: null,
        status: "empty",
      },
      {
        id: "slot-hero",
        label: "Hero Section",
        assignedTo: null,
        turnOrder: 0,
        placedComponent: null,
        status: "empty",
      },
      {
        id: "slot-features",
        label: "Menu / Features",
        assignedTo: null,
        turnOrder: 1,
        placedComponent: null,
        status: "empty",
      },
      {
        id: "slot-testimonials",
        label: "Reviews / Testimonials",
        assignedTo: null,
        turnOrder: 1,
        placedComponent: null,
        status: "empty",
      },
      {
        id: "slot-cta",
        label: "Call to Action",
        assignedTo: null,
        turnOrder: 2,
        placedComponent: null,
        status: "empty",
      },
      {
        id: "slot-footer",
        label: "Footer",
        assignedTo: null,
        turnOrder: 2,
        placedComponent: null,
        status: "empty",
      },
    ],
    idealCategories: {
      "slot-header": ["headers"],
      "slot-hero": ["hero_sections"],
      "slot-features": ["feature_sections", "bento_grids"],
      "slot-testimonials": ["testimonials"],
      "slot-cta": ["cta_sections"],
      "slot-footer": ["footers"],
    },
    scoringCriteria: [
      "Clear navigation with restaurant name visible",
      "Appetizing hero image or visual",
      "Menu items are easy to read and organized",
      "Customer reviews build trust",
      "Clear call-to-action (Order Now, Visit Us)",
      "Footer has contact info and hours",
    ],
    difficulty: "beginner",
    learningObjectives: [
      "Understand what a website header/nav does and why it matters",
      "Learn how hero sections grab a visitor's attention",
      "See how organizing content (like a menu) makes it easier to read",
      "Discover why footers need working links and contact info",
    ],
    whatsBroken: [
      "The navigation bar is confusing — visitors can't find anything!",
      "There's no hero image — the site looks boring and doesn't make you hungry",
      "The menu section is a wall of text with no organization",
      "Footer links are broken and there's no way to find the address or hours",
    ],
    successHints: [
      "Look for headers that clearly show a business name and have simple navigation links",
      "Pick a hero section with space for a big, bold image — food places NEED appetizing visuals!",
      "Choose a features section that organizes items into columns or cards — nobody wants to read a text wall",
      "Make sure your footer has room for an address, phone number, and hours",
    ],
    designTips: {
      "slot-header":
        "Pick a header that shows the restaurant name BIG and CLEAR. Visitors should know they're at Byte Burger within 2 seconds! Look for one with easy navigation links.",
      "slot-hero":
        "This is the FIRST thing people see! Choose a hero with a big image area — imagine a juicy burger photo here. It should make people say 'I NEED to eat there!'",
      "slot-features":
        "The menu needs to be organized! Look for a features section with cards, columns, or grids. Each menu item should be easy to scan — no one reads a giant paragraph when they're hungry.",
      "slot-testimonials":
        "Customer reviews build TRUST. Pick a testimonial section that shows star ratings or quotes. When people see others loving the food, they want to try it too!",
      "slot-cta":
        "CTA means 'Call to Action' — it's the part that tells visitors what to DO. Pick one that could say 'Order Now' or 'Visit Us Today' with a big, clickable button.",
      "slot-footer":
        "The footer is at the bottom of every website. It should have the restaurant's address, phone number, hours, and social media links. Pick one that's clean and organized.",
    },
    funFact:
      "Did you know? The average person decides whether to stay on a website or leave within just 3 seconds! That's why the hero section is SO important — it's your first impression!",
  },
  {
    id: "technova",
    businessName: "TechNova",
    businessType: "SaaS Startup",
    story:
      "TechNova built an AMAZING project management app that helps small teams get stuff done — think of it like a super-powered to-do list for groups! But their website was thrown together during a 24-hour hackathon (a coding marathon), and it shows. There's no clear explanation of what the app actually DOES, the features are hidden in walls of text, pricing is nowhere to be found, and there's no sign-up button. They're losing potential customers every single day! Can your team create a landing page that makes people want to try TechNova?",
    brokenSections: [
      {
        id: "slot-header",
        label: "Header / Navigation",
        assignedTo: null,
        turnOrder: 0,
        placedComponent: null,
        status: "empty",
      },
      {
        id: "slot-hero",
        label: "Hero Section",
        assignedTo: null,
        turnOrder: 0,
        placedComponent: null,
        status: "empty",
      },
      {
        id: "slot-features",
        label: "Features Section",
        assignedTo: null,
        turnOrder: 1,
        placedComponent: null,
        status: "empty",
      },
      {
        id: "slot-pricing",
        label: "Pricing Section",
        assignedTo: null,
        turnOrder: 1,
        placedComponent: null,
        status: "empty",
      },
      {
        id: "slot-cta",
        label: "Call to Action",
        assignedTo: null,
        turnOrder: 2,
        placedComponent: null,
        status: "empty",
      },
      {
        id: "slot-footer",
        label: "Footer",
        assignedTo: null,
        turnOrder: 2,
        placedComponent: null,
        status: "empty",
      },
    ],
    idealCategories: {
      "slot-header": ["headers"],
      "slot-hero": ["hero_sections"],
      "slot-features": ["feature_sections", "bento_grids"],
      "slot-pricing": ["pricing_sections"],
      "slot-cta": ["cta_sections"],
      "slot-footer": ["footers"],
    },
    scoringCriteria: [
      "Clear value proposition in hero",
      "Features are scannable, not walls of text",
      "Pricing is transparent and easy to compare",
      "Strong CTA (Start Free Trial, Sign Up)",
      "Professional, trustworthy appearance",
      "Footer includes legal and contact links",
    ],
    difficulty: "intermediate",
    learningObjectives: [
      "Learn how to communicate a product's value clearly (value proposition)",
      "Understand how to present features so they're easy to scan",
      "See why transparent pricing helps customers make decisions",
      "Discover what makes a 'Call to Action' button effective",
    ],
    whatsBroken: [
      "No clear value proposition — visitors have no idea what TechNova does!",
      "Features are buried in huge paragraphs that nobody will read",
      "There's zero pricing information — people don't trust that",
      "No sign-up or free trial button anywhere — how do you even start using it?!",
    ],
    successHints: [
      "The hero should explain WHAT TechNova does and WHY it's awesome in one sentence",
      "Features work best as short bullet points or icon cards — keep it scannable",
      "Show pricing tiers side by side so users can compare easily",
      "Your CTA should say something action-oriented like 'Start Free Trial' — make it impossible to miss",
    ],
    designTips: {
      "slot-header":
        "A SaaS (Software as a Service) site needs a clean, professional header. Look for one with a logo area and navigation links like 'Features', 'Pricing', and 'Sign Up'.",
      "slot-hero":
        "The hero needs to answer ONE question: 'What does this app do and why should I care?' Pick one with space for a headline, a short description, and a big CTA button.",
      "slot-features":
        "This is where you show off what TechNova can do! Pick a features section with icons or images next to short descriptions. Think: 'Task Tracking', 'Team Chat', 'File Sharing'.",
      "slot-pricing":
        "People want to know the cost BEFORE they sign up. Choose a pricing section with 2-3 tiers side by side (like Free, Pro, Team). Make it easy to compare!",
      "slot-cta":
        "This is your last chance to convince someone to sign up! Pick a CTA section with a strong headline and a button that says something like 'Get Started Free'.",
      "slot-footer":
        "A professional footer for a tech company should have links to legal stuff (Privacy Policy, Terms), social media, and maybe a 'Contact Us' option.",
    },
    funFact:
      "Did you know? Companies that show transparent pricing on their website get up to 2x more sign-ups than those that hide it. That's why the pricing section is so important!",
  },
  {
    id: "greenleaf-studio",
    businessName: "GreenLeaf Studio",
    businessType: "Design Agency",
    story:
      "GreenLeaf Studio is a creative design agency that makes logos, websites, and brand identities for other businesses — they're basically the artists of the internet! But here's the ironic part: their OWN website looks terrible. The layout is cluttered and messy, there's no portfolio showing off their amazing work, the team page is completely missing (so you don't know who these people are), and the footer is ugly. There's a saying: 'the cobbler's children have no shoes' — meaning experts sometimes forget to help themselves! Prove them wrong and build GreenLeaf a site that screams CREATIVITY.",
    brokenSections: [
      {
        id: "slot-header",
        label: "Header / Navigation",
        assignedTo: null,
        turnOrder: 0,
        placedComponent: null,
        status: "empty",
      },
      {
        id: "slot-hero",
        label: "Hero Section",
        assignedTo: null,
        turnOrder: 0,
        placedComponent: null,
        status: "empty",
      },
      {
        id: "slot-content",
        label: "Portfolio / Content",
        assignedTo: null,
        turnOrder: 1,
        placedComponent: null,
        status: "empty",
      },
      {
        id: "slot-team",
        label: "Team Section",
        assignedTo: null,
        turnOrder: 1,
        placedComponent: null,
        status: "empty",
      },
      {
        id: "slot-contact",
        label: "Contact Section",
        assignedTo: null,
        turnOrder: 2,
        placedComponent: null,
        status: "empty",
      },
      {
        id: "slot-footer",
        label: "Footer",
        assignedTo: null,
        turnOrder: 2,
        placedComponent: null,
        status: "empty",
      },
    ],
    idealCategories: {
      "slot-header": ["headers"],
      "slot-hero": ["hero_sections"],
      "slot-content": ["content_sections", "blog_sections", "bento_grids"],
      "slot-team": ["team_sections"],
      "slot-contact": ["contact_sections"],
      "slot-footer": ["footers"],
    },
    scoringCriteria: [
      "Clean, modern navigation",
      "Visually striking hero that shows creativity",
      "Portfolio/work showcase is organized",
      "Team section builds personal connection",
      "Easy to contact the agency",
      "Footer is clean and professional",
    ],
    difficulty: "advanced",
    learningObjectives: [
      "Learn how visual design communicates creativity and trust",
      "Understand how portfolios showcase work to attract clients",
      "See why a team section builds personal connection with visitors",
      "Discover how a design agency's site should reflect their own skills",
    ],
    whatsBroken: [
      "The layout is cluttered — nothing has breathing room or visual hierarchy",
      "There's no portfolio section — how can a design agency NOT show their work?!",
      "The team page is missing — clients want to know who they'll be working with",
      "The footer looks rushed and unprofessional — not great for a company that sells design!",
    ],
    successHints: [
      "A design agency site should FEEL creative — pick components with bold layouts and lots of white space",
      "The portfolio/content section should display work in a grid or gallery format",
      "The team section should show faces and names — people trust people, not logos",
      "Even the footer matters! A design agency's footer should be as polished as everything else",
    ],
    designTips: {
      "slot-header":
        "A design agency's header should be minimal and elegant. Less is more! Pick one that lets the work speak for itself — clean fonts, simple navigation.",
      "slot-hero":
        "Go BIG and BOLD with the hero! A design agency needs to show off their creativity right away. Look for a hero with a striking visual layout.",
      "slot-content":
        "This is the PORTFOLIO section — the most important part! Pick a content section that displays images or projects in a beautiful grid. Think of it like an art gallery.",
      "slot-team":
        "People hire people, not companies. Choose a team section that shows photos, names, and roles. It makes the agency feel friendly and trustworthy.",
      "slot-contact":
        "Clients need to reach out easily! Pick a contact section with a form, email, phone, and maybe a map. Make it inviting, not intimidating.",
      "slot-footer":
        "The footer should be as beautiful as the rest of the site. A design agency can't have an ugly footer — it's like a chef serving dessert on a paper plate!",
    },
    funFact:
      "Did you know? It takes only 0.05 seconds (50 milliseconds!) for a visitor to form an opinion about a website's design. That's faster than a blink of an eye! That's why visual design matters SO much.",
  },
  {
    id: "fittrack",
    businessName: "FitTrack",
    businessType: "Fitness App",
    story:
      "FitTrack is a fitness tracking app that helps people set goals, track workouts, and crush their health targets — like having a personal trainer in your pocket! But their landing page is a total mess. There's no social proof showing how many people already use it, the pricing tiers are confusing, the features aren't explained well, and there's no obvious download button. They're losing potential users every single day because people visit the site, get confused, and leave. Your team needs to build a landing page that makes people want to download FitTrack RIGHT NOW!",
    brokenSections: [
      {
        id: "slot-header",
        label: "Header / Navigation",
        assignedTo: null,
        turnOrder: 0,
        placedComponent: null,
        status: "empty",
      },
      {
        id: "slot-hero",
        label: "Hero Section",
        assignedTo: null,
        turnOrder: 0,
        placedComponent: null,
        status: "empty",
      },
      {
        id: "slot-features",
        label: "App Features",
        assignedTo: null,
        turnOrder: 1,
        placedComponent: null,
        status: "empty",
      },
      {
        id: "slot-testimonials",
        label: "Testimonials",
        assignedTo: null,
        turnOrder: 1,
        placedComponent: null,
        status: "empty",
      },
      {
        id: "slot-stats",
        label: "Stats / Social Proof",
        assignedTo: null,
        turnOrder: 2,
        placedComponent: null,
        status: "empty",
      },
      {
        id: "slot-footer",
        label: "Footer",
        assignedTo: null,
        turnOrder: 2,
        placedComponent: null,
        status: "empty",
      },
    ],
    idealCategories: {
      "slot-header": ["headers"],
      "slot-hero": ["hero_sections"],
      "slot-features": ["feature_sections"],
      "slot-testimonials": ["testimonials"],
      "slot-stats": ["stats_sections", "logo_clouds"],
      "slot-footer": ["footers"],
    },
    scoringCriteria: [
      "Clear app branding in header",
      "Hero makes you want to download the app",
      "Features show app benefits clearly",
      "Testimonials feel authentic and motivating",
      "Stats build credibility (users, downloads, etc.)",
      "Footer has download links and social media",
    ],
    difficulty: "intermediate",
    learningObjectives: [
      "Learn how social proof (stats, testimonials) builds trust",
      "Understand how to present app features visually",
      "See how a strong hero section drives app downloads",
      "Discover why stats and numbers are more convincing than just words",
    ],
    whatsBroken: [
      "No social proof — visitors don't know if anyone actually uses this app",
      "Pricing tiers are confusing and hard to compare",
      "Features aren't explained clearly — what does this app actually do?",
      "There's no download button! People can't figure out how to get the app!",
    ],
    successHints: [
      "Use a hero that makes fitness feel exciting and achievable — show the app in action!",
      "Feature sections with icons work great for apps — each feature gets its own card",
      "Testimonials from real users are GOLD — pick ones that show names and photos",
      "Stats sections with big numbers (like '500K+ Users') instantly build credibility",
    ],
    designTips: {
      "slot-header":
        "A fitness app header should feel energetic and motivating! Look for one with a clean logo area and links like 'Features', 'Pricing', and 'Download'.",
      "slot-hero":
        "The hero is everything! Pick one that could show the app on a phone screen with a big 'Download Now' button. It should make people feel motivated!",
      "slot-features":
        "Show what FitTrack can do! Choose a features section with icons — think: 'Workout Tracking', 'Goal Setting', 'Progress Charts', 'Community Challenges'.",
      "slot-testimonials":
        "Pick testimonials that feel real and personal. Look for a section with photos, names, and star ratings. Real stories from real users = instant trust!",
      "slot-stats":
        "Numbers are POWERFUL. Pick a stats section that can show things like '500K+ Downloads', '4.8 Rating', '50M+ Workouts Logged'. Big numbers = big credibility!",
      "slot-footer":
        "A fitness app footer should have download links (App Store, Google Play), social media, and maybe a newsletter signup.",
    },
    funFact:
      "Did you know? Websites with customer testimonials see a 34% increase in conversions (meaning more people take action). Social proof is like peer pressure, but for websites — and it works!",
  },
  {
    id: "pawpals",
    businessName: "PawPals",
    businessType: "Pet Adoption Nonprofit",
    story:
      "PawPals is a local animal shelter with the most adorable rescue pets you've ever seen — from playful puppies to chill cats to the occasional quirky hamster! Their mission is to find every animal a loving forever home. But their website hasn't been updated in YEARS. There's no story about their mission, no team page showing the amazing volunteers, and their adoption stats (like how many animals they've saved) are hidden. People visit the site and leave without adopting or donating because the site doesn't pull at their heartstrings. Help PawPals tell their story and save more furry lives!",
    brokenSections: [
      {
        id: "slot-header",
        label: "Header / Navigation",
        assignedTo: null,
        turnOrder: 0,
        placedComponent: null,
        status: "empty",
      },
      {
        id: "slot-hero",
        label: "Hero Section",
        assignedTo: null,
        turnOrder: 0,
        placedComponent: null,
        status: "empty",
      },
      {
        id: "slot-about",
        label: "About / Mission",
        assignedTo: null,
        turnOrder: 1,
        placedComponent: null,
        status: "empty",
      },
      {
        id: "slot-stats",
        label: "Adoption Stats",
        assignedTo: null,
        turnOrder: 1,
        placedComponent: null,
        status: "empty",
      },
      {
        id: "slot-cta",
        label: "Donate / Adopt CTA",
        assignedTo: null,
        turnOrder: 2,
        placedComponent: null,
        status: "empty",
      },
      {
        id: "slot-footer",
        label: "Footer",
        assignedTo: null,
        turnOrder: 2,
        placedComponent: null,
        status: "empty",
      },
    ],
    idealCategories: {
      "slot-header": ["headers"],
      "slot-hero": ["hero_sections"],
      "slot-about": ["content_sections", "header_sections"],
      "slot-stats": ["stats_sections"],
      "slot-cta": ["cta_sections", "newsletter_sections"],
      "slot-footer": ["footers"],
    },
    scoringCriteria: [
      "Warm, inviting navigation with shelter name",
      "Emotional hero that connects with visitors",
      "Clear mission statement and story",
      "Impactful stats (animals saved, adopted, etc.)",
      "Strong CTA to donate or adopt",
      "Footer with address, hours, and social links",
    ],
    difficulty: "beginner",
    learningObjectives: [
      "Learn how emotional storytelling connects with website visitors",
      "Understand why an 'About/Mission' section builds trust for nonprofits",
      "See how statistics make an organization's impact feel real",
      "Discover how a strong CTA drives donations and adoptions",
    ],
    whatsBroken: [
      "There's no mission statement — visitors don't understand what PawPals does or why",
      "No team page — the amazing volunteers and staff are invisible!",
      "Adoption stats are hidden — people don't see the shelter's incredible impact",
      "There's no clear way to donate or start the adoption process",
    ],
    successHints: [
      "The hero should be emotional — think cute animal photos with a heartfelt headline",
      "The about/mission section should tell PawPals' story: why they exist and what they believe",
      "Use a stats section to show impact: '2,000+ Pets Adopted', '500+ Volunteers', etc.",
      "The CTA should make it super easy to donate or start adopting — one big button!",
    ],
    designTips: {
      "slot-header":
        "A nonprofit shelter header should feel warm and welcoming. Look for one with a friendly style — not too corporate. Navigation links like 'About', 'Adopt', 'Donate' work great.",
      "slot-hero":
        "This is where you pull at heartstrings! Pick a hero that could show an adorable rescue pet with a headline like 'Every Pet Deserves a Home'. Make people feel something!",
      "slot-about":
        "The mission section tells PawPals' story. Pick a content section with space for a paragraph explaining WHY PawPals exists, how many years they've been helping animals, etc.",
      "slot-stats":
        "Show the impact with BIG numbers! Choose a stats section for things like '2,500+ Pets Adopted', '98% Adoption Rate', '15 Years of Love'. Numbers make the mission feel REAL.",
      "slot-cta":
        "This is the most important section for a nonprofit! Pick a CTA that drives action — 'Adopt Today', 'Donate Now', or 'Foster a Pet'. Make the button BIG and impossible to miss!",
      "slot-footer":
        "The shelter footer should have the address, visiting hours, phone number, and links to social media (people love following shelter pets on Instagram!).",
    },
    funFact:
      "Did you know? Animal shelters that have modern, well-designed websites see up to 40% more adoption applications! A good website literally saves lives!",
  },
];
