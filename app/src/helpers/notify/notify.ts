import { PRE_VALUES } from "@/styles";
import { NotificationType, NotifyType } from "./type";

export default class Notify {
  private static readonly margin = 15;
  private static readonly transition = 0.8;
  private notifications: NotificationType[] = [];

  add(text: string, type: NotifyType): void {
    if (this.notifications.length === 15)
      return console.error("Excedeed limit of notifications");

    const $notificationContainer: HTMLDivElement =
      document.createElement("div");

    $notificationContainer.style.cssText = `
      ${PRE_VALUES.FLEX}
      justify-content: space-between;
      position: absolute;
      padding: .5rem;
      bottom: 15px;
      right: 15px;
      min-width: 300px;
      height: 40px; 
      transition: all ${Notify.transition}s ease;
      border-radius: 5px;
      user-select: none;
      z-index: var(--midiumIndex);
      animation: show-notification ${Notify.transition}s ease-out forwards;
      background-color: ${
        type === NotifyType.FAILURE
          ? "var(--error)"
          : type === NotifyType.WARNING
          ? "var(--warning)"
          : "var(--success)"
      };
    `;

    const $textNotification: HTMLParagraphElement = document.createElement("p");

    $textNotification.style.cssText = `
      font-family: sans-serif;
      font-weight: 600;
    `;

    $textNotification.textContent = `${
      type === NotifyType.FAILURE
        ? "FAILURE"
        : type === NotifyType.WARNING
        ? "WARNING"
        : "SUCCESS"
    }: ${text}`;

    const $closeNotification: HTMLButtonElement =
      document.createElement("button");

    $closeNotification.textContent = "x";
    $closeNotification.style.cssText = `
      font-size: 1rem;
      padding: 0 .3rem;
      background-color: transparent;
      border: 2px solid white;
      cursor: pointer;
      border-radius: 50%;
      margin-left: 15px;
    `;
    $closeNotification.addEventListener("click", () =>
      this.delete($notificationContainer, true)
    );

    const $styles = document.createElement("style");

    $notificationContainer.appendChild($textNotification);
    $notificationContainer.appendChild($closeNotification);

    $styles.innerHTML = `
      @keyframes show-notification {
        0% { right: -100vw; }
        100% { right: 15px; }
      }

      @keyframes disappear-notification {
        0% { right: 15px; opacity: 1 }
        100% { right: -100vw; opacity: 0 }
      }
    `;
    document.head.appendChild($styles);
    document.querySelector("main")!.appendChild($notificationContainer);

    this.notifications.unshift({
      notification: $notificationContainer,
      timeout: setTimeout(() => {
        this.delete($notificationContainer, false);
      }, 8000),
    });

    this.updatePositions();
  }

  private updatePositions() {
    this.notifications.forEach(({ notification }, index) => {
      notification.style.bottom = `${
        (notification.getBoundingClientRect().height + 10) * index +
        Notify.margin
      }px`;
    });
  }

  private delete($notificationContainer: HTMLDivElement, stopTimeout: boolean) {
    const index = this.notifications.findIndex(
      (el) => el.notification === $notificationContainer
    );

    const { notification, timeout } = this.notifications.splice(index, 1)[0];

    if (stopTimeout) clearTimeout(timeout);

    notification.style.animation = `disappear-notification ${Notify.transition}s ease forwards`;

    setTimeout(() => {
      notification.remove();
      this.updatePositions();
    }, Notify.transition * 600);
  }
}
