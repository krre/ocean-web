export namespace Account {
    export const Admin = "admin";
    export const User = "user";
    export const Anonym = "anonym";

    export const ModeNames: Record<string, string> = {
        [Admin]: "Администратор",
        [User]: "Пользователь",
        [Anonym]: "Аноним"
    };
}

export namespace Mandela {
    export namespace Title {
        export const Simple = 0;
        export const Complex = 1;
    }

    export namespace Catalog {
        export const PageLimit = 50;
    }

    export namespace Activity {
        export const PageLimit = 5;
    }

    export namespace Comment {
        export const PageLimit = 50;
    }
}

export const Categories = [
    "названия",
    "фразы",
    "кинофильмы",
    "мультфильмы",
    "песни",
    "религия",
    "библия",
    "наука",
    "история",
    "искусство",
    "архитектура",
    "ландшафт",
    "карта",
    "растения",
    "животные",
    "статуи",
    "картины",
    "личности",
    "техника",
    "литература",
    "человек"
];

export const Votes = ["Да, это мандела", "Нет, всегда так было", "Затрудняюсь ответить", "Ерунда какая-то"];
export const VoteColors = ["#e4ffe4", "#ffe4e4", "#fdffcf", "#c6c6c6"];
export const Genders = ["Мужской", "Женский", "Неизвестен"]

export namespace Forum {
    export namespace Post {
        export const PageLimit = 30;
    }
}
