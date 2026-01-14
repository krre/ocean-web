export function printMessage(code: number, message: string): string {
    return codeToMessage(code) || message;
}

function codeToMessage(code: number): string {
    const message = errors[code]
    return message ? `${message} (код ${code})` : "Неизвестная ошибка";
}

interface Error {
    [key: number]: string | undefined
}

const errors: Error = {
    1: "Ошибка парсинга",
    2: "Контроллер не найден",
    3: "Метод не найден",
    4: "Параметр не найден",
    5: "Внутренняя ошибка сервера",
    6: "Неверный параметр",
    7: "Запись не найдена",
    100: "Неправильный ИД или пароль",
    101: "Срок действия ИД истёк",
    102: "Аккаунт заблокирован",
    103: "Доступ запрещён"
}

export enum Code {
    AccountBlocked = 102
}
