 * Master Header Component - Rebuilt for Optimal Spacing & Responsiveness
 * Professional navigation with CSOAI branding and comprehensive dropdown menus
 * Fixed: Logo sizing, navigation spacing, responsive design
 */

import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, Settings, BookOpen, BarChart3, ChevronDown, Moon, Sun } from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Headphones } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [focusedItemIndex, setFocusedItemIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard',
      submenu: [
        { name: 'Overview', href: '/dashboard', description: 'Your dashboard' },
        { name: 'How It Works', href: '/how-it-works/dashboard', description: 'Dashboard guide' },
        { name: 'Executive', href: '/dashboard/executive', description: 'Real-time metrics' },
        { name: 'Roadmap', href: '/dashboard/roadmap', description: 'Remediation timeline' },
        { name: 'Alerts', href: '/dashboard/alerts', description: 'Alert management' },
        { name: 'Instructor Dashboard', href: '/instructor/dashboard', description: 'Manage cohorts and students' },
        { name: 'A/B Testing', href: '/ab-testing', description: 'Experiment management' },
      ]
    },
    { 
      name: 'Training', 
      href: '/courses',
      submenu: [
        { name: 'How It Works', href: '/how-it-works/training', description: 'Training pipeline' },
        { name: 'All Courses (FREE)', href: '/courses', description: 'All 7 modules - 100% free' },
        { name: 'My Courses', href: '/my-courses', description: 'Your enrolled courses' },
      ]
    },
    { 
      name: 'Certification', 
      href: '/certification',
      submenu: [
        { name: 'How It Works', href: '/how-it-works/certification', description: 'Certification pathway' },
        { name: 'Certification Exam', href: '/exam', description: 'Take the exam' },
        { name: 'My Certificates', href: '/certificates', description: 'Your certificates' },
        { name: 'Review Past Exams', href: '/certification/review', description: 'Review attempts' },
      ]
    },
    { 
      name: 'SOAI-PDCA', 
      href: '/soai-pdca',
      submenu: [
        { name: 'Framework', href: '/soai-pdca', description: 'Learn about SOAI-PDCA' },
        { name: 'Government Integration', href: '/soai-pdca/government', description: 'Government compliance' },
        { name: 'Simulator', href: '/pdca-simulator', description: 'Interactive demo' },
      ]
    },
    { 
      name: 'Watchdog', 
      href: '/watchdog',
      submenu: [
        { name: 'Help Protect Humanity', href: '/watchdog/help-protect-humanity', description: 'Join the movement' },
        { name: 'How It Works', href: '/how-it-works/watchdog', description: 'Watchdog program' },
        { name: 'Report Incident', href: '/watchdog/incident', description: 'Report AI safety incident' },
        { name: 'Training Courses', href: '/courses', description: 'AI safety analyst training' },
        { name: 'Analyst Jobs', href: '/jobs', description: 'Available positions' },
        { name: 'Leaderboard', href: '/watchdog-leaderboard', description: 'Top analysts' },
      ]
    },
    { 
      name: 'Compliance', 
      href: '/compliance',
      submenu: [
        { name: 'How It Works', href: '/how-it-works/compliance', description: 'Compliance methodology' },
        { name: 'Global AI Safety Initiative', href: '/global-ai-safety-initiative', description: '124 countries committed' },
        { name: 'EU AI Act', href: '/compliance/eu-ai-act', description: 'EU regulation' },
        { name: 'NIST AI RMF', href: '/compliance/nist-ai-rmf', description: 'US framework' },
        { name: 'TC260', href: '/compliance/tc260', description: 'China standards' },
        { name: 'UK AI Bill', href: '/compliance/uk-ai-bill', description: 'UK regulation' },
        { name: 'Canada AI Act', href: '/compliance/canada-ai-act', description: 'Canada regulation' },
        { name: 'Australia AI Governance', href: '/compliance/australia-ai-governance', description: 'Australia framework' },
        { name: 'Run Assessment', href: '/compliance', description: 'Run assessment' },