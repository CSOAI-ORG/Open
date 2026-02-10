
// Note: Watchdog, Training, Certification, and Regulatory are now integrated into the Members Dashboard
// Access them via /dashboard with tab navigation

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Close mobile menu when navigating
  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop: collapsible, Mobile: slide-in drawer */}
      <motion.aside
        initial={false}
        animate={{ 
          width: sidebarCollapsed ? 0 : 260,
          x: 0
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={cn(
          "hidden lg:flex flex-col border-r border-sidebar-border bg-sidebar overflow-hidden",
          sidebarCollapsed && "border-r-0"
        )}
      >
        {/* Desktop sidebar content */}
        {/* CSOAI Logo + New Chat Button */}
        <div className="flex items-center justify-between p-2 pt-3">
          <Link href="/">
            <Button
              variant="ghost"
              className="flex items-center gap-2 w-full justify-start px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              <img
                src="/csoai-icon.svg.png"
                alt="CSOAI"
                className="w-8 h-8 rounded-lg"
              />
              <span className="font-semibold">New Chat</span>
            </Button>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Open in new tab</TooltipContent>
          </Tooltip>
        </div>

        {/* Navigation Items - Organized by Sections */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-4" data-testid="main-navigation">
          {navSections.map((section: any) => (
            <div key={section.title}>
              <div className="px-3 mb-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </h3>
              </div>
              <div className="space-y-0.5">
                {section.items.map((item: any) => {
                  const isActive = location === item.path;
                  const Icon = item.icon;

                  return (
                    <Link key={item.path} href={item.path}>
                      <motion.div
                        whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                        data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                          isActive
                            ? "bg-accent text-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </motion.div>
                    </Link>
                  );