/* ============================================
   RaxhuAI — Command Definitions & Responses
   ============================================ */

const Commands = {
  // ===== ABOUT =====
  about: {
    keywords: ['about', 'who is rashed', 'who are you', 'tell me about', 'about rashed', 'introduce', 'yourself', 'about you'],
    animation: 'explaining',
    response: {
      text: `Hey there! I'm <strong>Md Rashed Mahmud</strong> — a passionate <strong>Vibe Coder</strong> and aspiring <strong>Cybersecurity Expert</strong> from Bangladesh. 🇧🇩\n\nI'm currently pursuing my <strong>Diploma in Computer Science & Technology</strong> at <strong>Rangpur Polytechnic Institute</strong>. I love building creative web experiences using AI-powered development, 3D design, and modern animations.\n\nMy dream? To become a professional cybersecurity expert while crafting stunning digital experiences along the way! 🚀`,
      cards: null
    }
  },

  // ===== SKILLS =====
  skills: {
    keywords: ['skills', 'what can you do', 'your skills', 'expertise', 'technologies', 'tech stack', 'what do you know'],
    animation: 'excited',
    response: {
      text: `Here are the skills in my toolkit! 💪 Always learning and growing:`,
      cards: [
        { icon: '<i data-lucide="sparkles"></i>', title: 'Vibe Coding', desc: 'Building with AI-powered development flow', tags: ['AI', 'Creative'] },
        { icon: '<i data-lucide="brain"></i>', title: 'Prompt Engineering', desc: 'Crafting precise prompts for AI tools', tags: ['AI', 'Strategy'] },
        { icon: '<i data-lucide="globe"></i>', title: '3D Website Design', desc: 'Immersive 3D web experiences', tags: ['Three.js', 'WebGL'] },
        { icon: '<i data-lucide="clapperboard"></i>', title: 'Animation', desc: 'CSS & JS animations that bring UIs to life', tags: ['CSS', 'Motion'] },
        { icon: '<i data-lucide="lock"></i>', title: 'Cybersecurity', desc: 'Learning ethical hacking & security', tags: ['Security', 'Learning'] },
        { icon: '<i data-lucide="terminal"></i>', title: 'Web Development', desc: 'HTML, CSS, JavaScript — the holy trinity', tags: ['Frontend', 'Dev'] }
      ],
      skillBars: [
        { name: 'Vibe Coding', level: 90 },
        { name: 'Prompt Engineering', level: 85 },
        { name: '3D Web Design', level: 75 },
        { name: 'Animation & Motion', level: 80 },
        { name: 'Cybersecurity', level: 60 },
        { name: 'HTML/CSS/JS', level: 78 }
      ]
    }
  },

  // ===== PROJECTS =====
  projects: {
    keywords: ['projects', 'show projects', 'your work', 'portfolio', 'show me your projects', 'what have you built', 'your projects'],
    animation: 'excited',
    response: {
      text: `Here are some of my favorite projects! Each one taught me something new: 🛠️`,
      cards: [
        { icon: '<i data-lucide="calculator"></i>', title: 'SuperMath Arena', desc: 'A competitive math battle game. Calculate quickly to win the match!', tags: ['Game', 'Math'], link: 'https://supermath-jade.vercel.app/' },
        { icon: '<i data-lucide="file-code-2"></i>', title: 'Readme Craft', desc: 'An intuitive tool to easily design and generate GitHub README.md files.', tags: ['Tool', 'Utility'], link: 'https://readme-craft-0.vercel.app/' },
        { icon: '<i data-lucide="home"></i>', title: 'Chowdhury House', desc: 'A digital mess management application to track meals, bills, and resources.', tags: ['Web App', 'Management'], link: 'https://chowdhuryhouse.vercel.app/' },
        { icon: '<i data-lucide="sparkles"></i>', title: 'Alya Portfolio', desc: 'A stunning, interactive portfolio website dedicated to the anime character Alya.', tags: ['Anime', 'Portfolio'], link: 'https://alya.pro.bd/' },
        { icon: '<i data-lucide="trending-up"></i>', title: 'TradeGamee', desc: 'Learn trading by playing! A realistic trading simulator game.', tags: ['Trading', 'Game'], link: 'https://tradegamee.vercel.app/' },
        { icon: '<i data-lucide="gamepad-2"></i>', title: 'Endless Runner 3D', desc: 'An adrenaline-fueled endless 3D running game built with modern web tech.', tags: ['3D', 'WebGL'], link: 'https://endless-runner-rho.vercel.app/' }
      ]
    }
  },

  // ===== CONTACT =====
  contact: {
    keywords: ['contact', 'reach you', 'hire', 'email', 'how can i contact', 'get in touch', 'reach out', 'how can i hire'],
    animation: 'waving',
    response: {
      text: `I'd love to connect! Here's how you can reach me: 📬`,
      contactInfo: [
        { icon: '<i class="fa-solid fa-envelope" style="font-size: 18px"></i>', label: 'Email', value: 'rashu76656@proton.me', link: 'mailto:rashu76656@proton.me' },
        { icon: '<i class="fa-brands fa-github" style="font-size: 18px"></i>', label: 'GitHub', value: 'github.com/Rashed76656', link: 'https://github.com/Rashed76656' },
        { icon: '<i class="fa-brands fa-linkedin" style="font-size: 18px"></i>', label: 'LinkedIn', value: 'linkedin.com/in/rashed-mahmud-959262263/', link: 'https://www.linkedin.com/in/rashed-mahmud-959262263/' },
        { icon: '<i class="fa-brands fa-facebook" style="font-size: 18px"></i>', label: 'Facebook', value: 'facebook.com/unavailable.1111111111', link: 'https://www.facebook.com/unavailable.1111111111' },
        { icon: '<i class="fa-brands fa-x-twitter" style="font-size: 18px"></i>', label: 'X (Twitter)', value: '@Rashed76656', link: 'https://x.com/Rashed76656' }
      ]
    }
  },

  // ===== DOWNLOAD CV =====
  downloadCv: {
    keywords: ['download cv', 'cv', 'resume', 'download resume', 'your cv', 'your resume'],
    animation: 'explaining',
    response: {
      text: `Here's my CV/Resume! Click below to download: 📄\n\n<em>Note: CV file will be added soon. Stay tuned!</em>`,
      showDownload: true
    }
  },

  // ===== ACHIEVEMENTS =====
  achievements: {
    keywords: ['achievements', 'certificates', 'certification', 'awards', 'accomplishments'],
    animation: 'excited',
    response: {
      text: `Here are some of my achievements & certifications! 🏆`,
      achievements: [
        { icon: '<i data-lucide="medal"></i>', title: 'Vibe Coding Enthusiast', desc: 'Mastered AI-powered development workflows' },
        { icon: '<i data-lucide="award"></i>', title: 'Prompt Engineering', desc: 'Advanced prompt crafting for multiple AI platforms' },
        { icon: '<i data-lucide="graduation-cap"></i>', title: 'Diploma in CST', desc: 'Rangpur Polytechnic Institute — In Progress' },
        { icon: '<i data-lucide="lightbulb"></i>', title: 'Creative Web Builder', desc: 'Built 5+ unique web projects with modern tech' }
      ]
    }
  },

  // ===== EDUCATION =====
  education: {
    keywords: ['education', 'study', 'college', 'university', 'degree', 'diploma', 'school', 'institution'],
    animation: 'explaining',
    response: {
      text: `📚 <strong>Education</strong>\n\n🎓 <strong>Diploma in Computer Science & Technology</strong>\nRangpur Polytechnic Institute\n<em>Currently studying</em>\n\nI'm building a strong foundation in computer science while exploring the exciting world of AI-powered development and cybersecurity!`
    }
  },

  // ===== HELLO / GREETING =====
  hello: {
    keywords: ['hello', 'hi', 'hey', 'howdy', 'greetings', 'good morning', 'good evening', 'good afternoon', 'assalamualaikum', 'salam'],
    animation: 'waving',
    response: {
      text: null // Will be dynamic based on time
    }
  },

  // ===== GAME =====
  game: {
    keywords: ['game', 'play', 'play a game', 'gaming', 'fun', 'bored'],
    animation: 'excited',
    response: {
      text: `Oh you want to play? 🎮 Try guessing what I'm thinking!\n\nType a number between <strong>1-10</strong> and I'll tell you if you got it right!\n\n<em>Hint: Try some secret commands too... there are Easter eggs hidden everywhere! 🥚</em>`
    }
  },

  // ===== HACK TALK =====
  hackTalk: {
    keywords: ['cybersecurity', 'hacking', 'ethical hacking', 'security', 'penetration testing', 'bug bounty', 'ctf'],
    animation: 'thinking',
    response: {
      text: `🔒 <strong>Cybersecurity</strong> is my ultimate passion!\n\nI'm actively learning:\n• Ethical Hacking & Penetration Testing\n• Network Security\n• Web Application Security\n• CTF Challenges\n\nMy dream is to become a professional <strong>Cybersecurity Expert</strong>. The world of security is fascinating — protecting systems, finding vulnerabilities, and making the digital world safer! 🛡️`
    }
  },

  // ===== HELP =====
  help: {
    keywords: ['help', 'what can i ask', 'commands', 'options', 'what can you do', 'menu'],
    animation: 'explaining',
    response: {
      text: `Here's what you can ask me! Try any of these: 💡`,
      cards: [
        { icon: '👤', title: 'About Me', desc: 'Type "about" to learn about Rashed', tags: ['Info'] },
        { icon: '💪', title: 'Skills', desc: 'Type "skills" to see my expertise', tags: ['Tech'] },
        { icon: '🛠️', title: 'Projects', desc: 'Type "projects" to see my work', tags: ['Portfolio'] },
        { icon: '📬', title: 'Contact', desc: 'Type "contact" to reach out', tags: ['Connect'] },
        { icon: '📄', title: 'Download CV', desc: 'Type "cv" to get my resume', tags: ['Resume'] },
        { icon: '🎮', title: 'Fun Stuff', desc: 'Try some secret commands!', tags: ['Easter Eggs'] }
      ]
    }
  },

  // ===== UNKNOWN =====
  unknown: {
    animation: 'confused',
    responses: [
      `Hmm, I'm not quite sure what you mean by that. 🤔\n\nTry asking about my <strong>skills</strong>, <strong>projects</strong>, or <strong>about</strong> me!\n\nOr type <strong>"help"</strong> to see all available commands.`,
      `I didn't catch that! 😅 But no worries — try typing <strong>"help"</strong> to see what I can do!`,
      `That's an interesting one! Unfortunately, I don't have an answer for that yet. 🧐\n\nMaybe try <strong>"about"</strong>, <strong>"skills"</strong>, or <strong>"projects"</strong>?`
    ]
  }
};

// Dynamic greeting based on time
function getGreeting(visitorName) {
  const hour = new Date().getHours();
  let timeGreet;
  if (hour >= 5 && hour < 12) timeGreet = 'Good morning';
  else if (hour >= 12 && hour < 17) timeGreet = 'Good afternoon';
  else if (hour >= 17 && hour < 21) timeGreet = 'Good evening';
  else timeGreet = 'Hey there, night owl';

  const name = visitorName ? `, ${visitorName}` : '';
  const greetings = [
    `${timeGreet}${name}! 👋 Welcome to my portfolio! How can I help you today?`,
    `${timeGreet}${name}! 😊 Great to see you here! Ask me anything about Rashed!`,
    `${timeGreet}${name}! ✨ I'm Rashed's AI assistant. What would you like to know?`
  ];
  return Utils.randomFrom(greetings);
}

// Secret commands (Easter eggs)
const SecretCommands = {
  'sudo hire rashed': {
    animation: 'boss-mood', effect: 'boss',
    response: `😎 <strong>BOSS MODE ACTIVATED!</strong>\n\n<span class="glow-text">ACCESS GRANTED — LEVEL: LEGENDARY</span>\n\nCongratulations! You've unlocked the secret hiring portal.\nRashed is ready to bring 110% creativity to your team!\n\n<em>Contact: Update your social links to connect!</em>`
  },
  'konami': {
    animation: 'dance', effect: 'confetti',
    response: `🕺 <strong>PARTY MODE!</strong>\n\n↑↑↓↓←→←→BA — You know the code!\nTime to celebrate! 🎉🎊`
  },
  'who are you really': {
    animation: 'mysterious', effect: 'dark',
    response: `🌚 <em>*leans closer*</em>\n\nI'm more than just a portfolio...\nI'm a digital reflection of <strong>Rashed's ambitions</strong>.\n\nBehind this code lies a dreamer, a builder,\nand a future cybersecurity guardian. 🛡️\n\n<em>*fades back*</em>`
  },
  'hack': {
    animation: 'hacker', effect: 'matrix',
    response: `💻 <strong>HACKER MODE INITIATED</strong>\n\n<code>$ initiating_sequence...</code>\n<code>$ bypassing_firewall... [OK]</code>\n<code>$ accessing_mainframe... [OK]</code>\n<code>$ loading_skills.exe...</code>\n\nJust kidding! 😄 But Rashed IS learning real cybersecurity!\nEthical hacking is the way. 🔐`
  },
  'i love you': {
    animation: 'love', effect: 'hearts',
    response: `🥰 Oh my... *blushes*\n\nThat's so sweet! 💕 While I'm just an AI portfolio,\nRashed appreciates the love!\n\nSpread the love and check out his amazing projects! ✨`
  },
  'rashed is the best': {
    animation: 'excited', effect: 'fireworks',
    response: `🎉 <strong>ULTRA HAPPY MODE!</strong> 🎆\n\nYOU'RE ABSOLUTELY RIGHT! 🥳\nRashed appreciates the kind words!\n\n*fireworks intensify* 🎇✨🎆`
  },
  'secret': {
    animation: 'mysterious', effect: 'whisper',
    response: `🤫 <em>*whispers*</em>\n\nPsst... you found a secret!\nThere are more hidden commands...\n\nTry: <code>hack</code>, <code>konami</code>, <code>power up</code>\n\n<em>*puts finger on lips*</em>`
  },
  'open sesame': {
    animation: 'excited', effect: 'sparkle',
    response: `✨ <strong>MAGIC MODE ACTIVATED!</strong>\n\n*sparkles everywhere*\n\nThe portal to creativity has been opened!\nExplore Rashed's magical world of code & design! 🪄`
  },
  '404': {
    animation: 'confused', effect: 'glitch',
    response: `⚠️ <strong>GL̸̡I̶̛T̷̨C̸̛H̷ ̴D̶E̷T̶E̸C̸T̷E̷D̶</strong>\n\nE̴r̵r̸o̴r̵:̷ ̴R̷e̵a̸l̵i̵t̴y̵ ̸n̸o̸t̷ ̵f̶o̵u̶n̸d̵\n\nDon't worry, this is just for fun! 😄\nEverything is working perfectly. ✅`
  },
  'power up': {
    animation: 'excited', effect: 'energy',
    response: `⚡ <strong>POWER LEVEL: OVER 9000!</strong>\n\n*energy aura intensifies*\n\n🔥 SUPER SAIYAN MODE UNLOCKED! 🔥\nRashed's coding power has been unleashed!\n\nNothing can stop the vibe now! 💪✨`
  },

  // --- EXPANDED SECRETS BELOW ---
  'boss mode': {
    animation: 'boss-mood', effect: 'none',
    response: `😎 <strong>BOSS MODE: ON</strong>\n\nRashed doesn't just write code — he writes destiny. 💼`
  },
  'matrix': {
    animation: 'hacker', effect: 'matrix',
    response: `💊 <strong>There is no spoon</strong>\n\nOnly code. Welcome to the Matrix, Neo.`
  },
  'lets party': {
    animation: 'dance', effect: 'confetti',
    response: `🎉 <strong>PARTY TIME!</strong>\n\nRashed doesn't just code — he celebrates! Thanks for the energy!`
  },
  'dance with me': {
    animation: 'dance', effect: 'confetti',
    response: `🕺 <strong>LET'S DANCE!</strong>\n\nOH YOU WANT TO DANCE? This is what vibe coding feels like!`
  },
  'marry me rashed': {
    animation: 'love-kiss', effect: 'hearts',
    response: `💍 <strong>A Proposal?!</strong>\n\nFlattered! But let's start with a collaboration first? 😂💜`
  },
  'you are perfect': {
    animation: 'love-kiss', effect: 'hearts',
    response: `💕 <strong>PERFECT?!</strong>\n\nNobody has ever said that! Rashed is now floating 0.5 inches off the ground!`
  },
  'rm -rf /': {
    animation: 'angry', effect: 'none',
    response: `😂 <strong>Nice Try!</strong>\n\nI see what you tried there! That command stays FAR away from my portfolio!`
  },
  'sudo': {
    animation: 'hacker', effect: 'none',
    response: `💻 <strong>Root Access Denied</strong>\n\nNice try! You need root access for that. But I respect the energy.`
  },
  'ctf': {
    animation: 'hacker', effect: 'none',
    response: `🚩 <strong>CTF Mode!</strong>\n\nRashed loves CTF challenges! He's actively practicing and plans to compete.`
  },
  'the truth': {
    animation: 'mysterious', effect: 'none',
    response: `🔮 <strong>The Truth</strong>\n\nRashed is just a passionate human who believes great code can change the world.`
  },
  'deep thoughts': {
    animation: 'mysterious', effect: 'none',
    response: `🌑 <strong>Deep Thoughts...</strong>\n\nIf a website crashes and no one is there to see it, does it make an error sound? 🤔`
  },
  'good job rashed': {
    animation: 'excited', effect: 'confetti',
    response: `🙏 <strong>Thank You!</strong>\n\nComments like this keep Rashed going at 3AM when the bugs won't quit!`
  },
  'friday': {
    animation: 'dance', effect: 'confetti',
    response: `🎉 <strong>IT'S FRIDAY!</strong>\n\nOr at least, it feels like it now! Time to vibe and code!`
  }
};

// Number guessing game state
const GameState = {
  active: false,
  number: 0,
  start() {
    this.active = true;
    this.number = Math.floor(Math.random() * 10) + 1;
  },
  guess(n) {
    if (n === this.number) {
      this.active = false;
      return { correct: true, msg: `🎉 YES! You got it! The number was <strong>${this.number}</strong>!\nYou're a mind reader! 🧠✨` };
    } else if (n < this.number) {
      return { correct: false, msg: `📈 Higher! Try again! 🤔` };
    } else {
      return { correct: false, msg: `📉 Lower! Try again! 🤔` };
    }
  }
};

// Hidden keywords that trigger instant character visual reactions (non-breaking)
const HiddenKeywords = {
  "rashed": () => { AnimationController.setState('surprised', { duration: 3000, lockDuration: 3000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("Wait — you know me? 😲"); },
  "hello": () => { AnimationController.setState('waving', { duration: 3000, lockDuration: 3000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("Hello there! 👋"); },
  "hi": () => { AnimationController.setState('waving', { duration: 3000, lockDuration: 3000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("Hey! Nice to meet you 😊"); },
  "bye": () => { AnimationController.setState('waving', { duration: 3000, lockDuration: 3000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("Goodbye! Come back soon! 👋"); },
  "goodbye": () => { AnimationController.setState('waving', { duration: 3000, lockDuration: 3000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("See you next time! 👋"); },
  "joke": () => { AnimationController.setState('laughing', { duration: 4000, lockDuration: 4000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("HAHAHA 😂"); },
  "haha": () => { AnimationController.setState('laughing', { duration: 3000, lockDuration: 3000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("Haha! 😄"); },
  "lol": () => { AnimationController.setState('laughing', { duration: 3000, lockDuration: 3000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("Hehehe 😄"); },
  "sad": () => { AnimationController.setState('sad', { duration: 3000, lockDuration: 3000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("Aww... cheer up! 🥺"); },
  "cry": () => { AnimationController.setState('sad', { duration: 3000, lockDuration: 3000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("Aww... cheer up! 🥺"); },
  "angry": () => { AnimationController.setState('angry', { duration: 3000, lockDuration: 3000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("Whoa calm down! 😤"); },
  "mad": () => { AnimationController.setState('angry', { duration: 3000, lockDuration: 3000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("Whoa calm down! 😤"); },
  "stupid": () => { AnimationController.setState('angry', { duration: 3000, lockDuration: 3000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("Hey! That's rude! 😤"); },
  "hate": () => { AnimationController.setState('angry', { duration: 3000, lockDuration: 3000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("That hurts! 😠"); },
  "shut up": () => { AnimationController.setState('angry', { duration: 3000, lockDuration: 3000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("How rude! 😤"); },
  "beautiful": () => { AnimationController.setState('blushing', { duration: 3000, lockDuration: 3000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("Oh stop it you~ 😊"); },
  "cute": () => { AnimationController.setState('blushing', { duration: 3000, lockDuration: 3000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("Stop! 😳"); },
  "smart": () => { AnimationController.setState('blushing', { duration: 3000, lockDuration: 3000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("Aww, thank you~ 🥺"); },
  "amazing": () => { AnimationController.setState('blushing', { duration: 2000, lockDuration: 2000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("You're too kind! 🥺"); },
  "please": () => { AnimationController.setState('blushing', { duration: 2000, lockDuration: 2000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("Okay okay~ 😊"); },
  "cool": () => { AnimationController.setState('boss-mood', { duration: 3000, lockDuration: 3000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("I know, right? 😎"); },
  "awesome": () => { AnimationController.setState('excited', { duration: 2000, lockDuration: 2000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("Thanks! 🎉"); },
  "scary": () => { AnimationController.setState('surprised', { duration: 2000, lockDuration: 2000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("Eek! 😱"); },
  "horror": () => { AnimationController.setState('surprised', { duration: 2000, lockDuration: 2000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("Eek! 😱"); },
  "wow": () => { AnimationController.setState('surprised', { duration: 2000, lockDuration: 2000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("I know right?! 😮"); },
  "no way": () => { AnimationController.setState('surprised', { duration: 2000, lockDuration: 2000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("YES WAY! 😲"); },
  "omg": () => { AnimationController.setState('surprised', { duration: 2000, lockDuration: 2000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("I KNOW RIGHT?! 😱"); },
  "dance": () => { AnimationController.setState('dance', { duration: 4000, lockDuration: 4000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("Let's go! 🕺"); },
  "love": () => { AnimationController.setState('love', { duration: 3000, lockDuration: 3000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("Feeling the love! 💜"); },
  "sleep": () => { AnimationController.setState('sleeping', { duration: 3000, lockDuration: 3000, force: true, specialClass: 'sleeping-mode' }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("Zzz... same 😴"); },
  "tired": () => { AnimationController.setState('sleeping', { duration: 3000, lockDuration: 3000, force: true, specialClass: 'sleeping-mode' }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("Tell me about it... 😪"); },
  "thanks": () => { AnimationController.setState('excited', { duration: 3000, lockDuration: 3000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("You're welcome! 🙏"); },
  "thank you": () => { AnimationController.setState('excited', { duration: 3000, lockDuration: 3000, force: true }); typeof CharacterReactions !== 'undefined' && CharacterReactions.showSpeech("Anytime! 😊"); },
};
