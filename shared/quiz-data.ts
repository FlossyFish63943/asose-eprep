import type { Quiz } from './types';
export const quizData: Quiz[] = [
  {
    id: "cs-fundamentals",
    title: "CS Fundamentals",
    questions: [
      {
        text: "What does 'CPU' stand for?",
        options: ["Central Processing Unit", "Computer Personal Unit", "Central Process Unit", "Control Panel Unit"],
        correctAnswerIndex: 0
      },
      {
        text: "Which of these is a programming language?",
        options: ["HTML", "JPEG", "Python", "FTP"],
        correctAnswerIndex: 2
      },
      {
        text: "What is the binary equivalent of the decimal number 10?",
        options: ["1010", "1100", "0011", "1001"],
        correctAnswerIndex: 0
      }
    ]
  },
  {
    id: "web-development",
    title: "Web Development Basics",
    questions: [
      {
        text: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink and Text Markup Language", "Home Tool Markup Language"],
        correctAnswerIndex: 0
      },
      {
        text: "Which property is used to change the background color in CSS?",
        options: ["color", "bgcolor", "background-color", "background"],
        correctAnswerIndex: 2
      },
      {
        text: "What is the purpose of JavaScript in web development?",
        options: ["To style web pages", "To structure web pages", "To add interactivity to web pages", "To manage databases"],
        correctAnswerIndex: 2
      }
    ]
  }
];