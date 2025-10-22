# CBAP Exam Prep Platform
###Live Platform available at  - - https://cbap.tonyofoh.com

- A comprehensive, free-to-use platform designed to help business analysts prepare for the CBAP (Certified Business Analysis Professional) certification exam. Built with modern web technologies and featuring an intuitive user interface.

![CBAP Exam Prep Platform](https://img.shields.io/badge/CBAP-Exam%20Prep-blue)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-blue)
![Vite](https://img.shields.io/badge/Vite-5.0.8-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.0-blue)

## 🚀 Features

### 📚 **Comprehensive Question Bank**
- **400+ Practice Questions** covering all CBAP knowledge areas
- **Normal Questions**: Standard multiple-choice questions for foundational learning
- **Scenario Questions**: Real-world business analysis scenarios for practical application
- **Detailed Explanations**: BABOK references and comprehensive answer explanations
- **Why Others Are Wrong**: Detailed explanations for incorrect answer choices

### 🎯 **Study Modes**
- **Study Mode**: Learn at your own pace with immediate feedback and explanations
- **Exam Mode**: Simulate real exam conditions with timed practice sessions
- **List View**: Browse all questions in an organized list format
- **One-by-One View**: Focus on individual questions for deep learning

### 🎨 **Modern User Experience**
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between themes for comfortable studying
- **Intuitive Navigation**: Easy-to-use interface with clear progress indicators
- **Accessibility**: Built with accessibility best practices in mind

### 📊 **Progress Tracking**
- **Question Navigation**: Easy movement between questions
- **Answer Tracking**: Keep track of your progress and performance
- **Reveal Answers**: Option to reveal answers with detailed explanations
- **Performance Analytics**: Track your improvement over time

## 🛠️ Technology Stack

- **Frontend**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.0.8
- **Styling**: Tailwind CSS 3.4.0
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Cookie, Inter)

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cbap-exam-prep-platform.git
   cd cbap-exam-prep-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Production Build

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
cbap-exam-practice-platform/
├── public/
│   ├── data/
│   │   ├── normal-questions.json      # 400+ normal practice questions
│   │   ├── scenario-questions.json   # Scenario-based questions
│   │   └── additional-questions.json  # Additional question sets
│   ├── favicon.png                   # Website favicon
│   └── qr-code.png                   # Buy me a coffee QR code
├── src/
│   ├── components/
│   │   ├── ui/                       # Reusable UI components
│   │   ├── exam-mode.tsx            # Exam simulation component
│   │   ├── study-mode.tsx           # Study mode component
│   │   ├── question-selector.tsx    # Landing page component
│   │   ├── footer.tsx               # Footer with QR code
│   │   ├── theme-provider.tsx       # Theme management
│   │   └── theme-toggle.tsx         # Theme switcher
│   ├── App.tsx                      # Main application component
│   ├── main.tsx                     # Application entry point
│   └── index.css                    # Global styles
├── index.html                       # HTML template with SEO metadata
├── package.json                     # Dependencies and scripts
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
└── vite.config.ts                   # Vite configuration
```

## 🎯 Usage Guide

### Getting Started
1. **Choose Question Type**: Select between Normal Questions or Scenario Questions
2. **Select Study Mode**: Choose Study Mode for learning or Exam Mode for testing
3. **Start Practicing**: Navigate through questions and track your progress

### Study Mode Features
- **Immediate Feedback**: Get instant feedback on your answers
- **Detailed Explanations**: Read comprehensive explanations for each answer
- **BABOK References**: Access specific BABOK v3 references
- **Why Others Are Wrong**: Understand why incorrect options are wrong

### Exam Mode Features
- **Timed Sessions**: Practice under time pressure
- **Real Exam Simulation**: Experience exam-like conditions
- **Progress Tracking**: Monitor your performance
- **Results Review**: Review answers after completion

## 📊 Question Categories

The platform covers all CBAP knowledge areas:

- **Business Analysis Planning & Monitoring**
- **Elicitation & Collaboration**
- **Requirements Life Cycle Management**
- **Strategy Analysis**
- **Requirements Analysis & Design Definition**
- **Solution Evaluation**

## 🎨 Customization

### Adding New Questions
1. Edit the JSON files in `public/data/`
2. Follow the existing question structure:
   ```json
   {
     "question_number": 1,
     "question": "Your question text here",
     "options": {
       "A": "Option A",
       "B": "Option B",
       "C": "Option C",
       "D": "Option D"
     },
     "correct_answer": "B",
     "babok_explanation": "Detailed explanation",
     "babok_reference": "BABOK v3 reference",
     "why_others_are_wrong": {
       "A": "Why A is wrong",
       "C": "Why C is wrong",
       "D": "Why D is wrong"
     }
   }
   ```

### Styling Customization
- Modify `tailwind.config.js` for theme customization
- Update `src/index.css` for global styles
- Customize component styles in individual component files

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Deploy automatically on every push

### Other Platforms
- **Netlify**: Connect repository and configure build settings
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **AWS S3**: Upload `dist` folder to S3 bucket

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Contribution Guidelines
- Follow the existing code style
- Add TypeScript types for new features
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ☕ Support

If you find this platform helpful for your CBAP preparation:

- ⭐ **Star the repository** to show your support
- 🐛 **Report bugs** by opening an issue
- 💡 **Suggest features** through GitHub discussions
- ☕ **Buy me a coffee** using the QR code in the footer

## 📞 Contact

- **Developer**: Tony Ofoh
- **Email**: tonyofoh@gmail.com
- **LinkedIn**: https://linkedin.com/in/tony-ofoh
- **Buy Me a Coffee**: [https://www.buymeacoffee.com/tonyofoh](https://www.buymeacoffee.com/tonyofoh)

## 🙏 Acknowledgments

- **IIBA** for the BABOK framework
- **CBAP Community** for feedback and suggestions
- **Open Source Contributors** who made this project possible
- **All CBAP Aspirants** who use this platform for their preparation

---

**Good luck with your CBAP certification journey! 🎓**

*Remember: Practice makes perfect. Use this platform regularly to build confidence and master the CBAP exam content.*
