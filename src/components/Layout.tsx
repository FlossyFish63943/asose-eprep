import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Github, Linkedin } from 'lucide-react';
export function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-b z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <h1 className="text-2xl font-bold tracking-wide text-primary">ASOSE ePrep</h1>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button asChild variant="ghost">
              <Link to="/contact-me">Contact Me</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-center text-xs text-muted-foreground">
          <p>Made With ❤️ By Aaron Abraham, a student of ASOSE, Sector 5, Dwarka</p>
          <div className="flex justify-center items-center gap-4 mt-1">
            <a href="mailto:aaronabrm@gmail.com" className="hover:text-primary transition-colors">aaronabrm@gmail.com</a>
            <span>|</span>
            <a href="tel:+918800601548" className="hover:text-primary transition-colors">+91 8800601548</a>
            <span>|</span>
            <Link to="/api-docs" className="hover:text-primary transition-colors">API Docs</Link>
            <span>|</span>
            <div className="flex items-center gap-3">
              <a href="https://github.com/FlossyFish63943" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="https://www.linkedin.com/in/aaronabraham201191" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}