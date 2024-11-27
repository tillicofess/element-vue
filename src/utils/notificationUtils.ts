import {ElNotification} from "element-plus";

interface NotificationOptions {
    title?: string;
    message: string;
    type?: string;
}

const notify = ({
                    message,
                    type = "success",
                    title = "Notification",
                }: NotificationOptions): void => {
    ElNotification({
        title,
        message,
        type,
    } as any);
};

/**
 * 显示成功通知
 * @param message - 要显示的字符串消息
 */
export const openSuccess = (message: string): void => {
    notify({message, type: "success", title: "Success"});
};

/**
 * 显示失败通知
 * @param message - 要显示的字符串消息
 */
export const openWarning = (message: string): void => {
    notify({message, type: "warning", title: "Warning"});
};
