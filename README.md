# 🧠 PaperSage – AI-Powered Research Paper Auto-Reviewer

**PaperSage** is an AI-driven tool that automatically reviews academic research papers before submission. It analyzes structure, originality, citation quality, and detects plagiarism — helping students and researchers submit better papers with confidence.

> 🔍 Powered by **Google Gemini API**, **React + TypeScript frontend**, and a **Python FastAPI backend**.

---

## ✅ Features

| Feature                        | Description                                                                                                                 |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| 📝 **AI Review Generator**     | Section-wise feedback (abstract, intro, methods, etc.) on clarity, coherence, and originality.                             |
| 📊 **Originality Score**       | Summarizes novelty by comparing claims to known literature.                                                                |
| 🔍 **Plagiarism Detection**    | Uses Gemini + semantic similarity to identify potentially copied or paraphrased content.                                   |
| 📚 **Citation Checker**        | Flags missing, broken, or malformed citations with suggestions.                                                             |
| 🗃 **Section Breakdown**       | Grades each section (Introduction, Methods, Results, Conclusion).                                                          |
| 🧠 **Reviewer Personas**       | Optional reviewer styles: *strict, expert, friendly*.                                                                      |
| 📄 **PDF & LaTeX Upload**      | Accepts text inputs                                                                                                        |
| 🌐 **Web Interface**           | Simple and responsive React + TypeScript UI.                                                                               |

---

## 🎯 Use Case

Designed for:
- 🧑‍🎓 Students writing theses or term papers  
- 🧑‍🔬 Researchers preparing journal or conference submissions  
- 🏫 Universities and academic writing centers  

---

## 🧱 Tech Stack

| Layer        | Technology                                                             |
| ------------ | ---------------------------------------------------------------------- |
| Frontend     | React.js + TypeScript + Bootstrap                                      |
| AI Engine    | Google Gemini Pro API                                                  |
| PDF Parsing  | PyMuPDF (`fitz`) / `pdfminer.six`                                      |
| Citation Parsing | Grobid / ScienceParse                                             |
| Plagiarism   | Gemini + Semantic Similarity + Web Search                              |
| File Storage | Local file system / Firebase                                           |
| Deployment   | Render / Railway / Google Cloud Run                                    |

---

## ⚙️ How It Works

```mermaid
graph TD
    A[User Uploads PDF/LaTeX] --> B[Backend extracts text and segments by section]
    B --> C[Gemini analyzes each section]
    B --> D[Citation module parses references]
    C --> E[Plagiarism module checks for similarity]
    D --> E
    E --> F[Generate downloadable AI Review Report]

