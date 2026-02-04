# 🧪 Word Lab ( Built Using AI)

**Word Lab** is a high-performance, production-ready React application designed for writers, editors, and students. It provides real-time linguistic insights, readability scores, and text transformation tools in a sleek, focus-oriented interface.

## 🖥️ Application Interface

Bright Mode :
---

![Word Lab Desktop Dashboard](./Preview/Word%20Lab%20-%20Bright.jpg)

Dark Mode:
---
![Word Lab Desktop Dashboard](./Preview/Word%20Lab%20-%20Dark.jpg)

---

## ✨ Features

* **Basic Metrics:** Real-time count of words, characters (with/without spaces), sentences, and paragraphs.
* **Readability Scoring:** Automated **Flesch-Kincaid Grade Level** calculation. Hover over the score to see the underlying mathematical formula.
* **Time Estimates:** Accurate Reading vs. Speaking time based on industry-standard WPM (Words Per Minute).
* **Lexical Density:** Measures the richness of your vocabulary by analyzing unique word usage.
* **Text Transformers:** One-click conversion for UPPERCASE, lowercase, and Title Case.
* **The "Clean" Engine:** Instantly removes double spaces, trailing whitespace, and messy line breaks.
* **Auto-Save:** Integrated with `localStorage` to ensure your work is never lost on page refreshes.

---

## 🚀 Technical Stack

- **Frontend:** React 18 (Vite)
- **Styling:** Tailwind CSS (Desktop-optimized, Responsive)
- **Icons:** Lucide React
- **Logic:** Custom `useTextAnalyzer` hook for high-performance string processing.
- **Math:** Syllable-counting algorithm for grade-level accuracy.

---

## 📐 The Math Behind the Grade
Word Lab uses the **Flesch-Kincaid Grade Level** formula to determine text complexity:

$$0.39 \times \left(\frac{\text{total words}}{\text{total sentences}}\right) + 11.8 \times \left(\frac{\text{total syllables}}{\text{total words}}\right) - 15.59$$

This provides a grade-level equivalent (e.g., 8.2 means an 8th-grade reading level).

---

## 📜 Original Project Prompt
The full prompt used to build this application are documented in:
`./prompt.txt`

---

## 📝 License
Distributed under the `MIT License`.
