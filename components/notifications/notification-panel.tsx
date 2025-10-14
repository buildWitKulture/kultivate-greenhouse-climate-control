// components/notifications/notification-panel.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, X, CheckCheck } from "lucide-react";
import {
  subscribeToNotifications,
  clearNotifications,
  type Notification,
} from "@/lib/notification-service";

interface NotificationPanelProps {
  zoneId: string;
}

export default function NotificationPanel({ zoneId }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!zoneId) return;

    const unsubscribe = subscribeToNotifications(zoneId, (notifs) => {
      setNotifications(notifs);
      setUnreadCount(notifs.filter((n) => !n.read).length);
    });

    return () => unsubscribe();
  }, [zoneId]);

  const handleClearAll = async () => {
    await clearNotifications(zoneId);
    setNotifications([]);
    setUnreadCount(0);
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "simulation":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "alert":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "warning":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "success":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-muted text-foreground border-border";
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <Button
        variant="outline"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <Card className="absolute right-0 top-12 w-96 max-w-[calc(100vw-2rem)] shadow-xl z-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="secondary">{unreadCount} new</Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleClearAll}>
                    <CheckCheck className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No notifications yet
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-muted/50 transition-colors ${
                        !notification.read ? "bg-muted/30" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {notification.icon && (
                          <span className="text-2xl">{notification.icon}</span>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-sm">
                              {notification.title}
                            </h4>
                            <Badge
                              variant="outline"
                              className={getNotificationColor(
                                notification.type
                              )}
                            >
                              {notification.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            {!notification.read && (
                              <Badge variant="secondary" className="text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
