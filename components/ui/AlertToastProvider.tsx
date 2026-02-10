      });
    }
  };

  // Subscribe to alerts via WebSocket
  // Only show connection errors for authenticated users
  const { isConnected } = useAlertSubscription({
    onAlert: handleAlert,
    onError: (error) => {
      console.error('[Alert Toast] WebSocket error:', error);
      // Don't show toast for connection errors - it's too intrusive
      // The WebSocket will auto-reconnect anyway
    },
  });

  const value: AlertToastContextType = {
    showAlert: handleAlert,
    enableSoundNotifications: enableSound,
    setEnableSoundNotifications: setEnableSound,
    enableDesktopNotifications: enableDesktop,