// lib/notification-service.ts
import { ref, push, onValue, set } from "firebase/database";
import { database } from "./firebase-config";

export interface Notification {
  id: string;
  zoneId: string;
  type: "simulation" | "alert" | "info" | "warning" | "success";
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  icon?: string;
}

// Send notification to Firebase
export const sendNotification = async (
  zoneId: string,
  type: Notification["type"],
  title: string,
  message: string,
  icon?: string
): Promise<void> => {
  const notificationsRef = ref(database, `notifications/${zoneId}`);

  const notification: Omit<Notification, "id"> = {
    zoneId,
    type,
    title,
    message,
    timestamp: Date.now(),
    read: false,
    icon,
  };

  await push(notificationsRef, notification);
};

// Subscribe to notifications for a zone
export const subscribeToNotifications = (
  zoneId: string,
  callback: (notifications: Notification[]) => void
): (() => void) => {
  const notificationsRef = ref(database, `notifications/${zoneId}`);

  return onValue(notificationsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const notifications: Notification[] = Object.entries(data).map(
        ([id, notif]: [string, any]) => ({
          id,
          ...notif,
        })
      );

      // Sort by timestamp (newest first)
      notifications.sort((a, b) => b.timestamp - a.timestamp);

      callback(notifications);
    } else {
      callback([]);
    }
  });
};

// Mark notification as read
export const markNotificationAsRead = async (
  zoneId: string,
  notificationId: string
): Promise<void> => {
  const notificationRef = ref(
    database,
    `notifications/${zoneId}/${notificationId}`
  );

  await set(notificationRef, { read: true });
};

// Clear all notifications for a zone
export const clearNotifications = async (zoneId: string): Promise<void> => {
  const notificationsRef = ref(database, `notifications/${zoneId}`);
  await set(notificationsRef, null);
};

// Simulation-specific notifications
export const sendSimulationStartNotification = async (
  zoneId: string,
  scenarioName: string,
  icon: string
): Promise<void> => {
  await sendNotification(
    zoneId,
    "simulation",
    "Simulation Started",
    `${scenarioName} simulation is now running for 10 seconds`,
    icon
  );
};

export const sendSimulationCompleteNotification = async (
  zoneId: string,
  scenarioName: string
): Promise<void> => {
  await sendNotification(
    zoneId,
    "success",
    "Simulation Complete",
    `${scenarioName} simulation completed successfully. System returning to normal operation.`,
    "✅"
  );
};

export const sendActuatorActivationNotification = async (
  zoneId: string,
  actuatorName: string,
  action: "activated" | "deactivated"
): Promise<void> => {
  const icons: Record<string, string> = {
    fan: "💨",
    pump: "💧",
    heater: "🔥",
    misting: "💦",
    lighting: "💡",
    co2dosing: "🌱",
  };

  await sendNotification(
    zoneId,
    "info",
    `${actuatorName.charAt(0).toUpperCase() + actuatorName.slice(1)} ${action}`,
    `The ${actuatorName} system has been ${action}`,
    icons[actuatorName] || "⚡"
  );
};

export const sendAlertNotification = async (
  zoneId: string,
  alertTitle: string,
  alertMessage: string
): Promise<void> => {
  await sendNotification(zoneId, "alert", alertTitle, alertMessage, "⚠️");
};
