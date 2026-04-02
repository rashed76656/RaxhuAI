/* ============================================
   RaxhuAI — Command Intent Scorer
   ============================================ */

const CommandScorer = {
  threshold: 52,

  normalize(text) {
    return (text || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  },

  tokenize(text) {
    const clean = this.normalize(text);
    return clean ? clean.split(' ') : [];
  },

  levenshtein(a, b) {
    const s = this.normalize(a);
    const t = this.normalize(b);
    if (!s) return t.length;
    if (!t) return s.length;

    const dp = Array.from({ length: s.length + 1 }, () => new Array(t.length + 1).fill(0));
    for (let i = 0; i <= s.length; i++) dp[i][0] = i;
    for (let j = 0; j <= t.length; j++) dp[0][j] = j;

    for (let i = 1; i <= s.length; i++) {
      for (let j = 1; j <= t.length; j++) {
        const cost = s[i - 1] === t[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }

    return dp[s.length][t.length];
  },

  scoreKeyword(inputRaw, keywordRaw) {
    const input = this.normalize(inputRaw);
    const keyword = this.normalize(keywordRaw);
    if (!input || !keyword) return 0;

    if (input === keyword) return 100;
    if (input.startsWith(keyword)) return 92;
    if (input.includes(keyword)) return Math.max(74, 88 - Math.max(0, keyword.length - 5));

    const inTokens = this.tokenize(input);
    const kwTokens = this.tokenize(keyword);

    let overlap = 0;
    kwTokens.forEach(tok => {
      if (inTokens.includes(tok)) overlap++;
    });

    const overlapRatio = kwTokens.length ? overlap / kwTokens.length : 0;
    let score = overlapRatio * 68;

    // Prefix-based partial matches for common typos/short forms.
    for (const kt of kwTokens) {
      for (const it of inTokens) {
        if (it.startsWith(kt) || kt.startsWith(it)) {
          score += 4;
          break;
        }
      }
    }

    // Light typo tolerance for short input phrases.
    const distance = this.levenshtein(input, keyword);
    const maxLen = Math.max(input.length, keyword.length);
    if (maxLen > 0) {
      const similarity = 1 - distance / maxLen;
      if (similarity >= 0.68) {
        score = Math.max(score, 45 + similarity * 38);
      }
    }

    return Math.min(99, score);
  },

  rankCommands(input, commands) {
    const ranked = [];
    let idx = 0;

    for (const [key, cmd] of Object.entries(commands || {})) {
      if (key === 'unknown' || !cmd || !Array.isArray(cmd.keywords)) {
        idx++;
        continue;
      }

      let best = 0;
      let matchedKeyword = null;
      for (const kw of cmd.keywords) {
        const score = this.scoreKeyword(input, kw);
        if (score > best) {
          best = score;
          matchedKeyword = kw;
        }
      }

      ranked.push({
        key,
        cmd,
        score: best,
        matchedKeyword,
        index: idx
      });

      idx++;
    }

    ranked.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.index - b.index;
    });

    return ranked;
  },

  shouldDebug() {
    return localStorage.getItem('raxhu_intent_debug') === 'true';
  }
};
