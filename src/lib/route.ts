export const Search = "/search"
export const Rating = "/rating"
export const Help = "/help"
export const Profile = "/profile"
export const Signout = "/signout"
export const Signin = "/signin"

export namespace Mandela {
    export const Root = "/mandela"
    export const Append = `${Root}/append`
    export const Id = (id: number) => `${Root}/${id}`
    export const Edit = (id: number) => `${Root}/${id}/edit`
}

export namespace Forum {
    export const Root = "/forum"
    export const New = `${Forum.Root}/new`

    export namespace Category {
        export const Root = `${Forum.Root}/category`
        export const Append = `${Root}/append`
        export const Id = (id: number) => `${Root}/${id}`
        export const Edit = (id: number) => `${Root}/${id}/edit`
    }

    export namespace Section {
        export const Root = `${Forum.Root}/section`
        export const Append = (id: number) => `${Category.Id(id)}/section/append`
        export const Id = (id: number) => `${Root}/${id}`
        export const Edit = (id: number) => `${Root}/${id}/edit`
    }

    export namespace Topic {
        export const Root = `${Forum.Root}/topic`
        export const Append = (id: number) => `${Section.Id(id)}/topic/append`
        export const Id = (id: number) => `${Root}/${id}`
        export const Edit = (id: number) => `${Root}/${id}/edit`
    }

    export namespace Post {
        export const Root = `${Forum.Root}/post`
        export const Append = (id: number) => `${Topic.Id(id)}/post/append`
        export const Id = (id: number) => `${Root}/${id}`
        export const Edit = (id: number) => `${Root}/${id}/edit`
    }
}

export namespace Register {
    export const Root = "/register"
    export const UserId = (id: number) => `${Root}/user/${id}`
}

export namespace Feed {
    export const Root = "/feed"
}
